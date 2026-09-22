import type { DelayPrediction } from '@railmind/contracts';
/** @deprecated Inference is provided by services/ml through ml-client.ts. */
export function predictDelay():DelayPrediction { throw new Error('Use requestDelayPrediction through the Python ML service.'); }
