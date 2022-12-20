import { arch, platform } from '@tauri-apps/api/os'

export const is = {
  // Checks if we are under Mac OS
  async macOS() {
    return await platform() === 'darwin'
  },
  // Checks if we are under Windows OS
  async windows() {
    return await platform() === 'win32'
  },
  // Checks if we are under Linux OS
  async linux() {
    return await platform() === 'linux'
  },
  // Checks if we are the processor's arch is x86
  async x86() {
    return await arch() === 'x86'
  },
  // Checks if we are the processor's arch is x64
  async x64() {
    return await arch() === 'x86_64'
  },
  // Checks if the env is setted to 'production'
  async production() {
    return false
  },
  // Checks if the env is setted to 'dev'
  async development() {
    return true
  },
}
