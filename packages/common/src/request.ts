export interface UploadJSONFile {
  name: string
  filepath: string
  /**
   * 时间戳
   */
  updatedAt: number
  size: number
  mimetype: string
}

export function upload({
  files,
  jsonFiles,
  text,
  metadata,
  from,
}: {
  files?: File[]
  jsonFiles?: UploadJSONFile[]
  text?: string
  metadata?: any
  from: string
}) {
  const formData = new FormData()
  if (files && Array.isArray(files)) {
    for (let i = 0; i < files.length; i++)
      formData.append(`file${i}`, files[i])
  }
  else if (typeof text === 'string') {
    formData.append('text', text)
  }

  if (jsonFiles)
    formData.append('jsonFiles', JSON.stringify(jsonFiles))

  if (metadata)
    formData.append('metadata', JSON.stringify(metadata))

  if (from)
    formData.append('from', from)

  return fetch('http://localhost:5487/upload', {
    method: 'POST',
    body: formData,
  })
    .then((res) => {
      if (res.status >= 400)
        throw new Error(res.statusText)

      return res
    })
}
