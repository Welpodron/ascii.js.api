const imgUtils = require('./imgUtils');

const maxAlphaValue = 255;
const maxRGBValue = 255;
const minAlphaValue = 0;
const minRGBValue = 0;

const minCell = 1;
const maxCell = imgUtils.maxWidthValue || imgUtils.maxHeightValue;

const supportedGets = ['text', 'file'];

const checkAlpha = (alpha) => {
  const value = parseInt(alpha, 10);

  if (!isNaN(value)) {
    if (value < minAlphaValue) {
      return {
        status: 'ERROR',
        error: `Полученная альфа: ${value} меньше допустимой: ${minAlphaValue}`
      };
    }

    if (value > maxAlphaValue) {
      return {
        status: 'ERROR',
        error: `Полученная альфа: ${value} больше допустимой: ${maxAlphaValue}`
      };
    }

    return { status: 'OK' };
  } else {
    return {
      status: 'ERROR',
      error: `Полученная альфа: ${alpha} не является числом`
    };
  }
};

const checkRGB = (rgb) => {
  const value = parseInt(rgb, 10);

  if (!isNaN(value)) {
    if (value < minRGBValue) {
      return {
        status: 'ERROR',
        error: `Полученное значение rgb: ${value} меньше допустимого: ${minRGBValue}`
      };
    }

    if (value > maxRGBValue) {
      return {
        status: 'ERROR',
        error: `Полученное значение rgb: ${value} больше допустимого: ${maxRGBValue}`
      };
    }

    return { status: 'OK' };
  } else {
    return {
      status: 'ERROR',
      error: `Полученное значение rgb: ${rgb} не является числом`
    };
  }
};

const checkCell = (cell) => {
  const value = parseInt(cell, 10);

  if (!isNaN(value)) {
    if (value < minCell) {
      return {
        status: 'ERROR',
        error: `Полученный размер ячейки: ${value} меньше допустимого: ${minCell}`
      };
    }

    if (value > maxCell) {
      return {
        status: 'ERROR',
        error: `Полученный размер ячейки: ${value} больше допустимого: ${maxCell}`
      };
    }

    return { status: 'OK' };
  } else {
    return {
      status: 'ERROR',
      error: `Полученный размер ячейки: ${cell} не является числом`
    };
  }
};

module.exports = {
  maxAlphaValue,
  maxRGBValue,
  minAlphaValue,
  minRGBValue,
  minCell,
  maxCell,
  supportedGets,
  checkCell,
  checkAlpha,
  checkRGB
};
