import Hapi from '@hapi/hapi';
import { routes } from './routes.js';
import Inert from '@hapi/inert';
import Vision from '@hapi/vision';
import HapiSwagger from 'hapi-swagger';

async function setupServer() {
	const server = Hapi.server({
		port: 3000,
		host: '0.0.0.0'
	});

	server.route({
		method: 'GET',
		path: '/',
		handler: (request, h) => 'Api is running'
	});

	server.route(routes);
	
	// Add swagger docs
	const swaggerOptions = {
		info: {
			title: 'Rates API Docs',
			version: '1.0.0',
		}
	};

	await server.register([
		Inert,
		Vision,
		{
			plugin: HapiSwagger,
			options: swaggerOptions
		}
	]);

	// TODO:Add api key authentication

	return server;
}

export default setupServer;