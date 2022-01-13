import { ServerError } from "./serverError";

export class NotFoundError extends ServerError {
	constructor(message: string, loggingErrorBody?: {}) {
		super(message, loggingErrorBody);
		this.errorCode = "Not Found";
		this.statusCode = 404;
	}
}
