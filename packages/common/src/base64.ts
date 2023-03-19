export function isBase64(str: string) {
  if (str.includes('data:') && str.includes('base64'))
    return true

  else
    return false
}
