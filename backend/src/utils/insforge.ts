import { createClient } from '@insforge/sdk';

const config = {
  baseUrl: process.env.INSFORGE_API_URL || 'https://hxsd794u.us-east.insforge.app',
  anonKey: process.env.INSFORGE_ANON_KEY || 'ik_bf5fcd4ba1b958ecf0da0f5248757869'
};

export const insforge = createClient(config);

export const createServiceClient = (token?: string) => {
  const client = createClient(config);
  if (token) {
    client.getHttpClient().setAuthToken(token);
  }
  return client;
};
