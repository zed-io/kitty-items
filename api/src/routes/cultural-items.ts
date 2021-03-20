import express, { Request, Response, Router } from "express";
import { CulturalItemsService } from "../services/cultural-items";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate-request";

function initCulturalItemsRouter(
  culturalItemsService: CulturalItemsService
): Router {
  const router = express.Router();

  router.post(
    "/cultural-items/mint",
    [
      body("recipient").exists(),
      body("typeId").isInt(),
      body("name").isString(),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
      const { recipient, typeId, name } = req.body;
      const tx = await culturalItemsService.mint(recipient, typeId, name);
      return res.send({
        transaction: tx,
      });
    }
  );

  router.post("/cultural-items/setup", async (req: Request, res: Response) => {
    const transaction = await culturalItemsService.setupAccount();
    return res.send({
      transaction,
    });
  });

  router.post(
    "/cultural-items/transfer",
    [body("recipient").exists(), body("itemId").isInt()],
    validateRequest,
    async (req: Request, res: Response) => {
      const { recipient, itemId } = req.body;
      const tx = await culturalItemsService.transfer(recipient, itemId);
      return res.send({
        transaction: tx,
      });
    }
  );

  router.get(
    "/cultural-items/collection/:account",
    async (req: Request, res: Response) => {
      const collection = await culturalItemsService.getCollectionIds(
        req.params.account
      );
      return res.send({
        collection,
      });
    }
  );

  router.get(
    "/cultural-items/item/:itemId",
    async (req: Request, res: Response) => {
      const item = await culturalItemsService.getCulturalItemType(
        parseInt(req.params.itemId)
      );
      return res.send({
        item,
      });
    }
  );

  router.get("/cultural-items/supply", async (req: Request, res: Response) => {
    const supply = await culturalItemsService.getSupply();
    return res.send({
      supply,
    });
  });

  return router;
}

export default initCulturalItemsRouter;
