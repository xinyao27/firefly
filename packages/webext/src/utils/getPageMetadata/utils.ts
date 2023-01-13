function resolve(from: string, to: string) {
  const resolvedUrl = new URL(to, new URL(from, 'resolve://'))
  if (resolvedUrl.protocol === 'resolve:') {
    // `from` is a relative URL.
    const { pathname, search, hash } = resolvedUrl
    return pathname + search + hash
  }
  return resolvedUrl.toString()
}

export function makeUrlAbsolute(base: string, relative: string): string {
  try {
    const relativeParsed = new URL(relative)

    if (relativeParsed.host === null) {
      return resolve(base, relative)
    }

    return relative
  }
  catch (_) {
    if (relative.startsWith('/')) {
      return resolve(base, relative)
    }
    return relative
  }
}

export function makeUrlSecure(url: string): string {
  return url.replace(/^http:/, 'https:')
}

export function parseUrl(url: string): string {
  return new URL(url).hostname || ''
}

export function getProvider(host: string): string {
  return host
    .replace(/www[a-zA-Z0-9]*\./, '')
    .replace('.co.', '.')
    .split('.')
    .slice(0, -1)
    .join(' ')
}
