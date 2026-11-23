export const errorHandler = (error, request, response, next) => {
  void next;

  let statusCode = error.statusCode || error.status || 500;
  if (error.code === 'LIMIT_FILE_SIZE') statusCode = 413;
  if (error.name === 'ValidationError') statusCode = 422;
  if (error.name === 'CastError') statusCode = 400;
  const message =
    statusCode >= 500 && process.env.NODE_ENV === 'production'
      ? 'An unexpected server error occurred.'
      : error.message || 'An unexpected server error occurred.';

  if (statusCode >= 500) {
    console.error(error);
  }

  response.status(statusCode).json({
    success: false,
    message,
  });
};
