import { clipboard } from 'electron'
import { copy } from '@chenyueban/robot'

export async function getSelectedText() {
  const currentClipboardContent = clipboard.readText() // preserve clipboard content
  clipboard.clear()
  copy()
  await new Promise(resolve => setTimeout(resolve, 200)) // add a delay before checking clipboard
  const selectedText = clipboard.readText()
  clipboard.writeText(currentClipboardContent)
  return selectedText
}
