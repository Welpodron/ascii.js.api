const filterUtils = require('./filterUtils');

const getSymbol = (
  alphabet = '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,"^`\'. ',
  filtered
) => {
  return alphabet[Math.ceil(((alphabet.length - 1) * filtered) / 255)];
};

const getAscii = (params) => {
  try {
    const { pixels, width, height, cell, alphabet, method, minAlpha, minRGB } =
      params;

    let result = '';

    for (let y = 0; y < height; y += cell) {
      for (let x = 0; x < width; x += cell) {
        const pos = (y * width + x) * 4;

        const a = pixels[pos + 3];

        if (a >= minAlpha) {
          const r = pixels[pos];
          const g = pixels[pos + 1];
          const b = pixels[pos + 2];

          if (r + g + b >= minRGB) {
            const symbol = getSymbol(
              alphabet,
              filterUtils.getFilter(method, r, g, b)
            );

            result += symbol;
          }
        }
      }

      result += '\n';
    }

    return {
      status: 'OK',
      result
    };
  } catch (_) {
    return {
      status: 'ERROR',
      error: 'Произошла ошибка при конвертации'
    };
  }
};

module.exports = {
  getAscii
};
