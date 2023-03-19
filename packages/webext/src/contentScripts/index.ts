import { onMessage } from 'webext-bridge'
// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
(() => {
  // communication example: send previous tab title from background page
  onMessage('tab-prev', ({ data }) => {
    console.warn(`[Firefly] Navigate from page "${data.title}"`)
  })

  // mount component to context window
  const container = document.createElement('iframe')
  container.src = browser.runtime.getURL('dist/contentScripts/index.html')
  container.style.position = 'fixed'
  container.style.top = '20px'
  container.style.left = '20px'
  container.style.minWidth = '330px'
  container.style.minHeight = '180px'
  container.style.zIndex = '2147483647'
  container.style.border = 'none'
  container.style.borderRadius = '8px'
  container.style.pointerEvents = 'initial'
  container.setAttribute('allowtransparency', 'true')
  document.body.appendChild(container)
})()
