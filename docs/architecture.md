# アプリケーションアーキテクチャ

このドキュメントでは、bill-split-appのアーキテクチャ設計思想と構成について説明します。

## アーキテクチャの概要

本アプリケーションは以下の設計思想に基づいて構築されています：

1. **クリーンアーキテクチャの採用**

   - 層の分離による関心事の分離
   - 依存関係の制御
   - ビジネスロジックの独立性の確保

2. **依存性の方向**

```
UI (Pages) → Services → Repositories → External (Supabase)
```

- 内側の層は外側の層に依存しない
- 外部依存（Supabase）はRepositories層でカプセル化
- 各層は独立してテスト可能

## 層構造の説明

### 1. プレゼンテーション層 (`src/app/`)

- Next.js App Routerを採用
- ページコンポーネントとUIロジックを管理
- Server ComponentsとClient Componentsの適切な使い分け
- ユーザーインターフェースの責務に集中

### 2. ビジネスロジック層 (`src/services/`)

- アプリケーションのコアロジックを実装
- ユースケースの実装
- ドメインルールの適用
- データの整形や加工

実装例：

```typescript
export class PaymentService {
  // リポジトリへの依存を注入
  constructor(private paymentRepository: PaymentRepository) {}

  // ビジネスロジックを実装
  async createPayment(title: string, amount: number, billings: Billing[]) {
    // バリデーションやビジネスルールの適用
    // データの整形
    // リポジトリを使用したデータ操作
  }
}
```

### 3. データアクセス層 (`src/repositories/`)

- データベース（Supabase）とのインタラクション
- クエリの実行とデータの永続化
- 外部サービスとの通信をカプセル化

実装例：

```typescript
export class PaymentRepository {
  // Supabaseクライアントへの依存
  constructor(private supabaseClient: SupabaseClient) {}

  // データアクセスメソッド
  async getPayments(): Promise<Payment[]> {
    const { data, error } = await this.supabaseClient.from('Payments').select();
    if (error) throw error;
    return data;
  }
}
```

## 状態管理 (`src/stores/`)

Zustandを使用した状態管理の実装：

- グローバル状態の一元管理
- 各機能ごとに分割された状態管理
  - ユーザー状態 (`users.ts`)
  - 支払い状態 (`payments.ts`)
  - ナビゲーション状態 (`navigation.ts`)

## コンポーネント設計 (`src/components/`)

- 再利用可能なUIコンポーネントの分離
- 共通コンポーネントの集約
- フォームコンポーネントの標準化

## 型システム (`src/types/`)

- ドメインモデルの型定義
- 厳格な型チェックの活用
- インターフェースとタイプエイリアスの定義

## アーキテクチャの利点

1. **保守性**

   - 各層の責務が明確
   - 変更の影響範囲が限定的
   - コードの理解が容易

2. **テスタビリティ**

   - 各層が独立してテスト可能
   - モックやスタブの作成が容易
   - ビジネスロジックの単体テストが書きやすい

3. **スケーラビリティ**

   - 新機能の追加が容易
   - チーム開発での作業分担がしやすい
   - コードベースの拡張性が高い

4. **依存性の制御**
   - 外部サービスの変更が内部に影響しにくい
   - ビジネスロジックが技術的な実装から独立
   - インフラストラクチャの変更が容易

## ディレクトリ構造の詳細

```
src/
├── app/                  # Next.js App Router
│   ├── layout.tsx         # ルートレイアウト
│   ├── page.tsx          # ルートページ
│   ├── login/            # ログイン機能
│   ├── signup/           # サインアップ機能
│   ├── mypage/           # ユーザープロフィール
│   └── payments/         # 支払い関連機能
│
├── components/           # 再利用可能なコンポーネント
│   └── common/           # 共通コンポーネント
│
├── services/            # ビジネスロジック層
│   ├── authService.ts    # 認証サービス
│   ├── paymentService.ts # 支払いサービス
│   └── ...
│
├── repositories/        # データアクセス層
│   ├── authRepository.ts # 認証リポジトリ
│   ├── paymentRepository.ts # 支払いリポジトリ
│   └── ...
│
└── types/              # 型定義
    ├── payment.ts       # 支払い関連の型
    └── ...
```

## 今後の展望

1. **テストカバレッジの向上**

   - 単体テストの追加
   - 統合テストの実装
   - E2Eテストの導入

2. **パフォーマンスの最適化**

   - キャッシング戦略の実装
   - バンドルサイズの最適化
   - レンダリングパフォーマンスの改善

3. **セキュリティの強化**
   - 認証・認可の強化
   - 入力バリデーションの改善
   - セキュリティヘッダーの最適化
