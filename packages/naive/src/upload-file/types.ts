/**
 * 状态
 * done - 完成
 * uploading - 上传中
 * error - 错误
 * waiting - 等待中
 * resolving - 处理中
 * md5 - 计算md5中
 */
export type UploadFileStatus = 'done' | 'uploading' | 'error' | 'waiting' | 'resolving' | 'md5'

/**
 * 上传的文件信息
 */
export interface UploadFileInfo {

  /**
   * 图片地址
   */
  url: string
  /**
   * 文件信息
   */
  file?: File
  /**
   * 状态
   */
  status: UploadFileStatus
  /**
   * 大小信息
   */
  size?: UploadFileSizeInfo

}

/**
 * 上传文件的大小信息
 */
export interface UploadFileSizeInfo {
  /**
   * 总大小
   */
  total: number
  /**
   * 已上传的大小
   */
  uploaded: number
}
