// src/sanity/lib/client.ts
import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, 
  stega: {
    enabled: process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_VIEW_MODE === 'preview',
    studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || '/studio',
  },
})