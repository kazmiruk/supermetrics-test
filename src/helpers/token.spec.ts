import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { advanceTo } from "jest-date-mock";
import moment from "moment";

import { getToken, resetToken, tokenRegisterUrl } from "./token";

describe("token", () => {
  const mock = new MockAdapter(axios);

  beforeEach(() => {
    mock.reset();
    advanceTo(moment().toDate());
    resetToken();
  });

  it("check caching of token", async () => {
    const firstToken = "first_token";
    const secondToken = "second_token";

    mock
      .onPost(tokenRegisterUrl)
      .replyOnce(200, { data: { sl_token: firstToken } });
    mock
      .onPost(tokenRegisterUrl)
      .replyOnce(200, { data: { sl_token: secondToken } });

    expect(await getToken()).toEqual(firstToken);
    expect(await getToken()).toEqual(firstToken);
  });

  it("check ttl of token", async () => {
    const firstToken = "first_token";
    const secondToken = "second_token";

    mock
      .onPost(tokenRegisterUrl)
      .replyOnce(200, { data: { sl_token: firstToken } });
    mock
      .onPost(tokenRegisterUrl)
      .replyOnce(200, { data: { sl_token: secondToken } });

    expect(await getToken()).toEqual(firstToken);

    advanceTo(moment().add(1, "hour").toDate());

    expect(await getToken()).toEqual(secondToken);
  });

  it("check of token reset", async () => {
    const firstToken = "first_token";
    const secondToken = "second_token";

    mock
      .onPost(tokenRegisterUrl)
      .replyOnce(200, { data: { sl_token: firstToken } });
    mock
      .onPost(tokenRegisterUrl)
      .replyOnce(200, { data: { sl_token: secondToken } });

    expect(await getToken()).toEqual(firstToken);
    resetToken();
    expect(await getToken()).toEqual(secondToken);
  });

  it("error while getting token", async () => {
    mock.onPost(tokenRegisterUrl).replyOnce(400);
    let error: Error | null = null;

    try {
      await getToken();
    } catch (err) {
      error = err as Error;
    }

    expect(error?.message).toEqual("Failed to get token");
  });
});
