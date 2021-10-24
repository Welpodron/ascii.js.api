const methods = [
  {
    value: 'luminance',
    algorithm: (r, g, b) => 0.21 * r + 0.72 * g + 0.07 * b
  },
  {
    value: 'average',
    algorithm: (r, g, b) => (r + g + b) / 3
  },
  {
    value: 'max',
    algorithm: (r, g, b) => Math.max(r, g, b)
  },
  {
    value: 'min',
    algorithm: (r, g, b) => Math.min(r, g, b)
  }
];

const checkMethod = (method) => {
  return methods.find((obj) => obj.value === method)
    ? {
        status: 'OK'
      }
    : {
        status: 'ERROR',
        error: `Полученный метод: ${method} не соответствует допустимым: ${methods
          .map((obj) => obj.value)
          .join(', ')}`
      };
};

const getFilter = (method = 'luminance', r, g, b) => {
  for (let i = 0; i < methods.length; i++) {
    if (methods[i].value === method) {
      return methods[i].algorithm(r, g, b);
    }
  }

  return 0.21 * r + 0.72 * g + 0.07 * b;
};

module.exports = {
  methods,
  checkMethod,
  getFilter
};
