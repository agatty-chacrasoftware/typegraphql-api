import { ServerError } from "./serverError";

export class NotAuthorizedError extends ServerError {
	constructor(message: string, loggingErrorBody?: {}) {
		super(message, loggingErrorBody);
		this.errorCode = "Not Authorized";
		this.statusCode = 401;
	}
}
