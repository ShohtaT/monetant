# API実装タスクリスト

## アーキテクチャアプローチ

このAPIは**Domain-Driven Design (DDD)**と**CQRS**パターンを採用し、以下の層で構成されます：

- **API Layer**: Next.js API Routesによるリクエスト処理
- **Domain Layer**: Commands/Queries/Entities/Repository interfaces
- **Infrastructure Layer**: リポジトリ実装とデータベースアクセス

## サインアップ機能

### API: POST /api/v1/auth/signup ✅ 完了
- [x] バリデーション（email形式、パスワード強度）
  - `src/backend/utils/validation.ts` - zodを使用したスキーマ検証（型安全）
- [x] Supabase認証統合（sign up）
  - `src/backend/infrastructure/external/supabase.ts` - Supabaseクライアント設定
- [x] ユーザーエンティティ作成（auth_id, email, nickname）
  - `src/backend/domains/user/entities/User.ts` - Userドメインエンティティ
  - `src/backend/domains/user/entities/UserRequest.ts` - リクエスト型定義
  - `src/backend/domains/user/entities/UserResponse.ts` - レスポンス型定義
- [x] UserRepository保存処理
  - `src/backend/domains/user/repositories/UserRepository.ts` - リポジトリインターフェース
  - `src/backend/infrastructure/database/repositories/PrismaUserRepository.ts` - Prisma実装
- [x] エラーハンドリング（重複email等）
  - `src/backend/utils/errors.ts` - エラークラス定義（Zod統合）
  - `src/backend/domains/user/commands/signup.ts` - signupUserコマンド実装
  - `src/app/api/v1/auth/signup/route.ts` - 薄いAPI Route実装（型安全）
- [x] テスト実装
  - `src/backend/domains/user/commands/signup.test.ts` - 包括的テストカバレッジ

### Frontend: サインアップ画面 ✅ 完了
- [x] フロントエンドアーキテクチャ設定
  - `src/frontend/features/auth/` - 認証機能専用ディレクトリ
  - `src/frontend/shared/ui/` - 共通UIコンポーネント
  - `src/frontend/types/` - 型定義
- [x] react-hook-form導入
  - `react-hook-form@7.60.0` - フォーム管理ライブラリ
  - `@hookform/resolvers@5.1.1` - Zodリゾルバー
- [x] UIコンポーネント実装
  - `src/frontend/shared/ui/InputField.tsx` - 入力フィールド（forwardRef対応）
  - `src/frontend/shared/ui/Button.tsx` - 送信ボタン
  - `src/frontend/shared/ui/Loading.tsx` - ローディング表示
- [x] バリデーション実装
  - `src/frontend/features/auth/validation.ts` - Zodスキーマ（サーバーと同期）
- [x] API連携
  - `src/frontend/features/auth/api.ts` - signup API呼び出し
  - `src/frontend/types/auth.ts` - 型定義
- [x] フォームコンポーネント実装
  - `src/frontend/features/auth/components/SignupForm.tsx` - メインフォーム
  - `src/frontend/features/auth/components/SignupPage.tsx` - ページレイアウト
- [x] ルーティング設定
  - `src/app/auth/signup/page.tsx` - Next.js App Router
- [x] Tailwind CSS設定
  - `src/app/globals.css` - Tailwindディレクティブ
  - `tailwind.config.ts` - frontendディレクトリ対応

### やったこと
- フロントエンドアーキテクチャドキュメントに従った実装
- react-hook-formとZodを使った型安全なフォーム
- Loading.tsxを使った統一されたローディング表示
- リニューアルされたUIコンポーネントの統合
- Tailwind CSSの設定修正
- アーキテクチャ再構成：auth削除、login/signup分離
- API再構成：/api/v1/auth/{login,signup} → /api/v1/{login,signup}

## ログイン機能

