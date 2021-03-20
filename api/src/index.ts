import * as fcl from "@onflow/fcl";
import initApp from "./app";
import Knex from "knex";

import { getConfig } from "./config";
import { CultureTokensService } from "./services/culture-tokens";
import { FlowService } from "./services/flow";
import { CulturalItemsService } from "./services/cultural-items";
import { MarketService } from "./services/market";
import { BlockCursorService } from "./services/block-cursor";
import { SaleOfferHandler } from "./workers/sale-offer-handler";

let knexInstance: Knex;

async function run() {
  const config = getConfig();

  knexInstance = Knex({
    client: "postgresql",
    connection: config.databaseUrl,
    migrations: {
      directory: config.databaseMigrationPath,
    },
  });

  // Make sure to disconnect from DB when exiting the process
  process.on("SIGTERM", () => {
    knexInstance.destroy().then(() => {
      process.exit(0);
    });
  });

  // Run all database migrations
  await knexInstance.migrate.latest();

  // Make sure we're pointing to the correct Flow Access API.
  fcl.config().put("accessNode.api", config.accessApi);

  const flowService = new FlowService(
    config.minterAddress,
    config.minterPrivateKeyHex,
    config.minterAccountKeyIndex
  );

  const cultureTokenService = new CultureTokensService(
    flowService,
    config.fungibleTokenAddress,
    config.minterAddress
  );

  const culturalItemsService = new CulturalItemsService(
    flowService,
    config.nonFungibleTokenAddress,
    config.minterAddress
  );

  const marketService = new MarketService(
    flowService,
    config.fungibleTokenAddress,
    config.minterAddress,
    config.nonFungibleTokenAddress,
    config.minterAddress,
    config.minterAddress
  );

  const eventSaleOfferCreated = `A.${fcl.sansPrefix(
    config.minterAddress
  )}.CulturalItemsMarket.SaleOfferCreated`;

  const blockCursorService = new BlockCursorService();

  const saleOfferWorker = new SaleOfferHandler(
    blockCursorService,
    flowService,
    marketService,
    eventSaleOfferCreated
  );

  const app = initApp(
    knexInstance,
    cultureTokenService,
    culturalItemsService,
    marketService
  );

  app.listen(config.port, () => {
    console.log(`Listening on port ${config.port}!`);
  });

  saleOfferWorker.run();
}

const redOutput = "\x1b[31m%s\x1b[0m";

run().catch((e) => {
  console.error(redOutput, e);
  process.exit(1);
});
