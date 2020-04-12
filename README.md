# 必要なもの

ステージング、本番環境へのマイグレーション、デプロイには以下が必要です

[aws cli v2](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/install-cliv2-mac.html)

[ecs-cli](https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/ECS_CLI_installation.html)

# 起動方法

```bash
$ npm i
$ npm run start:db      # rem、rem_testデータベースが作成され、ポスグレが起動します
$ npm run migration:run # remデータベースへのマイグレーションの実行
$ npm start
```

# コマンドの実行

## ローカル

```bash
$ npm run command:dev -- <your command>
```

例として作っているサンプルのコマンド

```bash
$ npm run command:dev -- sample
$ npm run command:dev -- sample find 1
$ npm run command:dev -- sample findAll
```

# swagger

```
http://localhost:3000/api
```

# Test

```bash
$ npm run migration:run:test
$ npm run test
```

# マイグレーション

## マイグレーションファイルの自動作成

ソースコードの entity からマイグレーションファイルが自動生成されます

```bash
$ npm run migration:generate <ファイル名>
```

## 実行

### ローカル

```bash
$ npm run migration:run
```

### テスト

```bash
$ npm run migration:run:test
```

### ステージング

```bash
$ npm run migration:run:stg
```

### 本番

```bash
$ npm run migration:run:prod
```

## 状態の確認

### ローカル

```bash
$ npm run migration:status
```

### テスト

```bash
$ npm run migration:status:test
```

### ステージング

```bash
$ npm run migration:status:stg
```

### 本番

```bash
$ npm run migration:status:prod
```

# デプロイ

## api サーバー

### ステージング

```bash
$ npm run deploy:stg
```

### 本番

```bash
$ npm run deploy:prod
```

## バッチ サーバー

### ステージング

```bash
$ npm run deploy:batch:stg
```

### 本番

```bash
$ npm run deploy:batch:prod
```

# ログの保存場所

## api サーバー

### stg

CloudWatch のロググループ: /ecs/rem-api-stg

### prod

CloudWatch のロググループ: /ecs/rem-api-prod

## バッチサーバー

### stg

CloudWatch のロググループ: /ecs/rem-batch-stg

### prod

CloudWatch のロググループ: /ecs/rem-batch-prod

## マイグレーション

### stg

CloudWatch のロググループ: /ecs/rem-stg-migrate

### prod

CloudWatch のロググループ: /ecs/rem-prod-migrate