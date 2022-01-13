import moesif from "moesif-nodejs";

export const MoesifMiddleware = moesif({
	applicationId: process.env.MOESIF_APPLICATION_ID,

	identifyUser: function (req) {
		return req.user ? req.user.id : undefined;
	},

	getSessionToken: function (req) {
		return req.headers["Authorization"];
	},
});
