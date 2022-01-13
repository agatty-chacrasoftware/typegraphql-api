import { MiddlewareFn } from "type-graphql";
import uuid4 from "uuid4";

export const CorrelationIdMiddleware: MiddlewareFn<any> = async (
	{ context },
	next
) => {
	if (context.responseCorrelationId) {
		return next();
	}

	context.responseCorrelationId = true;

	const correlationId = uuid4();

	context.correlationId = correlationId;
	context.res.setHeader("Correlation-Id", context.correlationId);

	return await next();
};
