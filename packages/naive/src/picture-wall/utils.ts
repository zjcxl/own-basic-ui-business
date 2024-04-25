import type { PictureOptimizeType } from './types'

/**
 * 处理缩略图地址
 * @param url
 * @param optimize
 * @param width
 * @param height
 */
export function handleThumbnailUrl(
  url: string,
  optimize: PictureOptimizeType,
  width: number,
  height: number,
) {
  if (optimize === 'none' || !url)
    return url
  if (url.includes('?'))
    return `${url}&x-oss-process=image/resize,w_${width},h_${height}`
  else
    return `${url}?x-oss-process=image/resize,w_${width},h_${height}`
}
