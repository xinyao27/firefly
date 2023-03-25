export function clearContent(content: string) {
  return content.replace(/<span[^>]*data-type="tag"[^>]*>([^<]*)<\/span>/g, '$1')
}

export function clearHTMLTags(text: string) {
  return text.replace(/<.*?>/g, '')
}
