import { calculateFeeAmount, getBaseFromPair, getQuoteFromPair } from '../helpers.js';

const DEFAULT_BASE_CURRENCY = process.env.DEFAULT_BASE_CURRENCY;

export function makeRatesService({ RateModel, getFXRate }) {
	async function createRate(pair, feePercent = 0) {
		let originalRate = await getFXRate(pair);

		if (originalRate === null) {
			console.warn(`Could not find rate for pair ${pair}. Forcing conversion`);
			originalRate = await calculateConvertedRate(pair);
		}

		const feeAmount = calculateFeeAmount(originalRate, feePercent);

		const obj = await RateModel.create({
			pair,
			originalRate,
			feePercent,
			feeAmount,
			totalRate: originalRate + feeAmount 
		});

		return obj;
	}

	async function getRateList() {
		return RateModel.find({});
	}	

	async function updateFee(pair, feePercent) {
		const doc = await RateModel.findOne({ pair });

		if (!doc){
			console.error(`Could not find rate for pair ${pair}`);
			return false;
		}

		const { originalRate } = doc;
		const feeAmount = calculateFeeAmount(originalRate , feePercent);
		const totalRate = originalRate + feeAmount;

		const updatedRate = RateModel.findOneAndUpdate({ pair }, { feePercent, feeAmount, totalRate }, { new: true });
		return updatedRate;
	}

	async function deleteRate(pair) {
		return RateModel.findOneAndDelete({ pair });		
	}

	async function calculateConvertedRate(pair) {
		// 1. Get base and quote currencies
		const base = getBaseFromPair(pair);
		const quote = getQuoteFromPair(pair);

		// 2. Get base and quote rates
		const baseRateP = getFXRate(`${DEFAULT_BASE_CURRENCY}${base}`);
		const quoteRateP = getFXRate(`${DEFAULT_BASE_CURRENCY}${quote}`);
		const [baseRate, quoteRate] = await Promise.all([baseRateP, quoteRateP]);
		console.debug(`base rate: ${baseRate} quote rate: ${quoteRate}`);
		
		// 3. Calculate converted rate
		const convertedRate = quoteRate / baseRate;

		return convertedRate; 
	}

	return Object.freeze({
		createRate,
		getRateList,
		updateFee,
		deleteRate
	});
}
