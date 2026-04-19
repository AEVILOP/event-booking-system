exports.success = (res, data = {}, message = "Success") => {
  return res.json({
    success: true,
    message,
    data,
  });
};

exports.error = (res, status, message) => {
  return res.status(status).json({
    success: false,
    error: message,
  });
};
