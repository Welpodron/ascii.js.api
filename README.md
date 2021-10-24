# ASCII.JS.API

### Содержание:

- [Используемые зависимости](#RESOURCES_MAIN)
- [Развертывание проекта](#APPLICATION_BUILD)

### <a name="RESOURCES_MAIN">Используемые зависимости</a>

- Ядро приложения
  - [Express](https://expressjs.com/)
- Обработчик http(s) запросов
  - [Axios](https://axios-http.com/)
- Обработчик типов файлов
  - [File-type](https://github.com/sindresorhus/file-type)
- Обработчик изображений
  - [Jimp](https://github.com/oliver-moran/jimp)
- Обработчик содержимого входящих запросов
  - [Multer](https://github.com/expressjs/multer)

### <a name="APPLICATION_BUILD">Развертывание проекта</a>

- `npm start`

  Запускает сервер(приложение)\
  Приложение доступно по локальному адресу [http://localhost](http://localhost) с указаным ему портом (8080 если иное не указано)

- `npm run devStart`

  Запускает сервер(приложение) в режиме разработки с использованием `nodemon`

> @welpodron 2021
