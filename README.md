# Firefly

An open-source lightweight AI-powered memo hub.

English | [简体中文](./README-zh_CN.md)

![hero](./packages/app/src/assets/images/hero.png)

## Use

- [Web App](https://firefly.best)
- [Desktop](https://github.com/chenyueban/firefly/releases)

## Feature

### Main

- 🤖 AI: Talk to AI, hand over the information you collect to AI for processing with one click, and collect the content of AI reply with one click.

- 📥 Capture: Support OCR image recognition collection, shortcut key collection, word marking icon collection, etc.

- 🔥 Copilot Hub !!: You can submit the information you have collected to AI training and generate a customized 'ChatGPT' in a vertical field. Of course, you can share the link of your created Copilot so that others can chat with it.

### More

- Markdown Support: With our powerful editor, you can easily write Markdown text, supporting almost all Markdown elements.

- tags: Manage your fragmented information through tags.

- ...... _Waiting for you to find out more features！_

### Install Manually

1. Download the installation package ending in `.msi` from the [Latest Release](https://github.com/chenyueban/firefly/releases/latest) page.
2. Double click the downloaded file to install it.
3. If prompted as unsafe, you can click on `More Info` -> `Run Anyway` to proceed with the installation.
4. Ready to use!

## MacOS

### Install Manually

1. Go to the [Latest Release](https://github.com/chenyueban/firefly/releases/latest) page and download the corresponding chip's `.dmg` installation package. Note: Use aarch64 version for Apple Silicon machines and run `xattr` command below.
2. Double click the downloaded file to install it.
3. Ready to use!

### Troubleshooting

- "Firefly" can’t be opened because the developer cannot be verified.

  <p align="center">
    <img width="300" src="https://user-images.githubusercontent.com/1206493/223916804-45ce3f34-6a4a-4baf-a0c1-4ab5c54c521f.png" />
  </p>

  - Click the `Cancel` button, then go to the `Settings` -> `Privacy and Security` page, click the `Still Open` button, and then click the `Open` button in the pop-up window. After that, there will be no more pop-up warnings when opening `Firefly`. 🎉
  
    <p align="center">
      <img width="500" src="https://user-images.githubusercontent.com/1206493/223916970-9c99f15e-cf61-4770-b92d-4a78f980bb26.png" /> <img width="200" src="https://user-images.githubusercontent.com/1206493/223917449-ed1ac19f-c43d-4b13-9888-79ba46ceb862.png" />
    </p>

  - If you cannot find the above options in `Privacy & Security`, or get error prompts such as broken files with Apple Silicon machines. Open `Terminal.app` and enter the following command (you may need to enter a password halfway through), then restart `Firefly`:

    ```sh
    sudo xattr -d com.apple.quarantine /Applications/Firefly.app
    ```

- If you encounter a permission prompt every time you open it, or if you cannot perform a shortcut translation, please go to `Settings` -> `Privacy & Security` -> `Supporting Features` to remove Firefly, and then re-add Firefly.

## Feedback

We need your suggestions and feedback to continuously improve Firefly.

If you encounter any problems while using it, you can provide feedback to us [here](https://discord.gg/qxqNEGyH3k).

## Thanks

[openai-translator](https://github.com/yetone/openai-translator) The client part of this project is inspired by it.

## License

[LICENSE](./LICENSE)
