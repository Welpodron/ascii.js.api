const express = require('express');
const multer = require('multer');
const sender = require('../../helpers/sender');
const fileUtils = require('../../utils/fileUtils');
const imgUtils = require('../../utils/imgUtils');
const checksUtils = require('../../utils/checksUtils');
const filterUtils = require('../../utils/filterUtils');
const asciiUtils = require('../../utils/asciiUtils');

const upload = multer({
  limits: { fileSize: fileUtils.maxSize },
  fileFilter: fileUtils.fileFilter
}).any();

const router = express.Router();

const handleRequest = (req, res) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return sender.sendError(
          res,
          `Полученный размер файла превышает допустимый: ${
            fileUtils.maxSize / 1024 / 1024
          } MB`
        );
      } else {
        return sender.sendError(res, 'Произошла ошибка при получении файла');
      }
    } else if (err) {
      return sender.sendError(res, 'Произошла ошибка при получении файла');
    }

    let file = null;

    if (req.files && req.files.length) {
      file = req.files[0];
    }

    const body = req.body || {};
    const query = req.query || {};

    let url = body.url ?? query.url;

    fileUtils
      .getFile(file, url)
      .then((resultObj) => {
        if (resultObj.status === 'OK') {
          const buffer = resultObj.result;

          let width = body.width ?? query.width;
          let height = body.height ?? query.height;

          imgUtils
            .getImg(buffer, width, height)
            .then((resultObj) => {
              if (resultObj.status === 'OK') {
                width = resultObj.result.width;
                height = resultObj.result.height;

                const pixels = resultObj.result.pixels;

                let minAlpha = body.minAlpha ?? query.minAlpha;
                let minRGB = body.minRGB ?? query.minRGB;
                let cell = body.cell ?? query.cell;
                let get = body.get ?? query.get;
                let method = body.method ?? query.method;
                let alphabet = body.alphabet ?? query.alphabet;

                if (checksUtils.checkAlpha(minAlpha).status !== 'OK') {
                  minAlpha = 1;
                } else {
                  minAlpha = parseInt(minAlpha, 10);
                }

                if (checksUtils.checkRGB(minRGB).status !== 'OK') {
                  minRGB = 1;
                } else {
                  minRGB = parseInt(minRGB, 10);
                }

                if (checksUtils.checkCell(cell).status !== 'OK') {
                  cell = 1;
                } else {
                  cell = parseInt(cell, 10);
                }

                if (!checksUtils.supportedGets.includes(get)) {
                  get = 'text';
                }

                if (filterUtils.checkMethod(method).status !== 'OK') {
                  method = filterUtils.methods[0].value;
                }

                if (!alphabet) {
                  alphabet =
                    '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,"^`\'. ';
                }

                const conversionObj = asciiUtils.getAscii({
                  pixels,
                  width,
                  height,
                  minAlpha,
                  minRGB,
                  cell,
                  method,
                  alphabet
                });

                if (conversionObj.status === 'OK') {
                  if (get === 'file') {
                    return sender.sendTXT(res, conversionObj.result);
                  } else {
                    return sender.sendText(res, conversionObj.result);
                  }
                } else {
                  return sender.sendError(res, conversionObj.error);
                }
              } else {
                return sender.sendError(res, 'Произошла непредвиденная ошибка');
              }
            })
            .catch((errObj) => {
              return sender.sendError(res, errObj.error);
            });
        } else {
          return sender.sendError(res, 'Произошла непредвиденная ошибка');
        }
      })
      .catch((errObj) => {
        return sender.sendError(res, errObj.error);
      });
  });
};

router.get('/', handleRequest);
router.post('/', handleRequest);

module.exports = router;
