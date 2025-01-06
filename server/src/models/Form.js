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
    published: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    fields: {
      type: DataTypes.ARRAY(DataTypes.STRING),
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
    publicId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
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
