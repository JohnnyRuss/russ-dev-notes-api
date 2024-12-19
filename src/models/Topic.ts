import {
  TopicT,
  TopicModelT,
  TopicMethodsT,
} from "../types/models/topic.types";
import { Schema, model } from "mongoose";

const TopicSchema = new Schema<TopicT, TopicMethodsT, TopicMethodsT>({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  query: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    default: "",
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
});

const Topic = model<TopicT, TopicModelT>("Topic", TopicSchema);

export default Topic;
