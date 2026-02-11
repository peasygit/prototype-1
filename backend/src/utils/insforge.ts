import { createClient } from '@insforge/sdk';

const config = {
  baseUrl: process.env.INSFORGE_API_URL || 'https://7jy9rxai.us-east.insforge.app',
  anonKey: process.env.INSFORGE_ANON_KEY || 'ik_79a7478f43b81c046050de130453fa02'
};

export const insforge = createClient(config);

export const createServiceClient = (token?: string) => {
  const client = createClient(config);
  if (token) {
    client.getHttpClient().setAuthToken(token);
  }
  return client;
};
