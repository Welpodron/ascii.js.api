const filterUtils = require('./filterUtils');

const getBrailleSymbol = (dots) => {
  let number = 0;
  let result = 0;

  const octets = [1, 10, 2, 20, 4, 40, 100, 200];

  dots.forEach((index, i) => {
    number += index * octets[i];
  });

  if (number === 0) {
    return String.fromCharCode(`0x2800`);
  }

  number = number.toString(10);

  for (let i = 0; i < number.length; i++) {
    result += number[i] * 8 ** (number.length - 1 - i);
  }

  return String.fromCharCode(0x2800 + parseInt(result.toString(16), 16));
};

const getBraille = (params) => {
  try {
    const { pixels, width, height, method, minAlpha, minRGB } = params;

    let result = '';

    for (let y = 0; y < height; y += 4) {
      for (let x = 0; x < width; x += 2) {
        let index = 0;
        const dots = [0, 0, 0, 0, 0, 0, 0, 0];
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 2; j++) {
            const pos = ((y + i) * width + x + j) * 4;

            const a = pixels[pos + 3];

            if (a >= minAlpha) {
              const r = pixels[pos];
              const g = pixels[pos + 1];
              const b = pixels[pos + 2];

              const filtered = filterUtils.getFilter(method, r, g, b);

              if (filtered >= minRGB) {
                dots[index] = 1;
              }
            }

            index++;
          }
        }

        result += getBrailleSymbol(dots);
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
  getBraille
};
