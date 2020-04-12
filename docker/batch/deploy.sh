#!/bin/bash
set -eu

# $1 : stg or prod
ENV_ARG=$1
args_count=$#

# 引数チェック
check_args() {
    if [ $args_count -ne 1 ]; then
        echo "指定された引数は $args_count 個です。" 1>&2
        echo "実行するには 1 個の引数が必要です。" 1>&2
        exit 0
    fi
    
    if [ "$ENV_ARG" = prod ]; then
        ENV_NAME_JP="本番環境"
        elif [ "$ENV_ARG" = stg ]; then
        ENV_NAME_JP="ステージング環境"
    else
        echo "第1引数には、stgまたはprodを指定してください" 1>&2
        exit 0
    fi
}

select_branch() {
    DEFAULT_BRANCH_NAME=master
    
    echo "$ENV_NAME_JP へのデプロイを実行します。"
    
    if [ "$ENV_ARG" = stg ]; then
        echo 'デフォルト値は Enter キーを入力してください。'
        while true; do
            read -p "> ブランチ名を指定してください。[$DEFAULT_BRANCH_NAME] : " BRANCH_NAME
            case $BRANCH_NAME in
                "" ) BRANCH_NAME=$DEFAULT_BRANCH_NAME
                    echo ""
                break;;
                * ) echo ""
                break;;
            esac
        done
    else
        BRANCH_NAME=$DEFAULT_BRANCH_NAME
    fi
}

fetch_SHA1() {
    echo "$BRANCH_NAME ブランチの最新のコミットSHA1を検索しています...\n"
    BRANCH_SHA1=$(git ls-remote $(git config --get remote.origin.url) $BRANCH_NAME | awk '{ print $1 }')
    
    # リモートリポジトリ存在チェック
    if [ -z $BRANCH_SHA1 ]; then
        echo "リモートブランチが存在しないため最新のコミットSHA1が取得できません。" 1>&2
        exit 0
    fi
}

check_ecr_build_artifacts () {
    echo "$BRANCH_SHA1 のタグのイメージを検索しています...\n"
    
    APP_IMAGE=$(aws ecr list-images --repository-name rem-api --query "imageIds[*].imageTag")
    
    if echo $APP_IMAGE | jq .[] | xargs echo | grep -q $BRANCH_SHA1; then
        echo "$BRANCH_SHA1 のタグのrem-apiのイメージが見つかりました\n"
    else
        echo "$BRANCH_SHA1 のタグのrem-apiのイメージが見つかりませんでした"
        exit 0
    fi
}

get_commmit_message () {
    if [ ${#BRANCH_SHA1} -gt 0 ]; then
        echo "git fetch しています...\n"
        $(git fetch origin $BRANCH_NAME &> /dev/null)
        COMMIT_MESSAGE=$(git log --format=%B -n 1 $BRANCH_SHA1 2>/dev/null | awk 'NR==1')
    fi
    COMMIT_MESSAGE=${COMMIT_MESSAGE:-"[取得出来ませんでした。]"}
}

select_release_file() {
    while true; do
        read -p "> リリースする対象ファイル名を入力してください。(.jsonはつけなくていいです) : " file_name
        case $file_name in
            "" ) continue;;
            *) break;;
        esac
    done
    
    file_name_ext="$file_name.json"
    
    ls -l docker/batch/commands/$file_name_ext 2>&1 > /dev/null
    
    release_file_name=$file_name_ext
}

pick_params_from_json() {
    task_name=$(cat docker/batch/commands/$release_file_name | jq -r '.name')
    cron=$(cat docker/batch/commands/$release_file_name | jq -r '.cron')
    description=$(cat docker/batch/commands/$release_file_name | jq -r '.description')
    command=$(cat docker/batch/commands/$release_file_name | jq -r '.command')
}

confirm_release() {
    echo "========================================"
    echo "> 環境               : $ENV_NAME_JP" 1>&2
    echo "> ブランチ名         : $BRANCH_NAME" 1>&2
    echo "> コミットSHA1       : $BRANCH_SHA1" 1>&2
    echo "> コミットメッセージ : $COMMIT_MESSAGE" 1>&2
    echo "> タスク名           : $task_name" 1>&2
    echo "> cron情報           : $cron" 1>&2
    echo "> 説明               : $description" 1>&2
    echo "> 実行コマンド       : $command" 1>&2
    echo "========================================"
    
    while true; do
        read -p "> 以上でスケジュールタスクを作成してもよろしいですか? (y/n) [n] : " yn
        case $yn in
            [Yy] ) break;;
            [Nn] ) echo "終了します。\n"
            exit 0;;
            "" ) echo "終了します。\n"
            exit 0;;
            * ) echo "(y/n) で入力してください。\n";;
        esac
    done
}

# タスク定義の作成
create_task_definision() {
    export COMMAND=$command
    export SHA1=$BRANCH_SHA1
    export LOG_GROUP="/ecs/rem-batch-${ENV_ARG}"
    
    task_definition_name="rem-batch-$ENV_ARG-${task_name}"
    
    ecs-cli configure \
    --cluster rem-${ENV_ARG} \
    --region ap-northeast-1 \
    --default-launch-type FARGATE
    
    ecs-cli compose \
    --project-name ${task_definition_name} \
    --file docker/docker-compose.${ENV_ARG}.yml \
    --ecs-params docker/ecs-params.${ENV_ARG}.yml \
    create
    
    task_arn=$(aws ecs describe-task-definition --task-definition $task_definition_name --query 'taskDefinition.taskDefinitionArn' --output text)
    echo "\nタスク定義を作成しました。タスク定義ARN: $task_arn\n"
}

# CloudWatchのルール作成
create_cloudwatch_rule() {
    rule_arn=$(aws events put-rule --schedule-expression "$cron" --name $task_definition_name --description "$description" --query 'RuleArn' --output text)
    echo "CloudWatchのルールを作成しました。ルールARN: $rule_arn\n"
}

# タスク定義とルールの紐付け
associate() {
    cluster_arn="arn:aws:ecs:ap-northeast-1:*************:cluster/rem-${ENV_ARG}"
    
    json=$(cat "./docker/batch/env/${ENV_ARG}.json" | jq '.[0].Id = "'$task_name'" | .[0].Arn = "'$cluster_arn'" | .[0].EcsParameters.TaskDefinitionArn = "'$task_arn'"')
    
    aws events put-targets --rule ${task_definition_name} --targets "$json"
    
    echo "\n$task_definition_name をrem-${ENV_ARG} クラスターのスケジュールタスクに登録しました。"
}

check_args
select_branch
fetch_SHA1
check_ecr_build_artifacts
get_commmit_message
select_release_file
pick_params_from_json
confirm_release
create_task_definision
create_cloudwatch_rule
associate