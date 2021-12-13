import { makeRatesService } from './rates.service.js';
import { RateModel } from '../data/models/index.js';
import { makeFXProviderService } from './fxProvider.service.js';
import axios from 'axios';

export const { getFXRate } = makeFXProviderService({ httpClient: axios });
export const ratesService = makeRatesService({ RateModel, getFXRate });
