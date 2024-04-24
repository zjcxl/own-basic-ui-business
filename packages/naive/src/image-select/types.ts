export interface ImageSelectShowModel {

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
   */
  status: 'done' | 'uploading' | 'error'
  /**
   * 大小信息
   */
  size?: ImageSelectShowSizeModel

}

export interface ImageSelectShowSizeModel {
  /**
   * 总大小
   */
  total: number
  /**
   * 已上传的大小
   */
  uploaded: number
}
