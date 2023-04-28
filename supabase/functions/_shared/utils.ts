export function clearHTMLTags(text: string) {
  return text
  .replace(/<.*?>/g, '')
  .replace(/\s/g, '')
}
