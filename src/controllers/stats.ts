import { Request, Response } from "express";

import { getPostsPageUrl, getToken, resetToken } from "../helpers";
import {
  AverageNumberOfPostsPerUserProcessor,
  AveragePostLengthProcessor,
  LongestPostLengthProcessor,
  TotalPostsProcessor,
} from "../stats-processor/processors";
import { StatsAggregator } from "../stats-processor/stats-aggregator";
import { Stats } from "../stats-processor/types/stats";

const getStats = async (
  req: Request,
  res: Response
): Promise<Response<Stats>> => {
  let token: string;

  try {
    token = await getToken();
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: `Register token request error: ${(err as Error).message}`,
    });
  }

  const urls = [...Array(10).keys()].map((i) => getPostsPageUrl(token, i + 1));

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

  try {
    const stats = await statsAggregator.process(urls);

    return res.status(200).json(stats);
  } catch (err) {
    console.log(err);
    resetToken();

    return res
      .status(500)
      .json({ message: `Stats processing failed: ${(err as Error).message}` });
  }
};

export default { getStats };
