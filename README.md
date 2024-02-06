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
docker run -d --name raycast-unblock -p 3000:3000 --ai_key=your-open-ai-key --openai_base_url=https://api.openai.com --ai_type=openai --host=0.0.0.0 wibuswee/raycast-unblock:latest
```

> Replace `your-open-ai-key` with your OpenAI API key.

## Disclaimer

We only borrowed the **operation interface** of Raycast, and **did not modify the backend server** of Raycast.

We just coded a proxy server to forward Raycast's requests to our proxy server, and **implemented similar functions** in Raycast Pro Plan **in other ways**.

You can see all the code in the `src` directory. If you have any questions, please feel free to ask.

See [Unblock Features](#unblock-features) and [Unblock Routes](#unblock-routes) for more details.

## Unblock Features

- [x] Pro Plan Logo
- [x] AI Chat
  - [x] OpenAI
  - [x] Gemini
  - [x] GitHub Copilot - [Usage](#github-copilot)
- [x] Translation
  - [x] Shortcut (only for macOS) `🧪 Alpha` - [Usage](#shortcut-translator)
  - [x] AI - [Notice](#ai-translator)
  - [ ] 3rd Party `🤔 Help Wanted`
- [x] Cloud Sync
  - [x] iCloud Drive (only for macOS)
  - [x] Local Storage
- [x] Other Local Features

<details>
  <summary>

## Unblock Routes

  </summary>

- [x] `/me`
- [x] `/me/trial_status`
- [x] `/me/sync`
- [x] `/ai/models`
- [x] `/ai/chat_completions`
- [x] `/translations`

</details>

## Requirements

- Node.js 18.x
- macOS / Linux (Windows is not maintained)
- Surge (or other proxy tools)
- Raycast

## Usage

### Docker (Recommended)

You can use Docker to run Raycast Unblock.

#### Pull Image

```bash
docker pull wibuswee/raycast-unblock:latest
```

#### Run

```bash
docker run -d \
  --name raycast-unblock \
  -p 3000:3000 \
  --env /path/to/your/.env:/app/.env \
  wibuswee/raycast-unblock:latest
```

You should replace `/path/to/your/.env` with your `.env` file path. Or directly use parameter settings to set variables:

Change the environment variables in the `.env.example` file to trailing parameters and pass them to the `docker run` command. For example:

```bash
docker run -d \
  --name raycast-unblock \
  -p 3000:3000 \
  --ai_type=openai \
  --openai_base_url=https://api.openai.com \
  --ai_key=your-open-ai-key \
  --host=0.0.0.0
  wibuswee/raycast-unblock:latest
```

> [!NOTE]
> The key should be lowercase and use underscores to separate words.

### Download dist from actions

You can download the latest dist from [GitHub Actions](https://github.com/wibus-wee/raycast-unblock/actions/workflows/ci.yml).

The naming format is `raycast-unblock-<platform>-<type>`.

- `js` type is a small package with all dependencies bundled, but requires JS Runtime.
- `app` type is a single application, which is larger but does **not require** JS Runtime.

### Set environment variables

Copy / Download the `.env.example` file and rename it to `.env`, then fill in the environment variables.

After that, you should put the `.env` file in the same directory as the executable file.

### Run

```bash
# Your .env file should be in this directory
node index.js # or ./raycast-unblock-app

# ℹ Raycast Unblock
# ℹ Version: 0.0.0
```

If you want to run it in the background, you can use `pm2` or `nohup`.

### Use it with Surge

1. Go to [wibus-wee/activation-script](https://github.com/wibus-wee/activation-script) and follow the instructions to get the activation script.

> [!NOTE]
>
> If you modified the `PORT` in the `.env` file, you should modify activator script to make it work properly
>
> ```diff
> - "http://127.0.0.1:3000"
> + "<Your Remote Server Address>"
> ```
>
> [Related Source Code](https://github.com/wibus-wee/activation-script/blob/main/src/modules/index.ts#L83C14-L83C35)

1. Get your Surge config file and modify it like this: (Normally, `wibus-wee/activation-script` will help you modify this config file)

```conf
[MITM]
skip-server-cert-verify = true
h2 = true
hostname = *.raycast.com, <Your Original Proxy Hostname...>
ca-passphrase = <Your Original CA Passphrase>
ca-p12 = <Your Original CA P12 Setting>

