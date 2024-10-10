import { model, Schema } from "mongoose";
import { createError } from "../../../utils/errorUtils.js";

export default function (name, schema) {
  const Model = model(name, new Schema(schema));

  return {
    Model,
    count() {
      return handleErrors(() => Model.countDocuments().lean());
    },
    find(filter) {
      return handleErrors(() => Model.find(filter).lean());
    },
    findOne(filter) {
      return handleErrors(() => Model.findOne(filter).lean());
    },
    findById(id) {
      return handleErrors(() => Model.findById(id).lean());
    },
    add(data) {
      return handleErrors(() => new Model(data).save().then(model => model.toObject()));
    },
    edit(id, data) {
      return handleErrors(() => Model.findByIdAndUpdate(id, data, { new: true }).lean());
    },
    remove(id) {
      return handleErrors(() => Model.findByIdAndDelete(id).lean());
    },
  }
}

export async function handleErrors(cb) {
  try {
    return await cb();
  } catch (e) {
    throw createError({ validator: "Mongoose", status: 400, message: e.message });
  }
}
