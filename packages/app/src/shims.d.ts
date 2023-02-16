/// <reference types="vite/client" />

declare module '*.vue' {
  import { defineComponent } from 'vue'
  export default defineComponent
}

declare module 'html-to-docx' {
  interface Margins {
    top: number
    right: number
    bottom: number
    left: number
    header: number
    footer: number
    gutter: number
  }

  interface Row {
    cantSplit?: boolean
  }

  interface Table {
    row?: Row
  }

  export interface DocumentOptions {
    orientation?: 'portrait' | 'landscape'
    margins?: Margins
    title?: string
    subject?: string
    creator?: string
    keywords?: string[]
    description?: string
    lastModifiedBy?: string
    revision?: number
    createdAt?: Date
    modifiedAt?: Date
    headerType?: 'default' | 'first' | 'even'
    header?: boolean
    footerType?: 'default' | 'first' | 'even'
    footer?: boolean
    font?: string
    fontSize?: number
    complexScriptFontSize?: number
    table?: Table
    pageNumber?: boolean
    skipFirstHeaderFooter?: boolean
  }

  /**
   * @param htmlString <String> clean html string equivalent of document content.
   * @param headerHTMLString <String> clean html string equivalent of header. Defaults to <p></p> if header flag is true.
   * @param documentOptions <DocumentOptions>
   * @param footerHTMLString <String> clean html string equivalent of footer. Defaults to <p></p> if footer flag is true.
   * @constructor
   * @private
   */
  export default function HTMLtoDOCX(
    htmlString: string,
    headerHTMLString: string | null,
    documentOptions: DocumentOptions,
    footerHTMLString?: string
  ): Promise<Buffer>
}

declare namespace globalThis {
  import type { MessageApi } from 'naive-ui'
  import type { Router } from 'vue-router'
  const $message: MessageApi
  const $router: Router
  interface Window {
    $message: MessageApi
    $router: Router
  }
}
