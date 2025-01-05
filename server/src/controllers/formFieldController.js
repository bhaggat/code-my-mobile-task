import FormField from "../models/FormField.js";

export const updateForm = async (req, res, next) => {
  try {
    const formField = await FormField.findById(req.params.id, {
      where: { userId: req.userId },
    });
    if (!formField) {
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });
    }
    await formField.update(req.body);
    res.status(200).json({ success: true, data: formField });
  } catch (err) {
    next(err);
  }
};
