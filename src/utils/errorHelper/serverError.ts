export class ServerError extends Error {
	public statusCode: number;
	public errorCode: string;
	public loggingErrorBody: {};

	constructor(message: string, loggingErrorBody?: {}) {
		super(message);
		this.loggingErrorBody = loggingErrorBody;
		this.errorCode = "SERVER_ERROR";
		this.statusCode = 500;
	}
}
