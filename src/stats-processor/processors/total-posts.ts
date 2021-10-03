import moment from "moment";

import { ensurePath } from "../../helpers";
import { Processor } from "../../interfaces";
import { Post, TotalPosts, RawTotalPosts, RawStats } from "../types";

export class TotalPostsProcessor implements Processor {
  public readonly key = "total_posts";

  public map(rawStats: RawStats, post: Post): RawStats {
    const createdDate = moment(post.created_time);
    const week = createdDate.isoWeek();

    const newRawStats = ensurePath<RawTotalPosts>(
      rawStats,
      `weeks.${week}.${this.key}`,
      0
    );
    newRawStats.weeks[week][this.key] += 1;

    return newRawStats;
  }

  public reduce(
    leftValue: RawTotalPosts,
    rightValue: RawTotalPosts
  ): RawTotalPosts {
    return leftValue + rightValue;
  }

  public combine(rawStatValue: RawTotalPosts): TotalPosts {
    return rawStatValue;
  }
}
