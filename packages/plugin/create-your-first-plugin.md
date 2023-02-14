# 创建你的第一个 Firefly 插件

通过这这篇文档你将构建出一个 Firefly 插件。

## Step 1 — 下载样例插件

首先，你会下载一个工作示例插件。

1. 打开 [Firefly Sample Plugin](https://github.com/firefly/firefly-sample-plugin) // TODO
1. 点击 **Use this template**
1. 在 **Repository name** 这里输入插件名称。 Firefly 插件都以 `firefly-` 为前缀。例如 `firefly-instant-coffee`
1. 点击 **Create repository from template**

现在，您已经根据样品插件创建了自己的 Git 仓库。接下来，您将在本地计算机上下载源代码。

1. 打开刚刚创建的 Git 仓库
2. 点击 **Code**，复制地址
3. 打开命令行输入命令

   ```bash
   cd path/to/vault/.firefly/plugins
   ```

4. 下载源码至 **plugins** 目录

   ```bash
   git clone https://github.com/your-username/firefly-instant-coffee.git
   ```

## Step 2 — 打包插件

在本节中，您将构建插件的源代码。

1. 跳转至插件目录

   ```bash
   cd path/to/vault/.firefly/plugins/firefly-instant-coffee
   ```

1. 安装依赖

   ```bash npm2yarn
   npm install
   ```

1. 编译源代码。以下命令生成一个 `main.js`，其中包含插件的编译版本。

   ```bash npm2yarn
   npm run dev
   ```

## Step 3 — 启用插件

使用插件前首先要启用它。

1. 在 Firefly 中打开**设置**
1. 侧边栏点击 **社区插件**.
1. 在**已安装插件**中，启用 "Sample Plugin"

现在自定义插件已经成功运行！

不过，"Sample Plugin" 可能不是您插件的名称。让我们改掉它。

## Step 4 — 更新 plugin manifest

在这个步骤中，您将更新 `manifest.json` 以重命名插件。`manifest.json` 是一个包含有关您的插件的信息的文件，比如它的名称和版本。

1. 编辑器打开 `firefly-instant-coffee` 目录 推荐使用 [Visual Studio Code](https://code.visualstudio.com/).
1. 打开 `manifest.json`
1. 修改 `id` 为你插件的ID，例如 `firefly-instant-coffee`
1. 给你的插件起一个通俗易懂的名字，修改到 `name`，例如 `Instant coffee`
1. 当然你也可以修改 `description`， `author`， `authorUrl`

插件也是一个 `node.js` 包，您可以在 `package.json` 中进行配置。现在，更新它以匹配 `manifest.json` 中的属性。

1. 编辑器打开 `package.json`
1. 修改 `name` 匹配 `manifest.json` 中的 `id`
1. 修改 `version` 匹配 `manifest.json` 中的 `version`
1. 修改 `description` 匹配 `manifest.json` 中的 `description`
1. 重启 Firefly 重新加载插件

## Step 5 — 更新源码

在这个步骤中，您将更改源代码并重新加载插件。

1. 编辑器打开 `main.ts`
2. 找到含有 _ribbon icon_ 的行

   ```ts
   this.addRibbonIcon('dice', 'Sample Plugin', () => {
     Notice('This is a notice!')
   })
   ```

3. 修改 `Notice` 中的字符串

   ```ts
   Notice('Hello, you!')
   ```

4. 重启 Firefly 重新加载插件
5. 查看你的更改是否已经正常加载
