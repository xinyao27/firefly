import type { ID } from '~~/models/Message'

export function useCardClick(id: ID) {
  const messagesStore = useMessagesStore()

  const handleClick = () => {
    messagesStore.selectMessageIds([id])
  }

  const handleDoubleClick = () => {
    // TODO
    console.warn('double click')
  }

  return {
    handleClick,
    handleDoubleClick,
  }
}
