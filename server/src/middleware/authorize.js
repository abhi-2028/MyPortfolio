export const authorizeOwner = (request, response, next) => {
  if (request.admin?.role !== 'owner') {
    const error = new Error('Forbidden.');
    error.statusCode = 403;
    next(error);
    return;
  }
  next();
};
