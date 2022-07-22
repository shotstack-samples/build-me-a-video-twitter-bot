module.exports = (code, success, msg, data) => {
  return {
    statusCode: parseInt(code, 10),
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      success: !!success,
      message: msg,
      response: data,
    }),
  };
};
