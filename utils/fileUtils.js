const axios = require('axios').default;
const fileType = require('file-type');

const urlExpression = new RegExp(
  /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi
);

/*
  - https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url/22648406#22648406
*/

const maxSize = 4194304; // 4MB
const supportedMimes = ['image/jpeg', 'image/jpg', 'image/png'];

const fileFilter = (_, file, cb) => {
  const { fieldname, mimetype } = file;

  if (fieldname === 'file') {
    if (supportedMimes.includes(mimetype)) {
      isFile = true;
      cb(null, true);
    } else {
      cb(null, false);
    }
  } else {
    cb(null, false);
  }
};

const getFile = (file, url) => {
  return new Promise((resolve, reject) => {
    if (!file && !url) {
      reject({
        status: 'ERROR',
        error:
          'Ни один из необходимых для работы конвертера параметров: file или url не был предоставлен'
      });
    }

    if (file) {
      resolve({
        status: 'OK',
        result: file.buffer
      });
    }

    if (url) {
      const link = url.match(urlExpression);

      if (link.length) {
        axios({
          url: link[0],
          maxContentLength: maxSize,
          responseType: 'arraybuffer'
        })
          .then((response) => {
            const buffer = Buffer.from(response.data, 'binary');

            fileType
              .fromBuffer(buffer)
              .then((obj) => {
                if (supportedMimes.includes(obj.mime)) {
                  resolve({
                    status: 'OK',
                    result: buffer
                  });
                } else {
                  reject({
                    status: 'ERROR',
                    error: `Полученный тип файла: ${
                      obj.ext
                    } не соответствует допустимым: ${supportedMimes
                      .join(', ')
                      .replace(/image\//gm, '.')}`
                  });
                }
              })
              .catch((_) => {
                reject({
                  status: 'ERROR',
                  error: 'Произошла ошибка при чтении типа файла'
                });
              });
          })
          .catch((_) => {
            reject({
              status: 'ERROR',
              error: 'Произошла ошибка при получении файла'
            });
          });
      } else {
        reject({
          status: 'ERROR',
          error: `Полученный url: ${url} не является корректны или в настоящий момент недоступен`
        });
      }
    }
  });
};

module.exports = {
  maxSize,
  supportedMimes,
  fileFilter,
  getFile
};
