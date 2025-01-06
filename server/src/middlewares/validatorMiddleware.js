export default function validatorMiddleware(validator) {
  return async function (req, res, next) {
    try {
      const { error, value } = validator.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        const errors = error.details.map((detail) => ({
          message: detail.message,
          field: detail.context.key,
        }));
        return res.status(422).json({ success: false, errors });
      }
      req.body = value;
      next();
    } catch (err) {
      next(err);
    }
  };
}
