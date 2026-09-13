import { useState, type ImgHTMLAttributes } from 'react'
import './EditorialImage.css'

/** Keep the existing image dimensions when a remote source fails, using our bundled artwork. */
export function EditorialImage({ src, alt = '', ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const [failedSrc, setFailedSrc] = useState<string>()
  const fallback = !src || failedSrc === src
  return <img {...props} src={fallback ? '/icon-master.svg' : src} alt={alt}
    decoding="async" data-image-fallback={fallback || undefined}
    onError={() => { if (!fallback) setFailedSrc(src) }} />
}
