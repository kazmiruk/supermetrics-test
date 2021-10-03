import { Post } from "./post";

export type PageData = {
  meta: {
    request_id: string;
  };
  data: {
    page: number;
    posts: Post[];
  };
};
