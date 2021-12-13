import { ratesService } from '../services/index.js';

const ALLOWED_PAIRS = [
	'EURUSD',
	'EURARS',
	'USDARS',
	'EURBRL',
	'USDBRL',
	'BRLARS'
];

async function createRate(req, h) {
	try {
		const { pair, feePercent } = req.payload;

		if (!ALLOWED_PAIRS.includes(pair)) return h.response({ error: 'pair is invalid' }).code(400);

		const result = await ratesService.createRate(pair, feePercent);
	
		return h.response(result).code(201); 
	} catch (err) {
		if (err.code === 11000) return h.response({ error: 'Rate already exists'}).code(409);
		else throw err;
	}
}

async function getRatelist(req, h) {
	return ratesService.getRateList();
}

async function updateFee(req, h) {
	const pair  = req.params.pair;
	const feePercent  = req.payload.feePercent;
	
	if (typeof feePercent !== 'number') return h.response({ error: 'feePercent is invalid' }).code(400);
	if (!ALLOWED_PAIRS.includes(pair)) return h.response({ error: 'pair is invalid' }).code(400);

	// update fee 
	const result = await ratesService.updateFee(pair, feePercent);
	if (!result) return h.response({ error: 'Rate not found' }).code(404);

	return h.response(result).code(201);
}

async function deleteRate(req, h) {
	return ratesService.deleteRate(req.params.pair);
}

// common route options
const options = { tags: ['api'] };

export const routes = [
	{ method: 'GET', path: '/rate', handler: getRatelist, options },
	{ method: 'POST', path: '/rate', handler: createRate, options },
	{ method: 'PATCH', path: '/rate/{pair}/fee', handler: updateFee, options },
	{ method: 'DELETE', path: '/rate/{pair}', handler: deleteRate, options }
];