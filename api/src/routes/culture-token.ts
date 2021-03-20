import express, { Request, Response, Router } from "express";
import { CultureTokensService } from "../services/culture-tokens";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate-request";

function initCultureTokensRouter(
  cultureTokensService: CultureTokensService
): Router {
  const router = express.Router();

  router.post(
    "/culture-tokens/mint",
    [body("recipient").exists(), body("amount").isDecimal()],
    validateRequest,
    async (req: Request, res: Response) => {
      const { recipient, amount } = req.body;

      const transaction = await cultureTokensService.mint(recipient, amount);
      return res.send({
        transaction,
      });
    }
  );

  router.post("/culture-tokens/setup", async (req: Request, res: Response) => {
    const transaction = await cultureTokensService.setupAccount();
    return res.send({
      transaction,
    });
  });

  router.post(
    "/culture-tokens/burn",
    [
      body("amount").isInt({
        gt: 0,
      }),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
      const { amount } = req.body;
      const transaction = await cultureTokensService.burn(amount);
      return res.send({
        transaction,
      });
    }
  );

  router.post(
    "/culture-tokens/transfer",
    [
      body("recipient").exists(),
      body("amount").isInt({
        gt: 0,
      }),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
      const { recipient, amount } = req.body;
      const transaction = await cultureTokensService.transfer(
        recipient,
        amount
      );
      return res.send({
        transaction,
      });
    }
  );

  router.get(
    "/culture-tokens/balance/:account",
    async (req: Request, res: Response) => {
      const balance = await cultureTokensService.getBalance(req.params.account);
      return res.send({
        balance,
      });
    }
  );

  router.get("/culture-tokens/supply", async (req: Request, res: Response) => {
    const supply = await cultureTokensService.getSupply();
    return res.send({
      supply,
    });
  });

  return router;
}

export default initCultureTokensRouter;
