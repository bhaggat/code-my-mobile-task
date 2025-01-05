import Form from "../models/Form.js";

export const createForm = async (req, res, next) => {
  try {
    const form = await Form.create({ ...req.body, userId: req.userId });
    res.status(201).json({ success: true, data: form });
  } catch (err) {
    next(err);
  }
};

export const getForms = async (req, res, next) => {
  try {
    const forms = await Form.findAll({ where: { userId: req.userId } });
    res.status(200).json({ success: true, data: forms });
  } catch (err) {
    next(err);
  }
};

export const getForm = async (req, res, next) => {
  try {
    const form = await Form.findById(req.params.id, {
      where: { userId: req.userId },
    });
    if (!form) {
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });
    }
    res.status(200).json({ success: true, data: form });
  } catch (err) {
    next(err);
  }
};

export const updateForm = async (req, res, next) => {
  try {
    const form = await Form.findById(req.params.id, {
      where: { userId: req.userId },
    });
    if (!form) {
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });
    }
    await form.update(req.body);
    res.status(200).json({ success: true, data: form });
  } catch (err) {
    next(err);
  }
};

export const deleteForm = async (req, res, next) => {
  try {
    const form = await Form.findById(req.params.id, {
      where: { userId: req.userId },
    });
    if (!form) {
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });
    }
    await form.destroy();
    res
      .status(200)
      .json({ success: true, message: "Form deleted successfully" });
  } catch (err) {
    next(err);
  }
};
