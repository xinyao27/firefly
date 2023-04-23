import { RouterLink } from 'vue-router'
import type { MenuOption } from 'naive-ui'

const menuOptions: MenuOption[] = [
  {
    label: () => <RouterLink to="/inbox">Inbox</RouterLink>,
    key: '/inbox',
    icon: () => <i class="i-ri-inbox-fill" />,
  },
  {
    label: () => <RouterLink to="/copilot-hub">Copilot Hub</RouterLink>,
    key: '/copilot-hub',
    icon: () => <i class="i-ri-copilot-fill" />,
  },
]

export default menuOptions
