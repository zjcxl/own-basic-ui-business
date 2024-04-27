import type { PictureOptimizeType, UploadPictureWallShowModel } from './types'

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

/**
 * 创建项目
 * @param file
 */
export function createUploadPictureWallItem(file: File): UploadPictureWallShowModel {
  return {
    url: '',
    dataUrl: window.URL.createObjectURL(file),
    file,
    status: 'waiting',
    size: {
      total: file.size,
      uploaded: 0,
    },
  }
}
