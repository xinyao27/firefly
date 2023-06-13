

## [0.7.2](https://github.com/chenyueban/firefly/compare/v0.7.1...v0.7.2) (2023-06-13)

## [0.7.1](https://github.com/chenyueban/firefly/compare/v0.7.0...v0.7.1) (2023-06-13)

# [0.7.0](https://github.com/chenyueban/firefly/compare/v0.6.0...v0.7.0) (2023-05-30)


### Bug Fixes

* APP_VERSION problem ([e8a7c0e](https://github.com/chenyueban/firefly/commit/e8a7c0eed5c7eebfde6d1ee84d769cea3c24e18d))


### Features

* Add search functionality to inbox page ([4ab5a91](https://github.com/chenyueban/firefly/commit/4ab5a91313c4c0a6af4637eb3339aa2e6d62a87d))
* Add support for nested tags in Assistant and AssistantLink components ([0d3d2de](https://github.com/chenyueban/firefly/commit/0d3d2deab787c55ea8f1d9fc3be3f589a403a94a))
* support azure openai ([4138596](https://github.com/chenyueban/firefly/commit/4138596429182239ed3216225e8fcb718d755432))

# [0.6.0](https://github.com/chenyueban/firefly/compare/v0.5.2...v0.6.0) (2023-05-24)


### Bug Fixes

* Add error logging for unexpected errors in serve() function and update copilot quota increments in activate() function ([6248de0](https://github.com/chenyueban/firefly/commit/6248de076f3b5d3e563b5c6ca781c86dfd1965ac))
* Fixed memory overflow issue in executor summary content, improving the upper limit of summarization. ([b1b1a40](https://github.com/chenyueban/firefly/commit/b1b1a4046b957274c5ba5b88843da0254a5d920b))


### Features

* add page titles ([32f2864](https://github.com/chenyueban/firefly/commit/32f2864d44ec789de0fd09a46afe5e79aaacc5bc))
* Add PricingProvider to App.vue and Pricing components ([b881a6a](https://github.com/chenyueban/firefly/commit/b881a6aa542f04c15c1ea382cf6854cedc73d2cd))
* add redirection to thankyou page ([7de9ead](https://github.com/chenyueban/firefly/commit/7de9eadea1c61ddb546dbb8ea6f09366954fad98))

## [0.5.2](https://github.com/chenyueban/firefly/compare/v0.5.1...v0.5.2) (2023-05-19)


### Bug Fixes

* Fix edgeFunction call on copilot-hub page ([8066e88](https://github.com/chenyueban/firefly/commit/8066e88686cdc3d3b76844d030a99399faeb51e8))

## [0.5.1](https://github.com/chenyueban/firefly/compare/v0.5.0...v0.5.1) (2023-05-17)

# [0.5.0](https://github.com/chenyueban/firefly/compare/v0.4.0...v0.5.0) (2023-05-17)


### Bug Fixes

* Add abort functionality to copilot in RightBar.vue component ([753c1d3](https://github.com/chenyueban/firefly/commit/753c1d37f46b42e7e2d07b677c4e39a4a1a4214a))
* Add isMobileScreen hook to IndexHeader and modify button visibility based on it, and conditionally inject Vercel analytics only in production environment ([2b0623c](https://github.com/chenyueban/firefly/commit/2b0623c00198efb59357e89e933a51712cb844cf))
* Fix lodash import in CreateOrUpdateCopilotContent.vue component ([d2ba17a](https://github.com/chenyueban/firefly/commit/d2ba17aa3cb65d17557f70793edbb1b2ba54330f))
* Fix openai stream not working ([42e0323](https://github.com/chenyueban/firefly/commit/42e03237131deabc4a7a481ef0cc3d8e128760fd))
* handle_match_blocks select by copilotId ([89f16b9](https://github.com/chenyueban/firefly/commit/89f16b9c0d0ac69ed578f267f6885a2dbf05796b))
* hide left bar button on login and signup pages for mobile screens ([667a640](https://github.com/chenyueban/firefly/commit/667a6401566e57ce5de4ede77a3bf138c1cdd0d4))
* macOS mouse position is logical and Windows mouse position is physical ([2f4c460](https://github.com/chenyueban/firefly/commit/2f4c460af2e75104d05edeb539269a70fa51e196))
* Optimize the height issue of assistant editor. ([169647a](https://github.com/chenyueban/firefly/commit/169647ab0c7929f0d79e51c1ef924fa8b40c1d68))
* Refactor getMetaDataByLink to filter out null or undefined values and return a valid result, and update url-metadata to version 3.0.1 ([775daee](https://github.com/chenyueban/firefly/commit/775daee4405111c2e523ba1880906703fa6e1282))
* Refactor handle_match_blocks function to return distinct blocks based on their id and improve readability by ordering the query results by block id and embedding similarity ([bf9179a](https://github.com/chenyueban/firefly/commit/bf9179aa2fa7ef02c03c0c2cf6bf5f010815caeb))
* Refactor ListItem.vue to conditionally render NTooltip and NuxtLink based on props.data.category ([2b55fc8](https://github.com/chenyueban/firefly/commit/2b55fc87f2e82c32ec8fe1abdf0686a4cc47808f))
* Refactor RSS link validation to use fetch and handle different content types ([5d9da13](https://github.com/chenyueban/firefly/commit/5d9da1333f27edcf51921bd62b55ce7d83220006))


### Features

* Add function to retrieve metadata by link in shared API and update BlockMetadata interface in models ([af8db98](https://github.com/chenyueban/firefly/commit/af8db98ec9fcb5def5328f8a3992e2ada56ad20c))
* Add localization support for ExecutorSettings.vue component prompt text ([d5395a0](https://github.com/chenyueban/firefly/commit/d5395a0c8fda27563544cd9eab178676fbba2e66))
* Add multiple image upload functionality with a limit of 7 images and accepts only image files in Assistant.vue component ([f28b1a2](https://github.com/chenyueban/firefly/commit/f28b1a277ce8cf989bbc2ff069a3b3c928d3f8fd))
* Add new copilot type options with radio buttons for chatbot and executor in CreateOrUpdateCopilotContent.vue ([9313973](https://github.com/chenyueban/firefly/commit/9313973a16be4998d5b98a018360cf2ee902c660))
* Add Supabase vector store for OpenAI embeddings and update chat.post.ts to use it in similarity search instead of handle_match_blocks in Git commit message ([ee3d9ec](https://github.com/chenyueban/firefly/commit/ee3d9ec35cb6a3204fe9831791ffdd349918e83e))
* add tickets pages ([742a2a7](https://github.com/chenyueban/firefly/commit/742a2a7855dff01b916be85670e82e89d04e59f6))
* Add yield-stream package to package.json and update chat post endpoint to use it for streaming data ([810e640](https://github.com/chenyueban/firefly/commit/810e640f4da610de2de5f4547cfab167b438d44b))
* Complete basic Copilot Executor capability ([be297d0](https://github.com/chenyueban/firefly/commit/be297d0b3f4e196dec9ab93da49a4019f6456f64))
* Copilot update/new process added support for block selection ([f0a4485](https://github.com/chenyueban/firefly/commit/f0a448505318a3d0ffee8c4a3af2692fb520d9c8))
* Delete copilot blocks associated with the copilot when creating or updating in copilot.ts ([5fa751b](https://github.com/chenyueban/firefly/commit/5fa751be9e74284088b4134dee0082ddb202295a))
* executor 支持爬取 website ([1db6159](https://github.com/chenyueban/firefly/commit/1db61595014a21133cb539e2419d29a8524026f4))
* Finally refactored using Nuxt. ([e61e7a1](https://github.com/chenyueban/firefly/commit/e61e7a1f151fbf05c8be4dc6a8006a943eea6f85))
* finish tickets page ([fb2b197](https://github.com/chenyueban/firefly/commit/fb2b1979888b90ee80bf6d1d12b16c04fda1d197))
* Migration to supabase edge functions ([92f86ea](https://github.com/chenyueban/firefly/commit/92f86ea81efa556218b184ea2b70c9a84bbb1bfc))
* move create button to titlebar ([c3dd3a1](https://github.com/chenyueban/firefly/commit/c3dd3a1b78748af2bc5cfe40c40cc7965502de10))
* Refactor image upload method ([2edccf5](https://github.com/chenyueban/firefly/commit/2edccf53588c180366f730e99852876400581556))
* Refactor ListItem.vue to handle link metadata and display it in the component ([c5bcd87](https://github.com/chenyueban/firefly/commit/c5bcd8771d540bf2c09974c24c54069af11b832e))
* Refactor Supabase functions using Nuxt Server API. ([bb32dc3](https://github.com/chenyueban/firefly/commit/bb32dc3287b56cc5b43446a7c0bd9dbc0bcace5d))
* Refactor the executor module to make the process more clear. ([ec3fb3c](https://github.com/chenyueban/firefly/commit/ec3fb3c45eb5e4fd9712bd0b1f95fa7317ac25a9))
* Remove unused language support to reduce size ([1f047d6](https://github.com/chenyueban/firefly/commit/1f047d6b8009d28ccd973605768803c596634315))
* Support inputting website URL ([3831734](https://github.com/chenyueban/firefly/commit/38317347f3f020258eed16ed85f070d12d9123a5))

# [0.4.0](https://github.com/chenyueban/firefly/compare/v0.3.0...v0.4.0) (2023-04-19)


### Bug Fixes

* Fix Twitter handle in Footer component link to FireflyBest in present tense ([16285c5](https://github.com/chenyueban/firefly/commit/16285c5f654be35e40586d0ae6d8140c922a8639))
* Improve and update Copilot logic. ([6762fc5](https://github.com/chenyueban/firefly/commit/6762fc5d11de90e9a4aac8e1569176e1268c32f5))
* Refactor redirect page to simplify email signup confirmation and handle OAuth2 authentication in a more unified way ([dfa95c7](https://github.com/chenyueban/firefly/commit/dfa95c7216bf20df7da1a205ac0d80c272cf6754))


### Features

* Copilot support update ([e35a3ad](https://github.com/chenyueban/firefly/commit/e35a3ad35f0f7e6c4edd7a967019747d718a3864))

# [0.3.0](https://github.com/chenyueban/firefly/compare/v0.2.1...v0.3.0) (2023-04-16)


### Bug Fixes

* Disable private radio button on CreateACopilot.vue handleNext function ([8e6472f](https://github.com/chenyueban/firefly/commit/8e6472ff069e347ee595e48726b29dc59fbfa4dc))
* fix desktop assistant save button error ([43c6a7f](https://github.com/chenyueban/firefly/commit/43c6a7fb19f36f25bf5104c66db0193e6b96faf3))
* Fix homepage height issue ([d0c3893](https://github.com/chenyueban/firefly/commit/d0c389314de512073e4572a119ea96b51d121ea0))
* fix list item line clamp not work ([77f2fde](https://github.com/chenyueban/firefly/commit/77f2fdee861b9c199480943b30237340fb6c7dcf))
* fixed macOS custom schema not work ([3f9e7f2](https://github.com/chenyueban/firefly/commit/3f9e7f239accf1dddedc4d8ac60177943b2896ae))
* Refactor mouse position variables and add comments for better readability ([683483d](https://github.com/chenyueban/firefly/commit/683483dfcac40bfe9c748ad220ab956044ebf021))
* Refactor RouterView to be wrapped in AssistantProvider for better component organization and functionality ([d904603](https://github.com/chenyueban/firefly/commit/d904603265733198565125ef593b010ea467f375))
* Refactor sign in and settings functionality to improve user experience ([a3b25e0](https://github.com/chenyueban/firefly/commit/a3b25e08b65de0ed502aa0c48b6f793157c506e2))
* Refactor window creation and styling in app and assistant components ([08a24a0](https://github.com/chenyueban/firefly/commit/08a24a0b3d6d73b745b7b8b0cc8a2239ee65e0e4))


### Features

* remove vite ssg ([403aeee](https://github.com/chenyueban/firefly/commit/403aeee5380e97f751b62aa643a06681e16b1d0d))

## [0.2.1](https://github.com/chenyueban/firefly/compare/v0.2.0...v0.2.1) (2023-04-12)


### Bug Fixes

* fixed vite-ssg problem ([7f54b8c](https://github.com/chenyueban/firefly/commit/7f54b8c2018ac8d0d9e7de0eafbe843bddf70876))
* Load language asynchronously in i18n modules and components ([f390c23](https://github.com/chenyueban/firefly/commit/f390c237e58b64654b2e584898ebca0b07d1f37d))
* Refactor app UI for mobile screens using useMobileScreen hook ([8496374](https://github.com/chenyueban/firefly/commit/849637471a927f276f5b4978936160d3b568956b))
* Refactor AssistantProvider.vue to conditionally set the px prop of NModal based on whether the screen is mobile or not ([6527976](https://github.com/chenyueban/firefly/commit/6527976edbc1b30574adf29f687a81af079772cb))

# [0.2.0](https://github.com/chenyueban/firefly/compare/v0.1.0...v0.2.0) (2023-04-12)


### Bug Fixes

* Add Firefly slogan to all locales for managing information smarter today ([8dfaef3](https://github.com/chenyueban/firefly/commit/8dfaef37a8f5a378badf26d9af897068c2cf3be8))
* Add getUser function to default.vue onMounted hook, and add refresh option to getSession and getUser API calls ([16f76d3](https://github.com/chenyueban/firefly/commit/16f76d3e6aef7af8d60c3a11f16b74858c60a96d))
* Add resizable feature and default height to right drawer and apply backdrop-blur-sm and shadow-lg to drawer component in reset.sass ([d0aa32f](https://github.com/chenyueban/firefly/commit/d0aa32ff284fab09940d78dbcaa2a1032ebaa6d1))
* Copilot Hub show left bar icon in mobile ([d20c9f1](https://github.com/chenyueban/firefly/commit/d20c9f1776fe9bbfa0fe61fd5af8a9851fb9689b))
* Fix the issue where the desktop OAuth2 login pop-up does not appear on the second click. ([b817064](https://github.com/chenyueban/firefly/commit/b817064033966a05ad05005df747f073f37fec3b))
* Redirect page signup priority increased. ([c2c1f11](https://github.com/chenyueban/firefly/commit/c2c1f116168ed510eacaba9d11c1f52b112087ae))
* Refactor API requests to use edgeFunctions in all affected files ([0d6a9e5](https://github.com/chenyueban/firefly/commit/0d6a9e5b7e8b444cc3102d4f3d116c14032a56b9))
* Refactor chat function to handle error responses in copilot-hub page and copilot store ([4605dc0](https://github.com/chenyueban/firefly/commit/4605dc003b1aed3ef7f41a0247341b31cc97d847))
* Refactor ChatBox and RightBar components to improve UI and UX ([4cddbf2](https://github.com/chenyueban/firefly/commit/4cddbf25f42800b8c2017d75f115724f3088ac96))
* Refactor Copilot Hub store to include pagination for copilots list in present tense ([1a2c238](https://github.com/chenyueban/firefly/commit/1a2c2389f2fda924a0dd6aaf041a392ebdebb3e7))
* Refactor CopilotHubPage to use DynamicScroller instead of RecycleScroller and update item size. Also add console.log to output block content in chat function ([b8fdcd3](https://github.com/chenyueban/firefly/commit/b8fdcd3058061a78ad78e8473ed4bb4c07890132))
* Refactor CreateACopilot component to use empty strings in initial CopilotModel object ([8c8ce73](https://github.com/chenyueban/firefly/commit/8c8ce739d076deb0dd320dcde02308208d4927ef))
* Refactor signInWithToken function to include a name parameter and show the auth window before listening to messages ([2b5e491](https://github.com/chenyueban/firefly/commit/2b5e491032a48814b56e27565780e0c23cc686ef))
* Refactor user permissions and adjust the navigation logic between different pages. ([3471b4f](https://github.com/chenyueban/firefly/commit/3471b4f23b99c51f60ecb119000316888d8e40b9))
* Remove unnecessary initializations and fix an issue where My Copilots were not being fetched when the page loads ([de52383](https://github.com/chenyueban/firefly/commit/de52383970407cc5c5182e716b2c74a970227ad1))
* Replace router.push with router.replace in LoginOrSignup.vue to fix the issue with page navigation ([1c6ac26](https://github.com/chenyueban/firefly/commit/1c6ac26127081ac07941f69fa7d3c13a43050390))


### Features

* Add '@vitejs/plugin-vue-jsx' plugin and 'vue-virtual-scroller' library to the project. Use 'DynamicScroller' and 'DynamicScrollerItem' components from 'vue-virtual-scroller' for virtual ([4cb5203](https://github.com/chenyueban/firefly/commit/4cb520316f1266182e2e2f9375d507999f5888cd))
* Add character limit validation to name, description, and prompt inputs in CreateACopilot.vue ([6ddb6b3](https://github.com/chenyueban/firefly/commit/6ddb6b3e09366b5bbf7e2020274dbdb5f2a8934c))
* add desktop page ([996f282](https://github.com/chenyueban/firefly/commit/996f28223af47e744f7d1fc7a00667b9531aa8a7))
* add Google web fonts to Unocss configuration ([98b6884](https://github.com/chenyueban/firefly/commit/98b6884b35f9a5ba55990a399b8e6166911ad8d7))
* Add loading spinner to ChatBox component input field ([2efed43](https://github.com/chenyueban/firefly/commit/2efed437a530a29681328995c0b6d9685583a1c7))
* Add production environment setting and remove BrowserTracing integration in Sentry initialization ([a8f738e](https://github.com/chenyueban/firefly/commit/a8f738e96f0c06b40a122b135aeddd19fced2a58))
* Add Vite-SSG to build process and configure Critters plugin for better performance ([0a57d9a](https://github.com/chenyueban/firefly/commit/0a57d9a89b24d138171f80680884918609087ca6))
* Complete copilots creation functions ([d1160c0](https://github.com/chenyueban/firefly/commit/d1160c06176468e1afc141143d7442c47f2a5fb6))
* copilot hub done ([0252c3a](https://github.com/chenyueban/firefly/commit/0252c3a514f656bcf6875ae3885b6517e318d596))
* copilot hub support delete copilot ([4cf7c8d](https://github.com/chenyueban/firefly/commit/4cf7c8dba1e09dfe07e93ee811df0d4cae40c8c2))
* copilot hub support load more ([add6480](https://github.com/chenyueban/firefly/commit/add6480936b4dddad82da7c6f79c7c030cb5becb))
* Copilot support show author info ([40abf89](https://github.com/chenyueban/firefly/commit/40abf89eb7ac4b4aa379a01e6c216c7d21d56e7e))
* CopilotHub select visibility is public ([e44cb83](https://github.com/chenyueban/firefly/commit/e44cb83afde53e76932e10c656d9c08193084986))
* Each person can create up to 3 Copilots. ([14dca44](https://github.com/chenyueban/firefly/commit/14dca443a8c06d616716f594e685d99af58bd498))
* finish copilot create flow ([647711e](https://github.com/chenyueban/firefly/commit/647711e9ae5c1c437e9034833b9a10e130e7ae5c))
* Generate user token if not present and add headers to fetch requests in copilot-hub and copilot store ([07f64ab](https://github.com/chenyueban/firefly/commit/07f64ab4aacd06157edea29c47541c2ad682f049))
* Incorporate the server portion ([2ba6aea](https://github.com/chenyueban/firefly/commit/2ba6aea9d7c5b17aecb5d7131147d5f282406671))
* Prepare the necessary pre-work for block embedding. ([cd2b504](https://github.com/chenyueban/firefly/commit/cd2b50440199a2173efbc6b7427bfee310f72e65))
* Prepare the UI related to Copilot. ([d57a96e](https://github.com/chenyueban/firefly/commit/d57a96ea884425b87eda5a9d2f17023846f6ee85))
* Remaining quota limit for joining Copilot ([236a2e7](https://github.com/chenyueban/firefly/commit/236a2e75a5c849805199fbe2e77b87a6f9f1abd6))
* Throw a UserError with a compliant question prompt when content is flagged in the chat ([931186b](https://github.com/chenyueban/firefly/commit/931186bb41e5a48b2136c67abb3b328e754516b4))

# 0.1.0 (2023-04-06)


### Features

* :tada: hello firefly! ([214de12](https://github.com/chenyueban/firefly/commit/214de1229709f3dd3d09f0e96465b1ee206f13f0))