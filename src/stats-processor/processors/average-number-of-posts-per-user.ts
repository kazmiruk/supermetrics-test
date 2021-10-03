import moment from "moment";

import { Processor } from "../../interfaces";
import { ensurePath } from "../../helpers";
import {
  AverageNumberOfPostsPerUser,
  Post,
  RawAverageNumberOfPostsPerUser,
  RawAverageNumberOfPostsPerUserValue,
  RawStats,
} from "../types";

export class AverageNumberOfPostsPerUserProcessor implements Processor {
  public readonly key = "average_number_of_posts_per_user";

  public map(rawStats: RawStats, post: Post): RawStats {
    const createdDate = moment(post.created_time);
    const month = createdDate.format("MMM");
    const userId = post.from_id;

    const newRawStats = ensurePath<RawAverageNumberOfPostsPerUserValue>(
      rawStats,
      `months.${month}.${this.key}._users.${userId}`,
      0
    );
    newRawStats.months[month][this.key]._users[userId] += 1;

    return newRawStats;
  }

  public reduce(
    leftValue: RawAverageNumberOfPostsPerUser,
    rightValue: RawAverageNumberOfPostsPerUser
  ): RawAverageNumberOfPostsPerUser {
    const users = { ...leftValue._users };

    Object.keys(rightValue._users).forEach((userId) => {
      users[userId] = (users[userId] || 0) + rightValue._users[userId];
    });

    return { _users: users };
  }

  public combine(
    rawStatValue: RawAverageNumberOfPostsPerUser
  ): AverageNumberOfPostsPerUser {
    const averageNumberOfPostsPerUserValues = Object.values(
      rawStatValue._users
    );

    return (
      averageNumberOfPostsPerUserValues.reduce(
        (accumulator, value) => accumulator + value
      ) / averageNumberOfPostsPerUserValues.length
    );
  }
}
