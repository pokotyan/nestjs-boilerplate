#! /bin/sh
set -eu

# $1 : stg or prod
ENV_ARG=$1

# 引数チェック
if [ $# -ne 1 ]; then
    echo "指定された引数は $# 個です。" 1>&2
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

echo "$BRANCH_NAME ブランチの最新のコミットSHA1を検索しています...\n"
BRANCH_SHA1=$(git ls-remote $(git config --get remote.origin.url) $BRANCH_NAME | awk '{ print $1 }')

# リモートリポジトリ存在チェック
if [ -z $BRANCH_SHA1 ]; then
    echo "リモートブランチが存在しないため最新のコミットSHA1が取得できません。" 1>&2
    exit 0
fi

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

check_ecr_build_artifacts
get_commmit_message

while true; do
    echo "> ブランチ名         : $BRANCH_NAME" 1>&2
    echo "> コミットSHA1       : $BRANCH_SHA1" 1>&2
    echo "> コミットメッセージ : $COMMIT_MESSAGE" 1>&2
    echo "> クラスター         : rem-${ENV_ARG}" 1>&2
    echo "> サービス           : rem-${ENV_ARG}" 1>&2
    read -p '以上でデプロイを実行してもよろしいでしょうか？ (y/n) [n] : ' yn
    case $yn in
        [Yy] ) echo ""
        break;;
        [Nn] ) exit 0;;
        "" ) exit 1;;
        * ) echo "(y/n) で入力してください。\n";;
    esac
done

export SHA1=$BRANCH_SHA1
export LOG_GROUP="/ecs/rem-api-${ENV_ARG}"
export COMMAND="node dist/src/main"

# configure
ecs-cli configure \
--cluster rem-${ENV_ARG} \
--region ap-northeast-1 \
--default-launch-type FARGATE

# service up
ecs-cli compose \
--project-name rem-${ENV_ARG} \
--file docker/docker-compose.${ENV_ARG}.yml \
--ecs-params docker/ecs-params.${ENV_ARG}.yml \
service up \
--vpc vpc-40e21225 \
--private-dns-namespace air-closet.ecs \
--sd-container-name rem-${ENV_ARG}
# --enable-service-discovery
