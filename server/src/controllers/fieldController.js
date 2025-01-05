import Field from "../models/Field.js";

export const createField = async (req, res, next) => {
  try {
    const field = await Field.create({ ...req.body, userId: req.userId });
    res.status(201).json({ success: true, data: field });
  } catch (err) {
    next(err);
  }
};

export const getFields = async (req, res, next) => {
  try {
    const fields = await Field.findAll({ where: { userId: req.userId } });
    res.status(200).json({ success: true, data: fields });
  } catch (err) {
    next(err);
  }
};

export const getField = async (req, res, next) => {
  try {
    const field = await Field.findById(req.params.id, {
      where: { userId: req.userId },
    });
    if (!field) {
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });
    }
    res.status(200).json({ success: true, data: field });
  } catch (err) {
    next(err);
  }
};

export const updateField = async (req, res, next) => {
  try {
    const field = await Field.findById(req.params.id, {
      where: { userId: req.userId },
    });
    if (!field) {
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });
    }
    await field.update(req.body);
    res.status(200).json({ success: true, data: field });
  } catch (err) {
    next(err);
  }
};

export const deleteField = async (req, res, next) => {
  try {
    const field = await Field.findById(req.params.id, {
      where: { userId: req.userId },
    });
    if (!field) {
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });
    }
    await field.destroy();
    res
      .status(200)
      .json({ success: true, message: "Field deleted successfully" });
  } catch (err) {
    next(err);
  }
};
