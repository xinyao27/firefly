const upstream = 'api.firefly.best'

addEventListener('fetch', (event) => {
  event.respondWith(fetchAndApply(event.request))
})

async function fetchAndApply(request) {
  let response = null
  const method = request.method

  const url = new URL(request.url)
  const url_hostname = url.hostname
  url.protocol = 'https:'
  url.host = upstream

  const request_headers = request.headers
  const new_request_headers = new Headers(request_headers)
  new_request_headers.set('Host', url.host)
  new_request_headers.set('Referer', `${url.protocol}//${url_hostname}`)

  const original_response = await fetch(url.href, {
    method,
    headers: new_request_headers,
    body: request.body,
  })

  const original_response_clone = original_response.clone()
  let original_text = null
  const response_headers = original_response.headers
  const new_response_headers = new Headers(response_headers)
  const status = original_response.status

  new_response_headers.set('Cache-Control', 'no-store')
  new_response_headers.set('access-control-allow-origin', '*')
  new_response_headers.set('access-control-allow-credentials', true)
  new_response_headers.delete('content-security-policy')
  new_response_headers.delete('content-security-policy-report-only')
  new_response_headers.delete('clear-site-data')

  original_text = original_response_clone.body
  response = new Response(original_text, {
    status,
    headers: new_response_headers,
  })

  return response
}
