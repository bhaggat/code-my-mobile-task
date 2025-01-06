import { Op } from "sequelize";
import Field from "../models/Field.js";

export const createField = async (req, res, next) => {
  try {
    const existingField = await Field.findOne({
      where: {
        userId: req.userId,
        name: req.body.name,
      },
    });
    if (existingField) {
      return res.status(409).json({
        success: false,
        message: "Field already exists, with same name!",
      });
    }

    const field = await Field.create({ ...req.body, userId: req.userId });
    res.status(201).json({ success: true, data: field });
  } catch (err) {
    console.error("Error creating field:", err);
    next(err);
  }
};

export const getFields = async (req, res, next) => {
  try {
    const { search = "", page = 1, limit = 10 } = req.query;

    const pageNumber = Number(page);
    const pageSize = Number(limit);

    const query = {
      userId: req.userId,
      ...(search ? { name: { [Op.like]: `%${search}%` } } : {}),
    };

    const fields = await Field.findAndCountAll({
      where: query,
      order: [["createdAt", "DESC"]],
      limit: pageSize,
      offset: (pageNumber - 1) * pageSize,
    });

    res.status(200).json({
      success: true,
      data: fields.rows,
      pagination: {
        total: fields.count,
        page: pageNumber,
        limit: pageSize,
      },
    });
  } catch (err) {
    console.error("Error fetching fields:", err);
    next(err);
  }
};

export const getFieldOptions = async (req, res, next) => {
  try {
    const query = {
      userId: req.userId,
      isEnabled: true,
    };

    const fields = await Field.findAll({
      where: query,
      attributes: ["id", "name", "fieldType"],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: fields,
    });
  } catch (err) {
    console.error("Error fetching fields:", err);
    next(err);
  }
};

export const getField = async (req, res, next) => {
  try {
    const field = await Field.findByPk(req.params.id, {
      where: { userId: req.userId },
    });
    if (!field) {
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });
    }
    res.status(200).json({ success: true, data: field });
  } catch (err) {
    console.error("Error fetching field:", err);
    next(err);
  }
};

export const updateField = async (req, res, next) => {
  try {
    const field = await Field.findByPk(req.params.id, {
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
    console.error("Error updating field:", err);
    next(err);
  }
};

export const deleteField = async (req, res, next) => {
  try {
    const field = await Field.findByPk(req.params.id, {
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
    console.error("Error deleting field:", err);
    next(err);
  }
};
