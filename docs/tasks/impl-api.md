# API実装タスクリスト

## 認証API

### POST /v1/auth/signup
- [ ] Supabase認証統合
- [ ] ユーザーレコード作成（auth_id, email, nickname）
- [ ] バリデーション（email形式、パスワード強度）
- [ ] エラーハンドリング（重複email等）

### POST /v1/auth/login
- [ ] Supabase認証統合
- [ ] セッション管理
- [ ] バリデーション（必須項目チェック）
- [ ] エラーハンドリング（認証失敗等）

### GET /v1/auth/session
- [ ] セッション検証
- [ ] ユーザー情報取得
- [ ] エラーハンドリング（無効セッション等）

## 支払いAPI

### POST /v1/payments
- [ ] グループメンバーシップ認可チェック
- [ ] Payment作成（title, amount, note, creator_id, group_id）
- [ ] DebtRelations作成（複数レコード一括処理）
- [ ] バリデーション（amount > 0、split_amount合計チェック等）
- [ ] トランザクション処理（Payment + DebtRelations）
- [ ] エラーハンドリング

### GET /v1/payments/group/:group_id
- [ ] グループメンバーシップ認可チェック
- [ ] グループの支払い一覧取得
- [ ] 古い順ソート（created_at ASC）
- [ ] 関連データ取得（creator情報等）
- [ ] エラーハンドリング

### GET /v1/payments/unpaid
- [ ] 認証ユーザーの未払い請求取得
- [ ] DebtRelationsテーブルから抽出（status = unpaid）
- [ ] 古い順ソート（created_at ASC）
- [ ] 関連データ取得（Payment, creator情報等）
- [ ] エラーハンドリング

### GET /v1/payments/:id
- [ ] グループメンバーシップ認可チェック
- [ ] Payment詳細取得
- [ ] DebtDetails一覧取得
- [ ] 関連データ取得（creator, repayer情報等）
- [ ] エラーハンドリング

### PUT /v1/payments/:id
- [ ] グループメンバーシップ認可チェック
- [ ] Payment更新（title, amount, note）
- [ ] DebtRelations更新/削除/追加処理
- [ ] バリデーション（amount > 0、split_amount合計チェック等）
- [ ] トランザクション処理
- [ ] エラーハンドリング

## グループAPI

### POST /v1/groups
- [ ] Group作成（name, uid生成）
- [ ] GroupUser作成（作成者を自動追加）
- [ ] バリデーション（name必須等）
- [ ] トランザクション処理
- [ ] エラーハンドリング

### GET /v1/groups
- [ ] 認証ユーザーの所属グループ一覧取得
- [ ] GroupUserテーブルから抽出
- [ ] 関連データ取得（Group情報）
- [ ] エラーハンドリング

### PUT /v1/groups/:id
- [ ] グループメンバーシップ認可チェック
- [ ] Group更新（name）
- [ ] バリデーション（name必須等）
- [ ] エラーハンドリング

### DELETE /v1/groups/:id/users/:user_id
- [ ] グループメンバーシップ認可チェック
- [ ] GroupUserレコード削除
- [ ] 自分自身の削除防止チェック
- [ ] エラーハンドリング

## グループ招待・加入API

### POST /v1/groups/:id/invite
- [ ] グループメンバーシップ認可チェック
- [ ] 招待トークン生成（JWT or UUID）
- [ ] 招待URL生成
- [ ] トークン有効期限設定
- [ ] エラーハンドリング

### POST /v1/groups/join
- [ ] 招待トークン検証
- [ ] グループ存在チェック
- [ ] 重複参加チェック
- [ ] GroupUserレコード作成
- [ ] エラーハンドリング

## 共通実装タスク

### ドメインエンティティ
- [ ] User Entity
- [ ] Payment Entity
- [ ] DebtRelation Entity
- [ ] Group Entity
- [ ] GroupUser Entity

### リポジトリ実装
- [ ] UserRepository (Supabase)
- [ ] PaymentRepository (Supabase)
- [ ] DebtRelationRepository (Supabase)
- [ ] GroupRepository (Supabase)
- [ ] GroupUserRepository (Supabase)

### ユースケース実装
- [ ] 認証関連ユースケース
- [ ] 支払い関連ユースケース
- [ ] グループ関連ユースケース
- [ ] グループ招待・加入ユースケース

### インフラ設定
- [ ] Supabase設定確認
- [ ] データベーススキーマ確認/更新
- [ ] 環境変数設定
- [ ] CORS設定

### テスト
- [ ] ユニットテスト（ユースケース層）
- [ ] 統合テスト（API層）
- [ ] E2Eテスト（主要フロー）

### ドキュメント
- [ ] API仕様書更新
- [ ] エラーコード定義
- [ ] 認証・認可仕様書