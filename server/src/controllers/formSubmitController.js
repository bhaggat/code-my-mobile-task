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
    const formSubmit = await FormSubmit.findByPk(req.params.id, {
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
    const formExists = await FormSubmit.findOne({
      where: {
        formId: req.body.formId,
        email: req.body.email,
      },
    });
    if (formExists) {
      return res.status(409).json({
        success: false,
        message: `This form already submitted by ${req.body.email}`,
      });
    }
    const formSubmit = await FormSubmit.create({
      ...req.body,
      userId: req.userId,
    });
    res.status(201).json({ success: true, data: formSubmit });
  } catch (err) {
    next(err);
  }
};
