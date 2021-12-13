import mongoose from 'mongoose';

const RateSchema = new mongoose.Schema({
	pair: { type: String, unique: true },
	originalRate: Number,
	feePercent: Number,
	feeAmount: Number,
	totalRate: Number
});

export const RateModel = mongoose.model('rate', RateSchema);