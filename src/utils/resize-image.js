function resizeImage(file, maxWidth, maxHeight) {
    return new Promise((resolve, reject) => {
        const img = document.createElement('img')
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        const reader = new FileReader()
        reader.onload = (e) => {
            img.src = e.target.result
            img.onload = () => {
                canvas.width = maxWidth
                canvas.height = maxHeight
                ctx.drawImage(img, 0, 0, maxWidth, maxHeight)
                canvas.toBlob((blob) => {
                    resolve(blob)
                }, file.type)
            }
        }
        reader.onerror = (e) => {
            reject(e)
        }
        reader.readAsDataURL(file)
    })
}