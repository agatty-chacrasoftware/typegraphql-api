import { ServerError } from "../../utils/errorHelper/serverError";
import { logger } from "../../utils/loggerHelper/logger";
import { MiddlewareFn } from "type-graphql";

export const RequestTimerMiddleware: MiddlewareFn<any> = async (
	{ context, info },
	next
) => {
	//Added this if statement to prevent middleware running on every field
	if (context.requestTimerInitialized) {
		return next();
	}

	context.requestTimerInitialized = true;

	var resolverType = info.parentType.name;
	var resolverName = info.fieldName;

	const start = Date.now();
	try {
		await next();
		const resolveTime = Date.now() - start;

		logger.info(`${resolverType}.${resolverName} [${resolveTime} ms]`);

		if (resolveTime >= 10000) {
			logger.warn("[REQUEST TIMER] Request took more than 10 seconds", {
				correlationId: context.correlationId,
				resolverType,
				resolverName,
				resolveTime,
			});
		}

		//Null check added because context is null when a subscription is triggered.
		if (context?.res) {
			context.res.status = 200;
		}
	} catch (err) {
		const resolveTime = Date.now() - start;

		var serverError = err as ServerError;

		logger.info(`${resolverType}.${resolverName} [${resolveTime} ms]`);

		if (resolveTime >= 10000) {
			logger.warn(`[REQUEST TIMER] Request took more than 10 seconds`, {
				correlationId: context.correlationId,
				resolverType,
				resolverName,
				resolveTime,
			});
		}

		//Null check added because context is null when a subscription is triggered.
		if (context?.res) {
			context.res.status = serverError.statusCode;
		}

		throw serverError;
	}
};
