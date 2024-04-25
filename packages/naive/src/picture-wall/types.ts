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
  status: 'done' | 'uploading' | 'error' | 'waiting'
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
   * 图片地址
   */
  url: string

}
