import { model } from "mongoose";
import { createError } from "../../../utils/errorUtils";

export default function (name, schema) {
  const Model = model(name, schema);

  return {
    Model,
    find(filter) {
      return handleErrors(() => Model.find(filter));
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
    throw createError({ validator: "Mongoose", status: 500, ...e });
  }
}
