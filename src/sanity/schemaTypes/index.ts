import { type SchemaTypeDefinition } from 'sanity'

import { blockContentType } from './blockContentType'
import { categoryType } from './categoryType'
import { postType } from './postType'
import { authorType } from './authorType'
import { journalType } from './journalType'
import documentationType from './documentationType' // Pastikan file ini pake export const
import portfolioItemType from './portfolioItemType' // Pastikan file ini pake export const

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Dasar/Utility
    blockContentType,
    categoryType,
    authorType,
    
    // Content/Features
    journalType,        // The Heart (Personal)
    documentationType,  // The Brain (Technical)
    postType,           // The Voice (Public)
    portfolioItemType,  // The Proof (Professional)
  ],
}