import { Schema } from "mongoose";
import model from "./model.js";

const schema = new Schema({

});

export const { Model, find, findById, add, edit, remove } = model("user", schema);
