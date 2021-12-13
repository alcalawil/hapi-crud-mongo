import setupServer from './api/server.js';
import { startDb } from './data/db/index.js';

async function main() {
	try {
		await startDb();
		console.log('DB Connected');

		// start server
		const server = await setupServer();
		await server.start();
		console.log(`Server Started on ${server.info.uri}`);
	} catch (err) {
		console.log(err);
		process.exit(1);
	}
}

main();
