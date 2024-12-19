import { Router as ExpressRouter } from "express";
import { checkAuth } from "../middlewares";
import * as articleController from "../controllers/article.controller";

const Router = ExpressRouter();

Router.route("/")
  .post(checkAuth, articleController.createArticle)
  .get(articleController.getAllArticles);

Router.route("/related/:slug").get(articleController.getRelatedArticles);

Router.route("/tree").get(articleController.getTree);

Router.route("/:slug")
  .put(checkAuth, articleController.updateArticle)
  .delete(checkAuth, articleController.deleteArticle)
  .get(articleController.getArticle);

export default Router;
