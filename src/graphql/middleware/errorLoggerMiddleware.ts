import { logger } from "../../utils/loggerHelper/logger";
import { MiddlewareFn } from "type-graphql";

export const ErrorLoggerMiddleware: MiddlewareFn<any> = async (
	{ context },
	next
) => {
	try {
		return await next();
	} catch (error) {
		logger.error(
			`ErrorCode: ${error.errorCode}. StatusCode: ${error.statusCode}. Message: ${error.message}`,
			{
				correlationId: context.correlationId,
				loggingError: error.loggingErrorBody,
			}
		);

		throw error;
	}
};
