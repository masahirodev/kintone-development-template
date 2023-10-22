import path from "path";
// import webpack from "webpack";
import KintonePlugin from "@kintone/webpack-plugin-kintone-plugin";

import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import RemoveEmptyScriptsPlugin from "webpack-remove-empty-scripts";

import Dotenv from "dotenv-webpack";

// ------------------------------ カスタマイズ ------------------------------ //

// カスタマイズ用の設定
const getCustomizeConfig = (appName: string) => {
  const dir = `./src/apps/${appName}`;
  return {
    entry: {
      desktop: `${dir}/index.tsx`,
    },
    output: {
      path: path.resolve(__dirname, `dist/${appName}`),
      filename: "[name].js",
      clean: true,
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    plugins: [
      // kintoneの大元に入れているライブラリをグローバル変数として使いたい場合
      // new webpack.Provideplugin({
      //   $: "jquery",
      // }),
    ],
    // ビルドの速度を上げたい場合
    // ※パフォーマンスよりも安全性を優先している為、webpack はデフォルトでファイルキャッシュをオンにしていない）
    cache: {
      type: "filesystem",
      buildDependencies: {
        config: [__filename],
      },
    },
  };
};

// ------------------------------ プラグイン ------------------------------ //

// プラグイン用の設定
const getPluginConfig = (appName: string) => {
  const dir = `./src/plugins/${appName}`;

  return {
    entry: {
      desktop: `${dir}/desktop.tsx`,
      config: `${dir}/config.tsx`,
    },
    output: {
      path: path.resolve(__dirname, `${dir}/dist`),
      filename: "[name].js",
      clean: true,
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    plugins: [
      new KintonePlugin({
        manifestJSONPath: `${dir}/manifest.json`,
        privateKeyPath: `${dir}/private.ppk`,
        pluginZipPath: `${dir}/dist/plugin.zip`,
      }),
    ],
    // ビルドの速度を上げたい場合
    // ※パフォーマンスよりも安全性を優先している為、webpack はデフォルトでファイルキャッシュをオンにしていない）
    cache: {
      type: "filesystem",
      buildDependencies: {
        config: [__filename],
      },
    },
  };
};

// ------------------------------ 共通 ------------------------------ //

// CSSをjsにbundleしたい場合;
const bundleConfig = {
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  useBuiltIns: "usage",
                  corejs: 3,
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(s[ac]ss)$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
            options: {
              importLoaders: 2,
              // 0 => no loaders (default);
              // 1 => postcss-loader;
              // 2 => postcss-loader, sass-loader
            },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                // グリッドレイアウト使用する際は、grid:true
                plugins: [
                  [
                    "autoprefixer",
                    {
                      grid: true,
                    },
                  ],
                ],
              },
            },
          },
          {
            loader: "sass-loader",
          },
        ],
      },
      {
        test: /\.css/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              url: false,
            },
          },
        ],
      },
    ],
  },
  plugins: [],
};

// CSSを個別に出力したい場合
const notCssBundleConfig = {
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  useBuiltIns: "usage",
                  corejs: 3,
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(s[ac]ss)$/,
        use: [
          {
            // CSSを別ファイルとして出力する
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
            options: {
              importLoaders: 2,
              // 0 => no loaders (default);
              // 1 => postcss-loader;
              // 2 => postcss-loader, sass-loader
            },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                // グリッドレイアウト使用する際は、grid:true
                plugins: [
                  [
                    "autoprefixer",
                    {
                      grid: true,
                    },
                  ],
                ],
              },
            },
          },
          {
            loader: "sass-loader",
          },
        ],
      },
      {
        test: /\.css/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
            options: {
              url: false,
            },
          },
        ],
      },
    ],
  },
  // CSSをminify
  optimization: {
    minimize: true, // 最小化を有効にする
    minimizer: [new CssMinimizerPlugin()],
  },
  plugins: [
    // CSSを別ファイルとして出力する
    new MiniCssExtractPlugin(),

    // 不要なJSファイルを消す
    new RemoveEmptyScriptsPlugin(),
  ],
};

module.exports = (env: any, argv: any) => {
  let addConfig = bundleConfig; // CSSをbundleしたい場合
  // let addConfig = notCssBundleConfig; // CSSをbundleしたくない場合

  // 環境変数の読込
  let customPlugins = [
    new Dotenv({
      path: path.resolve(__dirname, `.env.${argv.mode}`),
    }),
  ];

  if (argv.mode === "development") {
    // 開発のときのみsource-map作成
    addConfig = {
      ...addConfig,
      ...{
        devtool: "source-map",
      },
    };
  }

  if (argv.mode === "production") {
  }

  const appName = env.APP_NAME;
  const pluginConfig = getPluginConfig(appName);
  const customizeConfig = getCustomizeConfig(appName);

  return [
    {
      name: "plugins",
      ...pluginConfig,
      ...addConfig,
      plugins: [
        ...pluginConfig.plugins,
        ...addConfig.plugins,
        ...customPlugins,
      ],
    },
    {
      name: "apps",
      ...customizeConfig,
      ...addConfig,
      plugins: [
        ...customizeConfig.plugins,
        ...addConfig.plugins,
        ...customPlugins,
      ],
    },
  ];
};
