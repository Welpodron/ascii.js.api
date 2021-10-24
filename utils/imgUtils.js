const Jimp = require('jimp');

const maxWidthValue = 2000;
const maxHeightValue = 2000;
const minWidthValue = 1;
const minHeightValue = 1;

const checkWidth = (width) => {
  const value = parseInt(width, 10);

  if (!isNaN(value)) {
    if (value < minWidthValue) {
      return {
        status: 'ERROR',
        error: `Полученная ширина: ${value} меньше допустимой: ${minWidthValue}`
      };
    }

    if (value > maxWidthValue) {
      return {
        status: 'ERROR',
        error: `Полученная ширина: ${value} больше допустимой: ${maxWidthValue}`
      };
    }

    return { status: 'OK' };
  } else {
    return {
      status: 'ERROR',
      error: `Полученная ширина: ${width} не является числом`
    };
  }
};

const checkHeight = (height) => {
  const value = parseInt(height, 10);

  if (!isNaN(value)) {
    if (value < minHeightValue) {
      return {
        status: 'ERROR',
        error: `Полученная высота: ${value} меньше допустимой: ${minHeightValue}`
      };
    }

    if (value > maxHeightValue) {
      return {
        status: 'ERROR',
        error: `Полученная высота: ${value} больше допустимой: ${maxHeightValue}`
      };
    }

    return { status: 'OK' };
  } else {
    return {
      status: 'ERROR',
      error: `Полученная высота: ${height} не является числом`
    };
  }
};

const getImg = (buffer, width, height) => {
  return new Promise((resolve, reject) => {
    if (!buffer) {
      reject({
        status: 'ERROR',
        error: 'Отсутствует буфер изображения'
      });
    }

    Jimp.read(buffer)
      .then((img) => {
        let currentWidth = img.bitmap.width;
        let widthStatus = checkWidth(currentWidth);

        if (widthStatus.status !== 'OK') {
          reject(widthStatus);
        }

        let currentHeight = img.bitmap.height;
        let heightStatus = checkHeight(currentHeight);

        if (heightStatus.status !== 'OK') {
          reject(heightStatus);
        }

        let newWidth = null;
        let newHeight = null;

        if (width && checkWidth(width).status === 'OK') {
          newWidth = width;
        }

        if (height && checkHeight(height).status === 'OK') {
          newHeight = height;
        }

        let currentData = img.bitmap.data;

        if (newWidth || newHeight) {
          const resized = img.resize(
            newWidth ?? currentWidth,
            newHeight ?? currentHeight
          );

          currentWidth = resized.bitmap.width;
          currentHeight = resized.bitmap.height;
          currentData = resized.bitmap.data;
        }

        resolve({
          status: 'OK',
          result: {
            width: currentWidth,
            height: currentHeight,
            pixels: currentData
          }
        });
      })
      .catch((_) => {
        reject({
          status: 'ERROR',
          error: 'Произошла ошибка при чтении буфера изображения'
        });
      });
  });
};

module.exports = {
  maxWidthValue,
  maxHeightValue,
  minWidthValue,
  minHeightValue,
  checkWidth,
  checkHeight,
  getImg
};
