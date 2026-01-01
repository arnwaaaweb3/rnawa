import { type SchemaTypeDefinition } from 'sanity'

import {blockContentType} from './blockContentType'
import {categoryType} from './categoryType'
import {postType} from './postType'
import {authorType} from './authorType'
import portfolioItem from './portfolioItemType'
import documentation from './documentationType'
import {journalType} from './journalType'


export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType, 
    categoryType, 
    postType, 
    authorType,
    documentation,
    portfolioItem,
    journalType
  ],
}
