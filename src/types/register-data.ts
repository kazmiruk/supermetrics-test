export type RegisterRequestData = {
  client_id: string;
  email: string;
  name: string;
};

export type RegisterResponseData = {
  meta: {
    request_id: string;
  };
  data: {
    client_id: string;
    email: string;
    sl_token: string;
  };
};
