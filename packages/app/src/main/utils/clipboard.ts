import clipboardEx from 'electron-clipboard-ex'
import { clipboard } from 'electron'

/**
 * https://github.com/rubickCenter/rubick/blob/master/src/common/utils/getCopyFiles.ts
 */
export interface ClipboardWrite {
  filePaths?: string[]
  texts?: string[]
  imagePath?: string
}
export async function clipboardWrite({ filePaths, texts, imagePath }: ClipboardWrite) {
  if (filePaths) {
    return clipboardEx.writeFilePaths(filePaths)
  }
  if (texts) {
    return clipboard.writeText(texts.join('\n'))
  }
  if (imagePath) {
    return clipboardEx.putImage(imagePath)
  }
}
