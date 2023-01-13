export function upload(data: File[] | null, text: string | null, metadata: any | null, from: string) {
  const formData = new FormData()
  if (data && Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      formData.append(`file${i}`, data[i])
    }
  }
  else if (typeof text === 'string') {
    formData.append('text', text)
  }

  if (metadata) {
    formData.append('metadata', JSON.stringify(metadata))
  }
  if (from) {
    formData.append('from', from)
  }
  return fetch('http://localhost:5487/upload', {
    method: 'POST',
    body: formData,
  })
    .then((res) => {
      if (res.status >= 400) {
        throw new Error(res.statusText)
      }
      return res
    })
}
