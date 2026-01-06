'use client'

import React from 'react'
import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
// Perbaikan di sini: Menggunakan LayoutProps
import type { LayoutProps } from 'sanity' 
import { codeInput } from '@sanity/code-input'
import { apiVersion, dataset, projectId } from './src/sanity/env'
import { schema } from './src/sanity/schemaTypes'
import { structure } from './src/sanity/structure'

function CustomStudioLayout(props: LayoutProps) {
  return (
    <>
      <style>{`
        :root {
          --icon-size: 1.25rem;
        }

        [data-ui="Box"] svg, 
        [data-ui="Button"] svg,
        [data-testid="global-search"] svg,
        [data-ui="Text"] svg {
          width: var(--icon-size) !important;
          height: var(--icon-size) !important;
          font-size: var(--icon-size) !important;
        }

        [data-testid="global-search"] svg {
          transform: scale(1.1);
        }
      `}</style>

      {props.renderDefault(props)}
    </>
  )
}

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
    codeInput(),
  ],
  studio: {
    components: {
      layout: CustomStudioLayout,
    },
  },
})