### API: POST /api/v1/login ✅ 完了
- [x] バリデーション（必須項目チェック）
- [x] Supabase認証統合（sign in）
- [x] セッション管理
- [x] エラーハンドリング（認証失敗等）
  - `src/backend/domains/user/commands/login.ts` - loginコマンド実装
  - `src/app/api/v1/login/route.ts` - API Route実装

### Frontend: ログイン画面 ✅ 完了
- [x] ログインフォーム実装
  - [x] react-hook-form + Zod
  - [x] 既存UIコンポーネント使用
- [x] API連携
- [x] エラーハンドリング
- [x] ルーティング設定
  - `src/frontend/features/login/` - ログイン機能ディレクトリ
  - `src/app/login/page.tsx` - Next.js App Router

### API: GET /api/v1/auth/session
- [ ] セッション検証
- [ ] ユーザー情報取得クエリ
- [ ] エラーハンドリング（無効セッション等）

## 支払いAPI

### POST /api/v1/payments
- [ ] バリデーション（amount > 0、split_amount合計チェック等）
- [ ] グループメンバーシップ認可チェック
- [ ] Payment作成コマンド（title, amount, note, creator_id, group_id）
- [ ] DebtRelations作成コマンド（複数レコード一括処理）
- [ ] トランザクション処理（Payment + DebtRelations）
- [ ] エラーハンドリング

### GET /api/v1/payments/group/[group_id]
- [ ] グループメンバーシップ認可チェック
- [ ] グループの支払い一覧取得クエリ
- [ ] 古い順ソート（created_at ASC）
- [ ] 関連データ取得（creator情報等）
- [ ] エラーハンドリング

### GET /api/v1/payments/unpaid
- [ ] 認証ユーザーの未払い請求取得クエリ
- [ ] DebtRelationsテーブルから抽出（status = AWAITING）
- [ ] 古い順ソート（created_at ASC）
- [ ] 関連データ取得（Payment, creator情報等）
- [ ] エラーハンドリング

### GET /api/v1/payments/[id]
- [ ] グループメンバーシップ認可チェック
- [ ] Payment詳細取得クエリ
- [ ] DebtRelations一覧取得
- [ ] 関連データ取得（creator, repayer情報等）
- [ ] エラーハンドリング

### PUT /api/v1/payments/[id]
- [ ] バリデーション（amount > 0、split_amount合計チェック等）
- [ ] グループメンバーシップ認可チェック
- [ ] Payment更新コマンド（title, amount, note）
- [ ] DebtRelations更新/削除/追加処理
- [ ] トランザクション処理
- [ ] エラーハンドリング

## グループAPI

### POST /api/v1/groups
- [ ] バリデーション（name必須等）
- [ ] Group作成コマンド（name, uid生成）
- [ ] GroupUser作成コマンド（作成者を自動追加）
- [ ] トランザクション処理
- [ ] エラーハンドリング

### GET /api/v1/groups
- [ ] 認証ユーザーの所属グループ一覧取得クエリ
- [ ] GroupUserテーブルから抽出
- [ ] 関連データ取得（Group情報）
- [ ] エラーハンドリング

### PUT /api/v1/groups/[id]
- [ ] バリデーション（name必須等）
- [ ] グループメンバーシップ認可チェック
- [ ] Group更新コマンド（name）
- [ ] エラーハンドリング

### DELETE /api/v1/groups/[id]/users/[user_id]
- [ ] グループメンバーシップ認可チェック
- [ ] 自分自身の削除防止チェック
- [ ] GroupUserレコード削除コマンド
- [ ] エラーハンドリング

## グループ招待・加入API

### POST /api/v1/groups/[id]/invite
- [ ] グループメンバーシップ認可チェック
- [ ] 招待トークン生成（JWT or UUID）
- [ ] 招待URL生成
- [ ] トークン有効期限設定
- [ ] エラーハンドリング

### POST /api/v1/groups/join
- [ ] 招待トークン検証
- [ ] グループ存在チェック
- [ ] 重複参加チェック
- [ ] GroupUserレコード作成コマンド
- [ ] エラーハンドリング

## 共通実装タスク

### ドメインレイヤー実装（DDD）

