
export class Plugin {
  manifest: PluginManifest

  constructor(manifest: PluginManifest) {
    this.manifest = manifest
  }

  /**
   * 卡片详情页显示内容
   */
  registerView() {}
  /**
   * 自定义块显示内容
   */
  registerEditorExtension() {}

  /**
   * 新增一条 command
   */
  addCommand() {}
  /**
   * 新增一个设置页面
   */
  addSettingTab() {}
  /**
   * 左侧导航栏新增一项
   */
  addRibbonIcon() {}
  /**
   * 新增一个状态栏项
   */
  addStatusBarItem() {}
}

export interface PluginManifest {
  /**
   * 插件安装目录
   */
  dir?: string
  /**
   * ID
   */
  id: string
  /**
   * 插件名
   */
  name: string
  /**
   * 插件简介
   */
  description: string
  /**
   * 作者
   */
  author: string
  /**
   * 作者联系方式
   */
  authorUrl?: string
  /**
   * 版本号
   */
  version: string
  /**
   * 最低兼容 Firefly 版本
   */
  minAppVersion: string
}
