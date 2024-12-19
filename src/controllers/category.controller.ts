import { Async } from "../lib";
import { Category, Topic } from "../models";

export const getCategories = Async(async (req, res, next) => {
  const categories = await Category.find();

  res.status(200).json(categories);
});

export const getTopics = Async(async (req, res, next) => {
  const topics = await Topic.find();

  res.status(200).json(topics);
});

const categories = [
  {
    _id: "",
    title: "",
    query: "",
  },
];

const topics = [
  {
    title: "",
    query: "",
    category: "",
  },
];

async function createDefaults() {
  try {
    await Promise.all(
      topics.map(async (category) => {
        await Topic.create(category);
      })
    );
  } catch (error) {
    console.log(error);
  }
}

// createDefaults();
