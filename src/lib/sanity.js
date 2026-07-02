
import { createClient } from '@sanity/client'
import { createImageUrlBuilder } from '@sanity/image-url'  // ← named export (not default)

export const client = createClient({
  projectId: 'stpdpina',   // ← replace with your real project ID
  dataset:   'production',
  apiVersion: '2024-01-01',
  useCdn:    true,
})

const builder = createImageUrlBuilder(client)

export const urlFor = (source) => builder.image(source)