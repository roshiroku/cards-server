import { model, Schema } from "mongoose";
import { createError } from "../../../utils/errorUtils.js";

export default function (name, schema) {
  const Model = model(name, new Schema(schema));

  return {
    Model,
    count() {
      return handleErrors(() => Model.countDocuments());
    },
    find(filter) {
      return handleErrors(() => Model.find(filter));
    },
    findOne(filter) {
      return handleErrors(() => Model.findOne(filter));
    },
    findById(id) {
      return handleErrors(() => Model.findById(id));
    },
    add(data) {
      return handleErrors(() => new Model(data).save());
    },
    edit(id, data) {
      return handleErrors(() => Model.findByIdAndUpdate(id, data, { new: true }));
    },
    remove(id) {
      return handleErrors(() => Model.findByIdAndDelete(id));
    },
  }
}

export async function handleErrors(cb) {
  try {
    return await cb();
  } catch (e) {
    throw createError({ validator: "Mongoose", status: 500, message: e.message });
  }
}
