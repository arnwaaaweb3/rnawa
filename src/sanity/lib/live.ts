import {defineLive} from 'next-sanity/live';
import { client } from "./client";
import { apiVersion } from "../env";

// Token rahasia nggo server-side fetching
const serverToken = process.env.SANITY_API_READ_TOKEN; 

// Token publik nggo real-time update nang browser
const browserToken = process.env.NEXT_PUBLIC_SANITY_API_VIEWER_TOKEN;

export const { sanityFetch, SanityLive } = defineLive({ 
  client: client.withConfig({ 
    apiVersion, 
  }),
  serverToken,
  browserToken,
});