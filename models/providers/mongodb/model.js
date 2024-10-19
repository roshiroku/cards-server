import { model, Schema } from "mongoose";
import { createError } from "../../../utils/errorUtils.js";

export default function (name, schema) {
  const Model = model(name, new Schema(schema));

  function normalizeResult(result) {
    if (!result) return result;

    const normalized = {};
    const keys = result.toObject();
    const values = result.toObject({ getters: true });

    normalized._id = values._id;
    Object.keys(schema).forEach(key => normalized[key] = values[key]);
    Object.keys(keys).forEach(key => normalized[key] ??= values[key]);

    return normalized;
  }

  return {
    Model,
    count() {
      return handleErrors(() => Model.countDocuments());
    },
    find(filter) {
      return handleErrors(() => Model.find(filter).then((results) => results.map(normalizeResult)));
    },
    findOne(filter) {
      return handleErrors(() => Model.findOne(filter).then(normalizeResult));
    },
    findById(id) {
      return handleErrors(() => Model.findById(id).then(normalizeResult));
    },
    add(data) {
      return handleErrors(() => new Model(data).save().then(normalizeResult));
    },
    edit(id, data) {
      return handleErrors(() => Model.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
        setDefaultsOnInsert: true
      }).then(normalizeResult));
    },
    remove(id) {
      return handleErrors(() => Model.findByIdAndDelete(id).then(normalizeResult));
    }
  };
}

export async function handleErrors(cb) {
  try {
    return await cb();
  } catch (e) {
    throw createError({ validator: "Mongoose", status: 400, message: e.message });
  }
}