#### エンティティ (`backend/domains/*/entities/`)
- [x] User Entity（ビジネスルール含む）
- [x] UserRequest（AuthSignupRequest, AuthLoginRequest）
- [x] UserResponse（UserResponse, AuthSignupResponse, toUserResponse関数）
- [ ] Payment Entity（支払い総額バリデーション）
- [ ] DebtRelation Entity（分割金額バリデーション）
- [ ] Group Entity（UID生成ロジック）
- [ ] GroupUser Entity（メンバーシップ管理）

#### リポジトリインタフェース (`backend/domains/*/repositories/`)
- [x] UserRepository interface
- [ ] PaymentRepository interface
- [ ] DebtRelationRepository interface
- [ ] GroupRepository interface
- [ ] GroupUserRepository interface

#### コマンド実装 (`backend/domains/*/commands/`)
- [x] signup（Supabase認証 + DB保存統合）
  - `src/backend/domains/user/commands/signup.ts` - メイン実装
- [x] login（Supabase認証 + DBユーザー取得）
  - `src/backend/domains/user/commands/login.ts` - メイン実装
- [ ] CreatePaymentCommand
- [ ] UpdatePaymentCommand
- [ ] CreateGroupCommand
- [ ] CreateGroupUserCommand
- [ ] DeleteGroupUserCommand

#### クエリ実装 (`backend/domains/*/queries/`)
- [ ] GetUserByIdQuery
- [ ] GetPaymentsByGroupQuery
- [ ] GetUnpaidPaymentsQuery
- [ ] GetPaymentByIdQuery
- [ ] GetGroupsByUserQuery

### インフラストラクチャレイヤー実装

#### リポジトリ実装 (`backend/infrastructure/database/repositories/`)
- [x] PrismaUserRepository
- [ ] PrismaPaymentRepository
- [ ] PrismaDebtRelationRepository
- [ ] PrismaGroupRepository
- [ ] PrismaGroupUserRepository

#### データベース設定
- [x] Prismaスキーマ確認/更新
- [x] データベース接続確認（Supabase PostgreSQL）
- [x] 環境変数設定

#### 外部サービス統合
- [x] Supabase認証クライアント設定
- [ ] セッション管理設定

### API層実装

#### バリデーション (`backend/utils/validation.ts`)
- [x] 認証リクエストバリデーション（signup/login）- 型安全なZodスキーマ
- [ ] 支払い作成バリデーション
- [ ] グループ作成バリデーション
- [ ] 共通バリデーションヘルパー

#### エラーハンドリング (`backend/utils/errors.ts`)
- [x] ドメインエラー定義
- [x] HTTPエラーレスポンス標準化
- [x] エラーロギング設定

#### 認可機能
- [ ] セッション検証ミドルウェア
- [ ] グループメンバーシップチェック
- [ ] 権限チェックヘルパー

### テスト

#### ユニットテスト
- [x] ドメインエンティティのテスト
  - [x] User Entity バリデーションテスト
- [x] コマンド/クエリのテスト
  - [x] signup コマンドテスト（Vitest使用）
    - `src/backend/domains/user/commands/signup.test.ts` - 包括的テストカバレッジ
    - 正常系：ユーザー作成、レスポンス形式検証
    - 異常系：重複email、Supabase認証エラー、バリデーションエラー
    - エッジケース：空白nickname、長すぎるnickname、無効auth_id
- [ ] バリデーションのテスト

#### 統合テスト
- [ ] API エンドポイントのテスト
- [ ] データベース操作のテスト
- [ ] 認証フローのテスト

### 開発環境・ツール

#### テスティングフレームワーク
- [x] Vitestセットアップ（Jest代替）
  - より高速で現代的なテスティング環境
  - TypeScript完全サポート
  - ESM対応

### ドキュメント
- [ ] API仕様書更新（OpenAPI）
- [ ] エラーコード定義
- [ ] 認証・認可仕様書
- [ ] DDDアーキテクチャドキュメント