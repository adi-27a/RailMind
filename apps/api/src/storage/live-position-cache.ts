import type { TrainPosition } from '@railmind/contracts';

/** Redis adapter for high-frequency positions; providers remain independent of this cache. */
export interface KeyValueStore { get(key: string): Promise<string | null>; set(key: string, value: string, mode: 'EX', seconds: number): Promise<unknown>; }
export class LivePositionCache {
  constructor(private readonly store: KeyValueStore) {}
  async put(position: TrainPosition): Promise<void> { await this.store.set(`railmind:train-position:${position.trainRunId}`, JSON.stringify(position), 'EX', 90); }
  async get(trainRunId: string): Promise<TrainPosition | undefined> { const value = await this.store.get(`railmind:train-position:${trainRunId}`); return value ? JSON.parse(value) as TrainPosition : undefined; }
}
