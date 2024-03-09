# Raycast Unblock

[![Version][package-version-src]][package-version-href]
[![License][license-src]][license-href]

> **Raycast Unblock is currently in heavy development**, with frequent code updates, and you need to keep up with the latest developments in this project.

Unblock all features in Raycast Pro Plan.

> [!WARNING]
> This project is for educational purposes only.
> Please do not use it for commercial purposes.

## Quick Start

```bash
docker run -d --name raycast-unblock -p 3000:3000 wibuswee/raycast-unblock:latest
```

More details can be found in [Usage](#usage).

> [!WARNING]
> There are very many **breaking updates** in v0.1.0.beta.x -> v0.2.0.beta.0, go to [Release](https://github.com/wibus-wee/raycast-unblock/releases/tag/v0.2.0-beta.0) for details!

## Disclaimer

We only borrowed the **operation interface** of Raycast, and **did not modify the backend server** of Raycast.

We just coded a proxy server to forward Raycast's requests to our proxy server, and **implemented similar functions** in Raycast Pro Plan **in other ways**.

You can see all the code in the `src` directory. If you have any questions, please feel free to ask.

See [Unblock Features](#unblock-features) and [Unblock Routes](#unblock-routes) for more details.

## Unblock Features

- [x] Pro Plan Logo
- [x] AI Chat
  - [x] OpenAI (support Azure)
  - [x] Gemini
  - [x] [GitHub Copilot](#github-copilot)
  - [ ] More?
- [x] Translations
  - [x] [Shortcut](#shortcut-translator) (Only for macOS)
  - [x] [AI](#ai-translator)
  - [x] DeepLX
  - [x] LibreTranslate - [Official Website](https://libretranslate.com)
  - [ ] More?
- [x] Cloud Sync
  - [x] iCloud Drive (Only for macOS)
  - [x] Local Storage
- [x] Others
  - [x] Theme Studio

<sup>If you have any feature requests, please feel free to ask.</sup>

## Requirements

- ~~Node.js 18.x~~
- Raycast
- macOS / Linux (Windows is not maintained)
- Surge (or other proxy tools) **(optional)**

## Quick Links

- [I don't want to install Node.js, how can I use it? - Q&A](#i-dont-want-to-install-nodejs-how-can-i-use-it)
- [I don't buy Surge, how can I use it? - Q&A](#i-dont-buy-surge-how-can-i-use-it)

## Usage

### Docker (Recommended)

You can use Docker to run Raycast Unblock.

#### Run

```bash
docker run -d \
  --name raycast-unblock \
  -p 3000:3000 \
  --config /path/to/your/config.toml:/app/config.toml \
  wibuswee/raycast-unblock:latest
```

You should replace `/path/to/your/config.toml` with your `config.toml` file path.

### Docker Compose

You can use Docker Compose to run Raycast Unblock.

Download the [docker-compose.yml](./docker-compose.yml) file and modify the environment variables in it. Then run the following command:

```bash
docker-compose up -d
```

If you need to use config.toml file, please uncomment some lines in the `docker-compose.yml` file (They are commented out by default).

### Download dist from actions

You can download the latest dist from [GitHub Actions](https://github.com/wibus-wee/raycast-unblock/actions/workflows/ci.yml).

The naming format is `raycast-unblock-<platform>-<type>`.

- `js` type is a small package with all dependencies bundled, but requires JS Runtime.
- `app` type is a single application, which is larger but does **not require** JS Runtime.

### Set environment variables

Copy / Download the `config.example.toml` file and rename it to `config.toml`, then fill in the environment variables.

After that, you should put the `config.toml file in the same directory as the executable file.

### Run

```bash
# Your config.toml file should be in this directory, or you should set the `--config` parameter
node index.js # or ./raycast-unblock-app
# or
node index.js --config /path/to/your/config.toml

# ℹ Raycast Unblock
# ℹ Version: 0.0.0
```

If you want to run it in the background, you can use `pm2` or `nohup`.

### Use it with Surge

> [!WARNING]
> In some cases, if you find that Raycast Unblock is not working properly, please go to the settings of Surge, and uncheck the last line `*` in `Surge -> HTTP -> Capture(捕获) -> Capture MITM Overrides(捕获 MITM 覆写)`, which is `Modify MITM Hostname`.

1. Go to [wibus-wee/activation-script](https://github.com/wibus-wee/activation-script) and follow the installation instructions.
2. Run Raycast Unblock and Surge.
3. Open Raycast and use the features in the Pro Plan.

> [!NOTE]
> At present, activation-script will not forward the requests of Translate to Raycast Unblock by default, but will immediately forward the requests to DeepLX in the script. If you need to use the translation function of Raycast Unblock, you need to modify the code manually, please refer to the documentation of activation-script for details.

### If you don't have Surge

You need to throw all Raycast requests to the backend built by this project, but make sure that the backend can request Raycast Backend normally, because some functions need to request Raycast Backend once and then do it.

#### Other Proxy Tools

You can refer to the code in [wibus-wee/activation-script](https://github.com/wibus-wee/activation-script) and port it to other agent tools to continue using MiTM to hijack.

#### Hosts

You can modify your hosts file to make Raycast requests go to the backend built by this project.

```conf
<Your Backend IP> backend.raycast.com
```

> [!CAUTION]
> This method can only be used when the backend is deployed **remotely**, and cannot be used when the backend is deployed locally.

For users who use remote deployment, we recommend using `reverse proxy` to make Raycast Unblock service can be accessed normally, but this method requires you to **deploy SSL certificate** remotely, otherwise it will be invalid. At the same time, `general.host` needs to be configured as `0.0.0.0` in the `config.toml` file.

> [!NOTE]
> If you are building the backend locally, please do not let your proxy tool proxy both Raycast's requests and the backend service's requests, as this will cause it to not work properly.
>
> Raycast Unblock adds an `x-raycast-unblock` header to requests to Raycast Backend. You can determine whether this is a request from Raycast or Raycast Unblock by the presence of this header, and make the backend service work properly through conditional judgment. ( Raycast Unblock has turned off SSL check by default)
>
> Or you can deploy the backend to a remote server, and this will not be a problem.

[Related Code](https://github.com/wibus-wee/activation-script/blob/main/src/modules/index.ts#L70-L89)

### More

#### Deploy to remote server

Raycast Unblock can be deployed to a remote server, and then you can use it as a proxy server. But you need to modify the code in `activator.js` to make it work properly (if you are not using `Modify Hosts` method).

```diff
- "http://127.0.0.1:3000"
+ "<Your Remote Server Address>"
```

You should replace `http://127.0.0.1:3000` with your remote server address.

[Related Source Code](https://github.com/wibus-wee/activation-script/blob/main/src/modules/index.ts#L83C14-L83C35)

#### Use `pm2`

You can use `pm2` to manage the process. You can run `npm install -g pm2` to install it.

For example:

```bash
# Your config.toml file should be in this directory, or you should set the `--config` parameter
pm2 start index.mjs --name raycast-unblock
pm2 start ./raycast-unblock-app --name raycast-unblock
```

## Features

### Azure OpenAI
Assume you have such a azure endpoint link like following:

https://**yourAzure**.openai.azure.com/openai/deployments/**yourDeployment**/chat/completions?api-version=2023-07-01-preview

modify `[AI.OpenAI]` field in `config.toml` according to the following steps.
1. set `is_azure = true`
2. set `base_url = https://yourAzure.openai.azure.com`
3. set `azure_deployment_name = yourDeployment`

`azure_deployment_name` is optional and when it isn't provided, using `req.body.model` as a substitute. It is useful when you want to use multiple models.
### GitHub Copilot

Raycast Unblock provides a GitHub Copilot service, which can be used in Raycast feature.

#### Usage

1. Open / Download [scripts/get_copilot_token.mjs](./scripts//get_copilot_token.mjs) and run it.
2. Follow the steps displayed in the terminal to get the token.
3. Terminal will output the token, copy it.

> [!CAUTION]
> Please **do not leak this token to others**, otherwise it may cause the GitHub Copilot service to be abused, resulting in your account being banned.
>
> At the same time, if your backend is shared with others, please pay attention to the usage frequency to avoid deliberate abuse.

#### More

Or you can use [aaamoon/copilot-gpt4-service](htts://github.com/aaamoon/copilot-gpt4-service) to convert GitHub Copilot to OpenAI GPT API format, and you can use it to use GitHub Copilot.

> [!NOTE]
> You should set `AI.default` to `openai` in the `config.toml` file, and set `AI.OpenAI.baseUrl` to the address of the `copilot-gpt4-service` service.

### Shortcut Translator

Raycast Unblock provides a shortcut translator, which is only available on macOS. You can use it to translate text in Raycast Translate feature.

#### Usage

1. Open [iCloud Shortcut - RaycastUnblock.Translate.v1](https://www.icloud.com/shortcuts/4a907702fe3145d9a378a9c8af47bb2e) and add it to your shortcuts.
2. Modify your `config.toml` file and set `Translate.type` to `shortcut`.
3. Run Raycast Unblock and use Raycast Translate feature.

#### Notice

- This feature is only available on macOS.
- Some languages may not be recognized, this is because the system's built-in translation engine is used, which may be due to incorrect [dictionary settings](./src/features/translations/dict.ts) or encountering languages not supported by the system.
- If you are sure that it is a problem with the dictionary settings, you can submit an Issue or Pull Request to help us fix this problem.

### AI Translator

You can use AI to translate text in Raycast Translate feature. Prompts provided by `@zhuozhiyongde`.

#### Notice

- Pay attention to the request and usage issues, Translator may cause frequent requests to AI services, resulting in overuse or rate limit, so please use it carefully.

## Q&A

### I don't want to install Node.js, how can I use it?

You can use the `app` type dist, which is a single application, and does **not require** JS Runtime. Or use Docker to run it.

- [Download dist from actions - Usage](#download-dist-from-actions)
- [Docker - Usage](#docker-recommended)
- [Docker Compose - Usage](#docker-compose)

### I don't buy Surge, how can I use it?

Referring to the relevant code of [activation-script](https://github.com/wibus-wee/activation-script/blob/main/src/modules/index.ts#L70-L89) and porting it to other agent tools to continue using MiTM to hijack.

You can also use the Hosts file to forward Raycast requests to the backend service of Raycast Unblock.

- [If you don't have Surge - Usage](#if-you-dont-have-surge)

## Credits

- [Raycast](https://raycast.com)
- [zhuozhiyongde/Unlocking-Raycast-With-Surge](https://github.com/zhuozhiyongde/Unlocking-Raycast-With-Surge)
- [yufeikang/raycast_api_proxy](https://github.com/yufeikang/raycast_api_proxy)
- [aaamoon/copilot-gpt4-service](https://github.com/aaamoon/copilot-gpt4-service)
- [google/generative-ai-js](https://github.com/google/generative-ai-js)
- [OwO-Network/DeepLX](https://github.com/OwO-Network/DeepLX)

## Author

raycast-unblock © Wibus, Released under MIT. Created on Feb 2, 2024

> [Personal Website](http://wibus.ren/) · [Blog](https://blog.wibus.ren/) · GitHub [@wibus-wee](https://github.com/wibus-wee/) · Telegram [@wibus✪](https://t.me/wibus_wee)

<!-- Badges -->

[package-version-src]: https://img.shields.io/github/package-json/v/wibus-wee/raycast-unblock?style=flat&colorA=080f12&colorB=1fa669
[package-version-href]: https://github.com/wibus-wee/raycast-unblock
[license-src]: https://img.shields.io/github/license/wibus-wee/raycast-unblock.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/wibus-wee/raycast-unblock/blob/main/LICENSE
