import { Post, RawStats, RawValue } from "../stats-processor/types";

export interface Processor {
  readonly key: string;

  map(rawStats: RawStats, post: Post): RawStats;
  reduce(leftValue: RawValue, rightValue: RawValue): RawValue;
  combine(rawStatValue: RawValue): RawValue;
}
