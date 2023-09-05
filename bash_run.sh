# npx sequelize db:migrate:undo:all --env production

# npm i
npm run migrate
npx sequelize-cli db:seed:all
nodemon main.js