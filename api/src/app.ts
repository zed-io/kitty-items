import "express-async-errors";
import express, { Request, Response } from "express";
import Knex from "knex";
import cors from "cors";
import { Model } from "objection";
import { json, urlencoded } from "body-parser";
import { CultureTokensService } from "./services/culture-tokens";
import { CulturalItemsService } from "./services/cultural-items";
import { MarketService } from "./services/market";
import initCultureTokenRouter from "./routes/culture-token";
import initCulturalItemsRouter from "./routes/cultural-items";
import initMarketRouter from "./routes/market";

const V1 = "/v1/";

// Init all routes, setup middlewares and dependencies
const initApp = (
  knex: Knex,
  cultureTokenService: CultureTokensService,
  culturalItemsService: CulturalItemsService,
  marketService: MarketService
) => {
  Model.knex(knex);
  const app = express();

  // @ts-ignore
  app.use(cors());
  app.use(json());
  app.use(urlencoded({ extended: false }));
  app.use(V1, initCultureTokenRouter(cultureTokenService));
  app.use(V1, initCulturalItemsRouter(culturalItemsService));
  app.use(V1, initMarketRouter(marketService));

  app.all("*", async (req: Request, res: Response) => {
    return res.sendStatus(404);
  });

  return app;
};

export default initApp;
