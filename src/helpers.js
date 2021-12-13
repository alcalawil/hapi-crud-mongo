export function getBaseFromPair(pair) {
	return pair.slice(0,3);
}

export function getQuoteFromPair(pair) {
	return pair.slice(3);
}

export function calculateFeeAmount(originalRate, feePercent) {
	return (originalRate * feePercent) / 100;
}
