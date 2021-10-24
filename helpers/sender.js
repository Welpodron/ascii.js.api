const sendError = (res, error) =>
  res.status(400).json({ status: 'ERROR', error });

const sendText = (res, result) =>
  res.status(200).json({ status: 'OK', result });

const sendTXT = (
  res,
  result,
  fileName = 'ASCII.API.RESULT',
  fileType = '.txt'
) =>
  res
    .status(200)
    .set({
      'Content-Disposition': `attachment; filename="${fileName}${fileType}"`
    })
    .send(result);

module.exports = {
  sendError,
  sendText,
  sendTXT
};
