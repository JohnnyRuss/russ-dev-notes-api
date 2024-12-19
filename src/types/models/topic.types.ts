import { Types as MongooseTypes, Document, Model } from "mongoose";

type TopicT = Document & {
  title: string;
  query: string;
  thumbnail: string;
  category: MongooseTypes.ObjectId;
};

type TopicMethodsT = {};

type TopicModelT = Model<TopicT, {}, TopicMethodsT>;

export type { TopicT, TopicMethodsT, TopicModelT };
