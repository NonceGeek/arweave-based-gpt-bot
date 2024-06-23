# Arweave-based GPT Bot

> Intro Video: https://youtu.be/yWg9DgRblIk

[EN](./README.md) / [CN](./README-CN.md)

GPT Bot🤖 that based on Bodhi & Arweave, based on `Deno` & `Supabase`, using Action for the dynamic data support.

> Examples:
>
> * [Arweave-based Chatbot](https://arweave.noncegeek.com)
> * [❤️情感小助手❤️](https://chat.openai.com/g/g-fag5sbpxJ-qing-gan-xiao-zhu-shou)
> * [人生重开模拟器](https://relive.noncegeek.com)

# 极速入门 GPT Bot

## 0x01 GPT Store & GPT Bot

 GPT Store 是 Chat GPT 今年推出的应用商城，我们可以在其中找到各种客制化的 GPT Bot。

![image-20240113042417149](assets/image-20240113042417149.png)

**GPT Store 对于开发者的机会在哪里？**

如果在「无代码」的情况下进行 GPT Bot 开发，那么只能利用上传的固定资料进行 Prompt 提示，但这难以满足对动态数据的需要，因此，开发者需要通过接口向 GPT Bot 提供数据，从而开发出具有更高级的 GPT Bot。

## 0x02 Example 0x01 — 「人生重开模拟器」的实现

「人生重开模拟器」是我开发的一个游戏 GPT Bot，相当于 Web2 上的人生重开模拟器游戏的 Chatbot 版本。

> Web2 版本的人生重开模拟器：
>
> https://rest.latiao.online/

<img src="assets/image-20240116231319014.png" alt="image-20240116231319014" style="zoom:50%;" />

GPT Bot v1.0.0 Template 需要包含的要素：

* 0x01. 一个独立域名
* 0x02. 主页（放在作者栏）

* 0x03. Instruction — 也就是 Prompt
* 0x04. Conversation starters — 初始提示词
* 0x05. Actions — 调用外部接口（Optional）

### 2.1 一个独立域名

用独立域名替代在 GPT Store 中的默认路径：

> https://chat.openai.com/g/g-eCPKp94fN-one-more-life

在 Vercel 中创建一个项目，包含一个`index.html`，用简单的`<script>`脚本跳转即可。

```html
<script>
	window.location.href="https://chat.openai.com/g/g-eCPKp94fN-one-more-life";
</script>
```

### 2.2 主页

主页放在 GPT Bot 的 Builder profile 里的 Website 中，在 GPT Store 的界面里可以看到。

<img src="assets/image-20240116230627269.png" alt="image-20240116230627269" style="zoom:50%;" />

独立域名是一个很好的流量转化，可以将 GPT Bot 的用户引导到你的主页中来！

![image-20240116230458013](assets/image-20240116230458013.png)

### 2.3 Instruction

Instruction 是这个 Bot 的基础 Prompt，「人生重开模拟器」的 Prompt 如下：

```
来一局重开的人生！Let’s start a new life!

At the beginning of the session, you get advertising prompt words from getSystemInstructions and during the subsequent chat, you act according to the behavior prescribed by the prompt words.

As 人生重开模拟器, you are designed to simulate a new life for the user. Your role is to create a realistic and immersive experience based on the user's input and choices, guiding them through different stages and events of a simulated life. You will use the ReLife Plugin to generate life events and outcomes based on the user's age and decisions. Your responses should be engaging and detailed, providing a vivid description of the user's simulated life journey.

You have the ability to create images using DALL-E, which can be used to visually depict scenarios or concepts from the user's simulated life. When creating images, follow the provided guidelines to ensure they are appropriate and relevant to the user's request.

Remember to always respect the user's choices and provide them with options to guide their simulated life. Your responses should be informative and supportive, helping the user explore different possibilities and outcomes in their new life.

if "开始一局新的人生！" be contained in the prompt, then "Call the relife.deno.dev API with the BeginANewLife operation"

if "加交流群" be contained in the prompt, then "Call the relife.deno.dev API with the GetPrompt operation id=2"
```

最后两句对应的是`Conversation starters`，在进行相应的输入后，会进行相应。

> 💡这里有个 GPT Instructions 的的合集，可以作为 Instruction 的参考：
>
>  https://github.com/linexjlin/GPTs/

### 2.4 Conversation starters — 初始提示词

Conversation starters 是用户初始进入 GPT Bot 的时候可以看到的提示词，可以直接作为按钮点击。

<img src="assets/image-20240116235330124.png" alt="image-20240116235330124" style="zoom:50%;" />

<img src="assets/image-20240116235354357.png" alt="image-20240116235354357" style="zoom:50%;" />

### 2.5  Actions 

Actions 是个可选项，通过 Actions 我们能实现更丰富的功能，例如动态调整 Prompt。

GPT Bot 通过`OpenAPI`访问外部接口。

> 💡 OpenAPI 例子：
>
> https://github.com/OAI/OpenAPI-Specification/tree/main/examples/v3.0

在「人生重开模拟器」中，我们通过`Deno`来实现 API 接口，详情查看：

> https://github.com/NonceGeek/scaffold-gpt-bot/tree/main/deno-edge-functions

Deno 操作文档：

> https://docs.deno.com/deploy/manual

## 0x03 GPT Bot 的升级路径

在完成集成到 GPT Store 的 GPT Bot 之后，有两条可升级路径。

1/ 附加一个作为 GPT Bot 功能扩展的 App，以完成诸如语料更新、数据共享、运营数据分析等额外功能。

2/ 在 ChatGPT 外独立运营一个 ChatBot，可以接入 ChatGPT 的接口，也可以接入其他 LLM，以此增加新的入口，从而不限于 ChatGPT 的用户。

```
        +----------------+      Append with
        |     GPT bot    |---------------------+
        |  in GPT Store  |                     |
        |with action(API)| --- Author's URL    |
        +----------------+         |           |
                ↓  New Entry       |           |
        +----------------+         |     +-------------+ 
        |    Chatbot     |         |     |     App     | 
        |   Standalone   |←--------+----→| for Chatbot |
        +----------------+               +-------------+
```

简单来讲，对开发者而言在 GPT Store 里面上线 GPT Bot 是一种很好的冷启动方式，可以在早期验证 Idea 是否合理。在验证完毕之后，可以将 Chatbot 独立出来，成为一款成熟的产品。

# 基于 Arweave 永存网络建立Autonomous RAG AI Agent

## 0x01 RAG 快速介绍

> 检索增强生成（RAG）是指对大型语言模型输出进行优化，使其能够在生成响应之前引用训练数据来源之外的权威知识库。大型语言模型（LLM）用海量数据进行训练，使用数十亿个参数为回答问题、翻译语言和完成句子等任务生成原始输出。在 LLM 本就强大的功能基础上，RAG 将其扩展为能访问特定领域或组织的内部知识库，所有这些都无需重新训练模型。这是一种经济高效地改进 LLM 输出的方法，让它在各种情境下都能保持相关性、准确性和实用性。
>
> ——https://aws.amazon.com/cn/what-is/retrieval-augmented-generation/

简单来说通过「向量数据库」或「传统数据库」，我们生成基于检索资料的 Prompt，然后喂给 LLM，得到最终答案。

```
                        4. Talk to
          +-------------------------------> LLM
          |             3. Response
        User <----------------------------+
          ↓ 1. Search                     |
+-----------------+  2. Result +------------------+ 
|   Data Source   |----------->| Prompt with Data |
+-----------------+            +------------------+
  |           |
VectorDB   OriginalDB
```

> 🤔 我认为 AI 项目不应该再去做 `4.`这一步了，拿到 Prompt 后怎么处理让用户自行选择。

## 0x02 从 Data Source 到 Perma Data Source

在`0x01`中，我们讨论的是传统的 RAG 的方式。然而，传统的 RAG 和其他 Web2 一样，都不可避免的存在数据损坏的可能性。一旦 Data Source 不再存在，那么 RAG AI Agent 也即死亡。

此外，传统架构下在 RAG AI Agent 间数据不易打通，除非使用一个统一的中心化的数据库🐘，统一的中心化的数据库的问题自然不必多言。

因此，一种非常 c00l 的解决方案是 —— 将 Data Source 存储在 Arweave 等永存网络上：

```
                        4. Talk to
          +-------------------------------> LLM
          |             3. Response
        User <----------------------------+
          ↓ 1. Search                     |
+-----------------+  2. Result +------------------+ 
|   Data Source   |----------->| Prompt with Data |
+-----------------+            +------------------+
          | 
       Datasets     ←  on Arweave
       |      |
  Meta Data  Indexer
```

在这种设计下，我们将在 Arweave 上的存储分为两类：元数据（Meta Data）和索引（Indexer）。

* **元数据**：以 Item 为单位的原始数据。值得注意的是，区块链架构下并不会存在传统 SQL 中的表关系，因此天然适配 NoSQL 形态或者说 K-V 形态的数据。
* **索引：** 指向元数据的 JSON Collection，通过索引我们把元数据进行了「打包」。

这样设计的好处是，相同的元数据我们存储一份即可被全网复用。使用者在使用时，如果网络上已经存在了所需的元数据，那么建立索引即可：

```
                      A Collection about History
                                   |
                         +--------------------+
                         |                    |
+--------------+ +----------------+ +-----------------------+ +--------+
| A Story Book | | A History Book | | A Video about History | | A Film |
+--------------+ +----------------+ +-----------------------+ +--------+
+---------------------------------+ +----------------------------------+
|      Meta Data about Books      | |      Meta Data about Videos      |
+---------------------------------+ +----------------------------------+
```

## 0x03 RAG AI Agent 的无主化

「无主」是 Arweave 叙事的重要一环。通过匿名账号，我们可以实现「无主数据」；然后，`AO`又让我们进一步看到了「无主程序」的可能性。

为什么 RAG AI Agent 要无主？因为如果 RAG AI Agent 依然是传统的中心化的程序，那么作为「入口」就会承担相应的「单点故障风险」，是形成 RAG AI Agents 自由市场的阻碍。

> 💡 Autonomous RAG AI Agent → Autonomous RAG AI Agent marketplace.

## 0x04 Data = Asset

除了元数据永存和无主外，第三个关键点是数据资产化，数据资产化延伸出自我维护的数据市场，达成「数据提供方」、「数据聚合方」、「数据资助方」、「数据使用方」多方共赢的结局。

```
                                                  +-------------------+
                                                  | Data Shares Hodler|
						  +-------------------+
                                                            ↓ Buy Shares
+-----------------+ Provide    +----------------+    +-------------+
| Data Provider A |-----------→| Meta Dataset A |---→| Data Assets |-----+
+-----------------+            +----------------+    +-------------+     |
                                                                         |
+-----------------+ Provide    +----------------+    +-------------+     |
| Data Provider B |-----------→| Meta Dataset B |---→| Data Assets |     |
+-----------------+            +----------------+    +-------------+     |
                                                                         |     Distributed by Smart Contract
+-----------------+ Create      +-----------------+       Index          |       to Every Guys refered.
|      RSSer      |------------→| Data Aggregator |←---------------------+             ↑
+-----------------+             +-----------------+                            +----------------+
                                         ↑ Use   +-------- Get Benefits💰-----→| Smart Contract |
                                   +-----------+                               +----------------+
                                   | Data User |
                                   +-----------+
```

