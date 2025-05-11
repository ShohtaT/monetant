# ESLint設定の説明

## 基本設定

- `extends`: 以下の基本設定を継承
  - `next/core-web-vitals`: Next.jsの推奨設定
  - `plugin:@typescript-eslint/recommended`: TypeScriptの推奨設定
  - `plugin:react/recommended`: Reactの推奨設定
  - `plugin:unicorn/recommended`: Unicornプラグインの推奨設定
  - `prettier`: Prettierとの競合を避けるための設定

## パーサーとプラグイン

- `parser`: TypeScriptのパーサーを使用
- `plugins`: 以下のプラグインを使用
  - `@typescript-eslint`: TypeScript用のルール
  - `react`: React用のルール
  - `unicorn`: 追加のベストプラクティスルール

## 主要なルール設定

### React関連

- `react/react-in-jsx-scope`: React 17以降では不要なimportを無効化
- `react/jsx-uses-react`: React 17以降では不要なimportを無効化
- `react/jsx-no-useless-fragment`: 不要なフラグメントを禁止
- `react/jsx-curly-brace-presence`: JSXの波括弧の使用を制限

### TypeScript関連

- `@typescript-eslint/no-unused-vars`: 未使用の変数は警告
- `@typescript-eslint/ban-types`: 型の使用制限を無効化

### コード品質

- `no-constant-condition`: 無限ループを防止
- `no-magic-numbers`: マジックナンバーを禁止（-1, 0, 1は除外）
- `spaced-comment`: コメントの前後にスペースを要求
- `no-nested-ternary`: ネストされた三項演算子を禁止
- `max-depth`: ネストの深さを制限（最大4階層）
- `complexity`: コードの複雑さを制限（最大15）
- `no-fallthrough`: switch文でのフォールスルーを禁止
- `eqeqeq`: 厳密等価演算子を強制
- `no-implicit-coercion`: 暗黙的な型変換を禁止

### Unicornプラグインの設定

以下のUnicornプラグインのルールを無効化：

- `prevent-abbreviations`: 省略形の使用を許可
- `filename-case`: ファイル名のケースを制限しない
- `no-null`: nullの使用を許可
- `prefer-module`: ESモジュールの使用を強制しない
- `prefer-top-level-await`: トップレベルのawaitを強制しない
- 配列メソッド関連のルール（`prefer-array-*`）: 標準的な配列メソッドの使用を許可

## 設定

- `settings.react.version`: Reactのバージョンを自動検出
