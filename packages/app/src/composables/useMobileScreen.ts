export function useMobileScreen() {
  const isMobileScreen = useMediaQuery('(max-width: 640px)')
  return isMobileScreen
}
