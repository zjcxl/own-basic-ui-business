import type { UploadFileInfo, UploadFileStatus } from './types'

/**
 * 创建项目
 * @param file
 * @param status
 */
export function createUploadFileInfoItem(file: File, status: UploadFileStatus = 'waiting'): UploadFileInfo {
  return {
    url: '',
    file,
    status,
    size: {
      total: file.size,
      uploaded: 0,
    },
  }
}
