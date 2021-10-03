import axios from "axios";

import { Processor } from "../interfaces";

import { PageData, Post, RawStats } from "./types";
import { Stats } from "./types/stats";

export class StatsAggregator {
  private processors: Record<string, Processor>;
  private processorNames: string[];

  constructor(processors: Processor[]) {
    this.processors = {};

    processors.forEach((processor) => {
      this.processors[processor.key] = processor;
    });

    this.processorNames = processors.map((processor) => processor.key);
  }

  public async process(urls: string[]): Promise<Stats> {
    return await axios
      .all(
        urls.map((url) =>
          axios.get<PageData>(url).then((response) => {
            return this.map(response.data.data.posts);
          })
        )
      )
      .then(
        axios.spread((...responses) => {
          const rawStats = responses.reduce(this.reduce);

          return this.combine(rawStats);
        })
      );
  }

  private map(posts: Post[]): RawStats {
    const processorsList = Object.values(this.processors);
    let rawStats: RawStats = {};

    posts.forEach((post) =>
      processorsList.forEach((processor) => {
        rawStats = processor.map(rawStats, post);
      })
    );

    return rawStats;
  }

  private reduce = (accumulator: RawStats, rawStats: RawStats) => {
    const nextAccumulator: RawStats = { ...accumulator };

    Object.keys(rawStats).forEach((key) => {
      if (key in nextAccumulator) {
        if (this.processorNames.includes(key)) {
          nextAccumulator[key] = this.processors[key].reduce(
            nextAccumulator[key],
            rawStats[key]
          );
        } else {
          nextAccumulator[key] = this.reduce(
            nextAccumulator[key],
            rawStats[key]
          );
        }
      } else {
        nextAccumulator[key] = { ...rawStats[key] };
      }
    });

    return nextAccumulator;
  };

  private combine(rawStats: RawStats): Stats {
    const stats: Stats = {};

    Object.keys(rawStats).forEach((key) => {
      if (this.processorNames.includes(key)) {
        stats[key] = this.processors[key].combine(rawStats[key]);
      } else {
        stats[key] = this.combine(rawStats[key]);
      }
    });

    return stats;
  }
}
