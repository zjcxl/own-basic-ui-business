export interface UploadPictureWallShowModel {

  /**
   * 图片地址
   */
  url: string
  /**
   * base64图片地址
   */
  dataUrl?: string
  /**
   * 文件信息
   */
  file?: File
  /**
   * 状态
   * done - 完成
   * uploading - 上传中
   * error - 错误
   * waiting - 等待中
   */
  status: 'done' | 'uploading' | 'error' | 'waiting' | 'resolving'
  /**
   * 大小信息
   */
  size?: UploadPictureWallSizeModel

}

export interface UploadPictureWallSizeModel {
  /**
   * 总大小
   */
  total: number
  /**
   * 已上传的大小
   */
  uploaded: number
}

export interface PictureWallShowModel {

  /**
   * 原图地址
   */
  origin: string

  /**
   * 缩略图地址
   */
  thumbnail: string
}

/**
 * 图片优化类型
 */
export type PictureOptimizeType = 'none' | 'oss'
