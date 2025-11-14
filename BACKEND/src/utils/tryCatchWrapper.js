export const asyncHandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
      // error eventually goes to error handler global middleware and it handles and logs the error properly
    }
  };
};