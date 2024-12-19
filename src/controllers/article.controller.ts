import { AppError, Async, API_FeatureUtils } from "../lib";
import { Article } from "../models";

export const createArticle = Async(async (req, res, next) => {
  const { title, category, topic, body } = req.body;

  if (!body || !title || !category || !topic)
    return next(new AppError(400, "Invalid data"));

  const article = await new Article({ body, title, category, topic }).save();

  res.status(201).json({ article: article.slug });
});

export const updateArticle = Async(async (req, res, next) => {
  const { title, category, topic, body } = req.body;
  const { slug } = req.params;

  const article = await Article.findOneAndUpdate(
    { slug },
    { title, topic, body, category },
    { new: true }
  );

  if (!article) return next(new AppError(404, "Article does not exists"));

  res.status(201).json({ article: article.slug });
});

export const deleteArticle = Async(async (req, res, next) => {
  const { slug } = req.params;

  const article = await Article.findOneAndDelete({ slug });

  if (!article) return next(new AppError(404, "Article does not exists"));

  res.status(204).json("Article is deleted");
});

export const getArticle = Async(async (req, res, next) => {
  const { slug } = req.params;

  const article = await Article.findOne({ slug })
    .populate({ path: "category" })
    .populate({ path: "topic" });

  if (!article) return next(new AppError(404, "Article does not exists"));

  res.status(200).json(article);
});

export const getAllArticles = Async(async (req, res, next) => {
  const articles = await Article.find()
    .populate({ path: "category" })
    .populate({ path: "topic" });

  // const queryUtils = new API_FeatureUtils(
  //   req.query as { [key: string]: string }
  // );

  res.status(200).json(articles);
});

export const getRelatedArticles = Async(async (req, res, next) => {
  const { slug } = req.params;

  const article = await Article.findOne({ slug });

  res.status(200).json([]);
});

export const getTree = Async(async (req, res, next) => {
  const { category } = req.query;

  const tree = await Article.aggregate([
    { $project: { category: 1, title: 1, slug: 1, topic: 1 } },
    {
      $lookup: {
        as: "category",
        from: "categories",
        foreignField: "_id",
        localField: "category",
      },
    },
    { $unwind: "$category" },
    { $match: { "category.query": category } },
    {
      $lookup: {
        as: "topic",
        from: "topics",
        foreignField: "_id",
        localField: "topic",
      },
    },
    { $unwind: "$topic" },
    {
      $project: {
        _id: 1,
        title: 1,
        slug: 1,
        topic: "$topic.title",
        topicQuery: "$topic.query",
      },
    },
  ]);

  const selectionTree = tree.reduce((acc, item) => {
    const child = { title: item.title, slug: item.slug, key: item.slug };

    if (acc[item.topicQuery])
      acc[item.topicQuery].children = [...acc[item.topicQuery].children, child];
    else acc[item.topicQuery] = { title: item.topic, children: [child] };

    return acc;
  }, {});

  res.status(200).json(selectionTree);
});
