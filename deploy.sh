#!/usr/din/env sh

# остановить публикацию при ошибках
set -e

# сборка приложения
npm run build

# переход в каталог сборки
cd dist

# инициализация репозитория и загруска кода в GitHub
git init
git add .
git commit -m "deploy"

git push -f git@github.com:Anton-Protopopov/vue-app.git master:gh-pages

cd -