import fetch, { Response } from 'node-fetch';

const post = async (url: string, data: unknown): Promise<Response> =>
  fetch(url, {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      'User-Agent': 'curl/7.74.0',
      'Content-Type': 'application/json',
    },
  });

export default post;
