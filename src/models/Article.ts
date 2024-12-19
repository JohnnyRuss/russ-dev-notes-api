import {
  ArticleT,
  ArticleModelT,
  ArticleMethodsT,
} from "../types/models/article.types";
import { Schema, model } from "mongoose";
import { transliterate } from "transliteration";
import slugify from "slugify";

const ArticleSchema = new Schema<ArticleT, ArticleModelT, ArticleMethodsT>(
  {
    slug: {
      type: String,
      unique: true,
    },

    title: {
      type: String,
      required: true,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    topic: {
      type: Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
    },

    body: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

ArticleSchema.pre("save", async function (next) {
  if (!this.isModified("title")) return next();

  const Model = this.constructor as typeof Article;

  const transliteratedTitle = transliterate(this.title);

  const title = transliteratedTitle.replace(/[^a-zA-Z0-9\s-]/g, "");
  const slug = slugify(title, { lower: true, locale: "en", trim: true });
  let newSlug = slug;

  let slugExists = await Model.findOne({ slug: newSlug });

  if (slugExists) {
    let uniqueSuffix = 1;

    while (slugExists) {
      newSlug = `${slug}-${uniqueSuffix}`;
      slugExists = await Model.findOne({ slug: newSlug });
      uniqueSuffix++;
    }
  }

  this.slug = newSlug;

  next();
});

const Article = model<ArticleT, ArticleModelT>("Article", ArticleSchema);

export default Article;
