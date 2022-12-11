<template>
  <main class="h-screen pt-10 text-gray-700 dark:text-gray-200 flex flex-col">
    <div
      id="root-view"
      flex-auto px-4 overflow-auto
    >
      <RouterView />
    </div>
    <Footer />
  </main>
</template>
