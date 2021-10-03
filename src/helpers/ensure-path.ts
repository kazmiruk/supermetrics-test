import { RawStats } from "../stats-processor/types";

export const ensurePath = <P>(
  rawStats: RawStats,
  path: string,
  lastValue: P
): RawStats => {
  const names = path.split(".");
  const newRawStats: RawStats = { ...rawStats };
  let base = newRawStats;

  for (let i = 0; i < names.length - 1; i++) {
    base[names[i]] = base[names[i]] || {};
    base = base[names[i]];
  }

  base[names[names.length - 1]] = base[names[names.length - 1]] || lastValue;

  return newRawStats;
};
