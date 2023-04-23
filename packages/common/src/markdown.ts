import MarkdownIt from 'markdown-it'

// import hljs from 'highlight.js'
// import 'highlight.js/scss/github-dark.scss'

export const md: MarkdownIt = new MarkdownIt({
  highlight(str, lang) {
  //   if (lang && hljs.getLanguage(lang)) {
  //     try {
  //       return `<pre class="hljs"><code>${
  //             //  hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
  //              }</code></pre>`
  //     }
  //     catch (__) {}
  //   }

  //   return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
  },
})
