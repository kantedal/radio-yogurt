const saveVideoFile = (blob: Blob) => {
  const a = document.createElement('a')
  document.body.appendChild(a)
  const url = window.URL.createObjectURL(blob)
  a.href = url
  a.download = 'video.mp4'
  a.click()
  window.URL.revokeObjectURL(url)
}

export default saveVideoFile
