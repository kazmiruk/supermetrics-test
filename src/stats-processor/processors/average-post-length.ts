import moment from "moment";

import { Processor } from "../../interfaces";
import { ensurePath } from "../../helpers";
import {
  AveragePostLength,
  Post,
  RawAveragePostLength,
  RawStats,
} from "../types";

export class AveragePostLengthProcessor implements Processor {
  public readonly key = "average_post_length";

  public map(rawStats: RawStats, post: Post): RawStats {
    const createdDate = moment(post.created_time);
    const month = createdDate.format("MMM");
    const postLength = post.message.length;

    const newRawStats = ensurePath<RawAveragePostLength>(
      rawStats,
      `months.${month}.${this.key}`,
      {
        _sum_length: 0,
        _number_of_posts: 0,
      }
    );

    newRawStats.months[month][this.key]._sum_length += postLength;
    newRawStats.months[month][this.key]._number_of_posts += 1;

    return newRawStats;
  }

  public reduce(
    leftValue: RawAveragePostLength,
    rightValue: RawAveragePostLength
  ): RawAveragePostLength {
    return {
      _sum_length: leftValue._sum_length + rightValue._sum_length,
      _number_of_posts:
        leftValue._number_of_posts + rightValue._number_of_posts,
    };
  }

  public combine(rawStatValue: RawAveragePostLength): AveragePostLength {
    return rawStatValue._sum_length / rawStatValue._number_of_posts;
  }
}
