import { Router as ExpressRouter } from "express";
import { checkAuth } from "../middlewares";
import * as categoryController from "../controllers/category.controller";

const Router = ExpressRouter();

Router.route("/").get(categoryController.getCategories);

Router.route("/topics").get(categoryController.getTopics);

export default Router;
