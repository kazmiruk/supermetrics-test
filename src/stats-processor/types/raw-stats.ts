import {
  RawAverageNumberOfPostsPerUser,
  RawAveragePostLength,
  RawLongestPostLength,
  RawTotalPosts,
} from "./processors";

export type RawValue =
  | RawAverageNumberOfPostsPerUser
  | RawAveragePostLength
  | RawLongestPostLength
  | RawTotalPosts;

// TODO: implement dynamic raw stats schema checking on base of processors list
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RawStats = Record<string, any>;
