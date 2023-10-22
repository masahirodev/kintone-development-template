## 使い方

詳しい説明は、[Zenn](https://zenn.dev/masahiro_dev/articles/kintone-development-template)をチェックしてみてくださいね。

### 初期設定など

まずは、各種ライブラリのインストールを行います。

```
npm install
```

次に環境変数を作っていきます。`.env.sample`などのファイルがあるので、`.sample`を消して使ってくださいね。

- `.env`:ここには、kintone にアップロードする際に使用するアカウント情報を入力します。
- `.env.development`:ここには、開発中に使用する環境変数を入力します。
- `.env.production`:ここには、本番環境に使用する環境変数を入力します。

※kintone の性質上、ここに記載した環境変数はすべてフロントからアクセスできます。そのため、APIKEY などは極力保存しないようにしましょう。

### フォルダ構成

```
.
├── dist
│   └── app[各アプリ]
│       ├── desktop.js
│       ├── desktop.js.LICENSE.txt
│       └── desktop.js.map
├── public
│   ├── config.html
│   └── icon.png
├── scripts[スクリプト関係]
├── src
│   ├── apps
│   │   └── app1[各アプリ]
│   │       ├── custom.css
│   │       ├── customize-manifest.json
│   │       ├── customize-manifest-prod.json
│   │       └── index.tsx
│   ├── plugins
│   │   └── plugins1[各プラグイン]
│   │       ├── dist
│   │       │   ├── config.js
│   │       │   ├── config.js.LICENSE.txt
│   │       │   ├── config.js.map
│   │       │   ├── desktop.js
│   │       │   ├── desktop.js.LICENSE.txt
│   │       │   ├── desktop.js.map
│   │       │   └── plugin.zip
│   │       ├── public
│   │       │   ├── config.html
│   │       │   └── icon.png
│   │       ├── config.tsx
│   │       ├── desktop.tsx
│   │       ├── manifest.json
│   │       └── private.ppk
│   ├── components[コンポーネント]
│   ├── css[globals.cssやglobals.scss]
│   ├── hooks
│   ├── lib[共通ファンクションなど]
│   ├── schema[typescript関係]
│   ├── types[globalなtypescript関係]
│   └── utils[共通変数など]
└── [コンフィグ関係]
```

## 使い方

### 新規作成

カスタマイズもしくはプラグインに必要なフォルダ・ファイルを作成します。

```
npm run init ${mode} ${appName}
```

mode には、plugin or app を入れます。
appName には、作りたいアプリ名を入れます。

参考例は

```
npm run init app sample
```

実行すると、app フォルダの中に、sample フォルダが作られており、カスタマイズに必要なファイルが作成されています。

※なお、必要に応じて`manifest`を修正してくださいね。

### 開発（watch / development モードでの起動）

カスタマイズもしくはプラグインの開発において、ソースコードの変更を検知して自動で kintone にアップロードします。
また、development の環境変数を使用し、ソースマップが作成されます。

```
npm run start ${appName}
```

`appName`に基づき、カスタマイズなのかプラグインなのか判定しています。
※カスタマイズのフォルダ名とプラグインのフォルダ名を一緒にしないでください。

アップロードの設定については

- 環境変数`.env`の情報に基づき kintone に接続されます。
- カスタマイズ：各カスタマイズフォルダの`customize-manifest.json`に基づき、アップロードされます。
- プラグイン：各プラグインフォルダの`manifest.json`に基づき、plugin.zip が構成され、アップロードする。

### デプロイ（production モードでの起動）

カスタマイズもしくはプラグインのデプロイが行われ、kintone にアップロードします。
ソースコードは圧縮され、ソースマップも作成されません。

```
npm run build ${appName}
```

`appName`に基づき、カスタマイズなのかプラグインなのか判定しています。
※カスタマイズのフォルダ名とプラグインのフォルダ名を一緒にしないでください。

デプロイ先について

- カスタマイズ：`dist/${appName}`フォルダにデプロイされます。
- プラグイン：各プラグインフォルダの`manifest.json`に基づき、plugin.zip が構成され、アップロードする。

アップロードの設定について

- 環境変数`.env`の情報に基づき kintone に接続されます。
- カスタマイズ：各カスタマイズフォルダの`customize-manifest-prod.json`に基づき、アップロードされます。
- プラグイン：各プラグインフォルダの`manifest.json`に基づき、plugin.zip が構成され、アップロードする。

## その他

### abs()関数に関する警告あり

Sass ファイル内で使用されている abs()関数に対する非推奨なパーセンテージ単位の使用に関する警告が表示されます。
このパーセンテージ単位の使用は非推奨とされており、CSS abs()関数を生成しなおす必要があります。

### scripts

`scripts`に一部`js`ファイルがあります。
これは、`npm-run-all`が`ts`非対応であること、本質的には`ts`対応不要と考え、そのまま混在させています。
ちょっと不細工ですよね。
