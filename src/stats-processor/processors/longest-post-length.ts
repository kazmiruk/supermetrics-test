import moment from "moment";

import { Processor } from "../../interfaces";
import { ensurePath } from "../../helpers";
import {
  LongestPostLength,
  Post,
  RawLongestPostLength,
  RawStats,
} from "../types";

export class LongestPostLengthProcessor implements Processor {
  public readonly key = "longest_post_length";

  public map(rawStats: RawStats, post: Post): RawStats {
    const createdDate = moment(post.created_time);
    const month = createdDate.format("MMM");
    const postLength = post.message.length;

    const newRawStats = ensurePath<RawLongestPostLength>(
      rawStats,
      `months.${month}.${this.key}`,
      0
    );

    if (postLength > newRawStats.months[month][this.key]) {
      newRawStats.months[month][this.key] = postLength;
    }

    return newRawStats;
  }

  public reduce(
    leftValue: RawLongestPostLength,
    rightValue: RawLongestPostLength
  ): RawLongestPostLength {
    return Math.max(leftValue, rightValue);
  }

  public combine(rawStatValue: RawLongestPostLength): LongestPostLength {
    return rawStatValue;
  }
}
