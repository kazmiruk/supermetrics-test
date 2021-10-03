import axios from "axios";
import MockAdapter from "axios-mock-adapter";

import {
  AverageNumberOfPostsPerUserProcessor,
  AveragePostLengthProcessor,
  LongestPostLengthProcessor,
  TotalPostsProcessor,
} from "./processors";
import { StatsAggregator } from "./stats-aggregator";
import { Post } from "./types";

const createString = (char: string, length: number) =>
  new Array(length + 1).join(char);

const responses: Post[][] = [
  [
    {
      created_time: "2021-10-05T16:59:39.694Z",
      from_id: "1",
      from_name: "User 1",
      id: "1",
      message: createString("a", 10),
      type: "status",
    },
    {
      created_time: "2021-10-01T10:32:39.312Z",
      from_id: "2",
      from_name: "User 2",
      id: "2",
      message: createString("a", 15),
      type: "status",
    },
  ],
  [
    {
      created_time: "2021-10-02T13:09:49.554Z",
      from_id: "1",
      from_name: "User 1",
      id: "3",
      message: createString("a", 10),
      type: "status",
    },
    {
      created_time: "2021-09-30T10:32:39.312Z",
      from_id: "3",
      from_name: "User 3",
      id: "4",
      message: createString("a", 7),
      type: "status",
    },
  ],
  [
    {
      created_time: "2021-09-10T13:09:49.554Z",
      from_id: "1",
      from_name: "User 1",
      id: "5",
      message: createString("a", 13),
      type: "status",
    },
  ],
];

const mockedUrls = [
  "http://mocked.com/1",
  "http://mocked.com/2",
  "http://mocked.com/3",
];

describe("Stats Aggregator", () => {
  const mock = new MockAdapter(axios);

  beforeEach(() => {
    mock.reset();
    mock.onGet(mockedUrls[0]).replyOnce(200, { data: { posts: responses[0] } });
    mock.onGet(mockedUrls[1]).replyOnce(200, { data: { posts: responses[1] } });
    mock.onGet(mockedUrls[2]).replyOnce(200, { data: { posts: responses[2] } });
  });

  it("Check AveragePostLengthProcessor", async () => {
    const averagePostLengthProcessor = new AveragePostLengthProcessor();
    const statsAggregator = new StatsAggregator([averagePostLengthProcessor]);
    const stats = await statsAggregator.process(mockedUrls);

    expect(stats).toEqual({
      months: {
        Oct: { average_post_length: 11.666666666666666 },
        Sep: { average_post_length: 10 },
      },
    });
  });

  it("Check AverageNumberOfPostsPerUserProcessor", async () => {
    const averageNumberOfPostsPerUserProcessor =
      new AverageNumberOfPostsPerUserProcessor();
    const statsAggregator = new StatsAggregator([
      averageNumberOfPostsPerUserProcessor,
    ]);
    const stats = await statsAggregator.process(mockedUrls);

    expect(stats).toEqual({
      months: {
        Oct: { average_number_of_posts_per_user: 1.5 },
        Sep: { average_number_of_posts_per_user: 1 },
      },
    });
  });

  it("Check LongestPostLengthProcessor", async () => {
    const longestPostLengthProcessor = new LongestPostLengthProcessor();
    const statsAggregator = new StatsAggregator([longestPostLengthProcessor]);
    const stats = await statsAggregator.process(mockedUrls);

    expect(stats).toEqual({
      months: {
        Oct: { longest_post_length: 15 },
        Sep: { longest_post_length: 13 },
      },
    });
  });

  it("Check TotalPostsProcessor", async () => {
    const totalPostsProcessor = new TotalPostsProcessor();
    const statsAggregator = new StatsAggregator([totalPostsProcessor]);
    const stats = await statsAggregator.process(mockedUrls);

    expect(stats).toEqual({
      weeks: {
        36: { total_posts: 1 },
        39: { total_posts: 3 },
        40: { total_posts: 1 },
      },
    });
  });

  it("Check with all processors", async () => {
    const averagePostLengthProcessor = new AveragePostLengthProcessor();
    const averageNumberOfPostsPerUserProcessor =
      new AverageNumberOfPostsPerUserProcessor();
    const longestPostLengthProcessor = new LongestPostLengthProcessor();
    const totalPostsProcessor = new TotalPostsProcessor();

    const statsAggregator = new StatsAggregator([
      averagePostLengthProcessor,
      averageNumberOfPostsPerUserProcessor,
      longestPostLengthProcessor,
      totalPostsProcessor,
    ]);
    const stats = await statsAggregator.process(mockedUrls);

    expect(stats).toEqual({
      months: {
        Oct: {
          longest_post_length: 15,
          average_number_of_posts_per_user: 1.5,
          average_post_length: 11.666666666666666,
        },
        Sep: {
          longest_post_length: 13,
          average_number_of_posts_per_user: 1,
          average_post_length: 10,
        },
      },
      weeks: {
        36: { total_posts: 1 },
        39: { total_posts: 3 },
        40: { total_posts: 1 },
      },
    });
  });
});
