/**
 * 状态
 * done - 完成
 * uploading - 上传中
 * error - 错误
 * waiting - 等待中
 * resolving - 处理中
 * coppering - 裁剪中
 * waiting-copper 等待裁剪中
 */
export type PictureWallStatus = 'done' | 'uploading' | 'error' | 'waiting' | 'resolving' | 'coppering' | 'waiting-copper'

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
   */
  status: PictureWallStatus
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

/**
 * 裁剪框配置信息
 */
export interface CopperOptions {
  /**
   * 裁剪生成图片的质量 0.1 ~ 1
   * @default 1
   */
  outputSize: number
  /**
   * 裁剪生成图片的格式
   * @default 'jpeg'
   */
  outputType: 'jpeg' | 'png' | 'webp'
  /**
   * 裁剪框的大小信息
   * @default true
   */
  info: boolean
  /**
   * 图片是否允许滚轮缩放
   * @default true
   */
  canScale: boolean
  /**
   * 是否默认生成截图框
   * @default false
   */
  autoCrop: boolean
  /**
   * 默认生成截图框宽度
   * @default 容器的 80%
   */
  autoCropWidth: number
  /**
   * 默认生成截图框高度
   * @default 容器的 80%
   */
  autoCropHeight: number
  /**
   * 是否开启截图框宽高固定比例
   * @default false
   */
  fixed: boolean
  /**
   * 截图框的宽高比例
   * @default [1, 1]
   */
  fixedNumber: [number, number]
  /**
   * 是否输出原图比例的截图
   * @default false
   */
  full: boolean
  /**
   * 固定截图框大小
   * @default false
   */
  fixedBox: boolean
  /**
   * 上传图片是否可以移动
   * @default true
   */
  canMove: boolean
  /**
   * 截图框能否拖动
   * @default true
   */
  canMoveBox: boolean
  /**
   * 上传图片按照原始比例渲染
   * @default false
   */
  original: boolean
  /**
   * 截图框是否被限制在图片里面
   * @default false
   */
  centerBox: boolean
  /**
   * 是否按照设备的dpr 输出等比例图片
   * @default true
   */
  high: boolean
  /**
   * true 为展示真实输出图片宽高 `false` 展示看到的截图框宽高
   * @default false
   */
  infoTrue: boolean
  /**
   * 限制图片最大宽度和高度
   * @default 2000
   */
  maxImgSize: number
  /**
   * 图片根据截图框输出比例倍数
   * @default 1
   */
  enlarge: number
  /**
   * 图片默认渲染方式
   * @default 'contain'
   */
  mode: 'contain' | 'cover' | '100px' | '100%' | 'auto'
  /**
   * 裁剪框限制最小区域
   * @default 10
   */
  limitMinSize: number
  /**
   * 导出时背景颜色填充
   * @default ''
   */
  fillColor: string
}
