import type { MessageId } from '~~/models/Message'

export function useCardClick(id: MessageId) {
  const messageStore = useMessageStore()
  const router = useRouter()

  const handleClick = () => {
    messageStore.selectMessageIds([id])
  }

  const handleDoubleClick = () => {
    router.push(`/preview/${id}`)
  }

  return {
    handleClick,
    handleDoubleClick,
  }
}
