export const getPostsPageUrl = (token: string, page: number): string =>
  `https://api.supermetrics.com/assignment/posts?sl_token=${token}&page=${page}`;
