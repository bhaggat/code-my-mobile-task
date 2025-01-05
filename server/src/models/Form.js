import { DataTypes } from "sequelize";
import { sequelize } from "../dbs/postgresDb.js";
import User from "./User.js";

const Form = sequelize.define(
  "Form",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    isEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    buttons: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    meta: {
      type: DataTypes.JSONB,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    indexes: [
      {
        name: "unique_title_userId_index",
        unique: true,
        fields: ["title", "userId"],
      },
    ],
  }
);

User.hasMany(Form, { foreignKey: "userId", as: "forms" });
Form.belongsTo(User, { foreignKey: "userId", as: "user" });

export default Form;