[Script]
raycast-activate-backend.raycast.com = type=http-request,pattern=^https://backend.raycast.com,max-size=0,debug=1,script-path=activator.js
<Your Original Scripts...>
```

3. Run Surge with the modified config file.
4. Set your system proxy to Surge.
5. Run Raycast Unblock.
6. Enjoy!

> [!WARNING]
> In some cases, if you find that Raycast Unblock is not working properly, please go to the settings of Surge, and uncheck the last line `*` in `Surge -> HTTP -> Capture(捕获) -> Capture MITM Overrides(捕获 MITM 覆写)`, which is `Modify MITM Hostname`.

### If you don't have Surge

You need to throw all Raycast requests to the backend built by this project, but make sure that the backend can request Raycast Backend normally, because some functions need to request Raycast Backend once and then do it.

#### Hosts

You can modify your hosts file to make Raycast requests go to the backend built by this project.

```conf
backend.raycast.com <Your Backend IP>
# backend.raycast.com 127.0.0.1
```

But this method is required to modify the port of the backend to `80`. You should modify the `.env` file and set `PORT` to `80`.

> [!NOTE]
> If you are building the backend locally, please do not let your proxy tool proxy both Raycast's requests and the backend service's requests, as this will cause it to not work properly.
>
> Raycast Unblock adds an `x-raycast-unblock` header to requests to Raycast Backend. You can determine whether this is a request from Raycast or Raycast Unblock by the presence of this header, and make the backend service work properly through conditional judgment. ( Raycast Unblock has turned off SSL check by default )
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
# Your .env file should be in this directory
pm2 start index.mjs --name raycast-unblock
pm2 start ./raycast-unblock-app --name raycast-unblock
```

## Features

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
> You should set `AI_TYPE` to `openai` or `custom` in the `.env` file, and set `OPENAI_BASE_URL` to the address of the `copilot-gpt4-service` service.

### Shortcut Translator

Raycast Unblock provides a shortcut translator, which is only available on macOS. You can use it to translate text in Raycast Translate feature.

#### Usage

1. Open [iCloud Shortcut - RaycastUnblock.Translate.v1](https://www.icloud.com/shortcuts/4a907702fe3145d9a378a9c8af47bb2e) and add it to your shortcuts.
2. Modify your `.env` file and set `TRANSLATE_TYPE` to `shortcut`.
3. Run Raycast Unblock and use Raycast Translate feature.

#### Notice

- This feature is only available on macOS.
- Some languages may not be recognized, this is because the system's built-in translation engine is used, which may be due to incorrect [dictionary settings](./src/features/translations/dict.ts) or encountering languages not supported by the system.
- If you are sure that it is a problem with the dictionary settings, you can submit an Issue or Pull Request to help us fix this problem.

### AI Translator

You can use AI to translate text in Raycast Translate feature. Prompts provided by `@zhuozhiyongde`.

#### Notice

- Pay attention to the request and usage issues, Translator may cause frequent requests to AI services, resulting in overuse or rate limit, so please use it carefully.

## Credits

- [Raycast](https://raycast.com)
- [zhuozhiyongde/Unlocking-Raycast-With-Surge](https://github.com/zhuozhiyongde/Unlocking-Raycast-With-Surge)
- [yufeikang/raycast_api_proxy](https://github.com/yufeikang/raycast_api_proxy)
- [aaamoon/copilot-gpt4-service](https://github.com/aaamoon/copilot-gpt4-service)
- [google/generative-ai-js](https://github.com/google/generative-ai-js)

## Author

raycast-unblock © Wibus, Released under MIT. Created on Feb 2, 2024

> [Personal Website](http://wibus.ren/) · [Blog](https://blog.wibus.ren/) · GitHub [@wibus-wee](https://github.com/wibus-wee/) · Telegram [@wibus✪](https://t.me/wibus_wee)

<!-- Badges -->

[package-version-src]: https://img.shields.io/github/package-json/v/wibus-wee/raycast-unblock?style=flat&colorA=080f12&colorB=1fa669
[package-version-href]: https://github.com/wibus-wee/raycast-unblock
[license-src]: https://img.shields.io/github/license/wibus-wee/raycast-unblock.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/wibus-wee/raycast-unblock/blob/main/LICENSE
