# API実装タスクリスト

## アーキテクチャアプローチ

このAPIは**Domain-Driven Design (DDD)**と**CQRS**パターンを採用し、以下の層で構成されます：

- **API Layer**: Next.js API Routesによるリクエスト処理
- **Domain Layer**: Commands/Queries/Entities/Repository interfaces
- **Infrastructure Layer**: リポジトリ実装とデータベースアクセス

## 認証API

### POST /api/v1/auth/signup ✅ 完了
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

### POST /api/v1/auth/login  
- [ ] バリデーション（必須項目チェック）
- [ ] Supabase認証統合（sign in）
- [ ] セッション管理
- [ ] エラーハンドリング（認証失敗等）

### GET /api/v1/auth/session
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
- [x] signupUserCommand（Supabase認証 + DB保存統合）
- [x] CreateUserCommand（DB保存のみ）
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
- [ ] ドメインエンティティのテスト
- [ ] コマンド/クエリのテスト
- [ ] バリデーションのテスト

#### 統合テスト
- [ ] API エンドポイントのテスト
- [ ] データベース操作のテスト
- [ ] 認証フローのテスト

#### E2Eテスト
- [ ] 支払い作成フロー
- [ ] グループ作成・招待フロー
- [ ] 認証フロー

### ドキュメント
- [ ] API仕様書更新（OpenAPI）
- [ ] エラーコード定義
- [ ] 認証・認可仕様書
- [ ] DDDアーキテクチャドキュメント