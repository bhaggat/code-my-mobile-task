import FormSubmit from "../models/FormSubmit.js";

export const getFormSubmits = async (req, res, next) => {
  try {
    const formSubmits = await FormSubmit.findAll({
      where: { userId: req.userId },
    });
    res.status(200).json({ success: true, data: formSubmits });
  } catch (err) {
    next(err);
  }
};

export const getFormSubmit = async (req, res, next) => {
  try {
    const formSubmit = await FormSubmit.findById(req.params.id, {
      where: { userId: req.userId },
    });
    if (!formSubmit) {
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });
    }
    res.status(200).json({ success: true, data: formSubmit });
  } catch (err) {
    next(err);
  }
};

export const createFormSubmit = async (req, res, next) => {
  try {
    const formSubmit = await FormSubmit.create({
      ...req.body,
      userId: req.userId,
    });
    res.status(201).json({ success: true, data: formSubmit });
  } catch (err) {
    next(err);
  }
};
