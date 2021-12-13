import { getBaseFromPair, getQuoteFromPair } from '../helpers.js';

const FIXER_API_KEY = process.env.FIXER_API_KEY;
const BASE_URL = 'http://data.fixer.io/api';

export function makeFXProviderService({ httpClient }) {
	/**
     * Returns the exchange rate for the given pair.
     * @param {string} pair
     * @returns {Promise<number>}
     */
	async function getFXRate(pair) {
		const base = getBaseFromPair(pair);
		const quote = getQuoteFromPair(pair);

		const { data } = await httpClient.get(`${BASE_URL}/latest?base=${base}&symbols=${quote}&access_key=${FIXER_API_KEY}`);
		console.info(data);
		
		if (data.error) {
			console.log(data.error);
			if (data.error.code == 101) throw new Error('Invalid API key');
			if (data.error.code == 105) return null; // no data for this pair
			// unknown error
			throw new Error(data.error.info);
		}

		return data.rates[quote];
	}

	return Object.freeze({
		getFXRate
	});
}
