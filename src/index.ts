import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { buildSchema } from "type-graphql";
import admin from "firebase-admin";
import { initializeApp } from "firebase/app";
import { graphqlUploadExpress } from "graphql-upload";
import { GraphQLError } from "graphql";
import cloudinary from "cloudinary";

import { logger } from "./utils/loggerHelper/logger";

import { MoesifMiddleware } from "./utils/analyticsHelper/moesifMiddleware";
import { ErrorLoggerMiddleware } from "./graphql/middleware/errorLoggerMiddleware";
import { RequestTimerMiddleware } from "./graphql/middleware/requestTimerMiddleware";
import { CorrelationIdMiddleware } from "./graphql/middleware/correlationIdMiddleware";

import dotenv from "dotenv";
dotenv.config();

const main = async () => {
	const schema = await buildSchema({
		resolvers: [
			"Add your resolver"
		],
		globalMiddlewares: [
			ErrorLoggerMiddleware,
			RequestTimerMiddleware,
			CorrelationIdMiddleware,
		],
	});

	const apolloServer = new ApolloServer({
		schema,
		context: ({ req, res }) => ({
			req,
			res,
		}),
		formatError: (error: GraphQLError) => {
			return {
				message: error.message,
				status: error.originalError,
			};
		},
	});

	const app = Express();

	await apolloServer.start();

	app.use(graphqlUploadExpress());
	app.use(MoesifMiddleware);

	apolloServer.applyMiddleware({ app });

	// Initialize using firebase adin SDK
	// This is used to generate customized token.
	const serviceAccount = require("../serviceAccountKey.json");
	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
	});

	// Initialize using firebase config
	// Used to verify the customized token.
	const firebaseConfig = require("../firebaseConfig.json");
	initializeApp(firebaseConfig);

	// Cloudinary config initialization
	cloudinary.v2.config({
		cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
		api_key: process.env.CLOUDINARY_API_KEY,
		api_secret: process.env.CLOUDINARY_API_SECRET,
		folder: process.env.CLOUDINARY_FOLDER,
	});

	app.listen(parseInt(process.env.PORT), () => {
		logger.info(
			`server started on http://localhost:${process.env.PORT}/graphql`
		);
	});
};

main();
