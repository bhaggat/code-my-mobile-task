const restrictedFields = ["id", "createdAt", "updatedAt", "publicId"];
export const restrictUpdateFields = (req, res, next) => {
  if (req.body) {
    restrictedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        delete req.body[field];
      }
    });
  }
  next();
};
