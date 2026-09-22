import type { Severity, TrainStatus } from '@railmind/contracts';
export function StatusBadge({ value }: { value: TrainStatus | Severity }) { return <span className={`badge ${value.replace('_', '-')}`}>{value.replace('_', ' ')}</span>; }
export function DemoBadge() { return <span className="demo-badge">DEMO / SIMULATION</span>; }
