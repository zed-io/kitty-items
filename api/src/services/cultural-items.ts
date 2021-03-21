import * as t from "@onflow/types";
import * as fcl from "@onflow/fcl";
import { FlowService } from "./flow";
import * as fs from "fs";
import * as path from "path";

const nonFungibleTokenPath = '"../../contracts/NonFungibleToken.cdc"';
const culturalItemsPath = '"../../contracts/CulturalItems.cdc"';

class CulturalItemsService {
  constructor(
    private readonly flowService: FlowService,
    private readonly nonFungibleTokenAddress: string,
    private readonly culturalItemsAddress: string
  ) {}

  setupAccount = async () => {
    const authorization = this.flowService.authorizeMinter();

    const transaction = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/transactions/culturalItems/setup_account.cdc`
        ),
        "utf8"
      )
      .replace(
        nonFungibleTokenPath,
        fcl.withPrefix(this.nonFungibleTokenAddress)
      )
      .replace(culturalItemsPath, fcl.withPrefix(this.culturalItemsAddress));

    return this.flowService.sendTx({
      transaction,
      args: [],
      authorizations: [authorization],
      payer: authorization,
      proposer: authorization,
    });
  };

  mint = async (
    recipient: string,
    name: string,
    description: string,
    year: string,
    country: string,
    culturalSignificance: string,
    metadata: Record<string, string>
  ) => {
    const authorization = this.flowService.authorizeMinter();

    const transaction = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/transactions/culturalItems/mint_cultural_item.cdc`
        ),
        "utf8"
      )
      .replace(
        nonFungibleTokenPath,
        fcl.withPrefix(this.nonFungibleTokenAddress)
      )
      .replace(culturalItemsPath, fcl.withPrefix(this.culturalItemsAddress));

    return this.flowService.sendTx({
      transaction,
      args: [
        fcl.arg(recipient, t.Address),
        fcl.arg(name, t.String),
        fcl.arg(description, t.String),
        fcl.arg(year, t.String),
        fcl.arg(country, t.String),
        fcl.arg(culturalSignificance, t.String),
        fcl.arg(
          Object.keys(metadata).map((key) => ({ key, value: metadata[key] })),
          t.Dictionary(
            Array(Object.keys(metadata).length).fill({
              key: t.String,
              value: t.String,
            })
          )
        ),
      ],
      authorizations: [authorization],
      payer: authorization,
      proposer: authorization,
    });
  };

  transfer = async (recipient: string, itemId: number) => {
    const authorization = this.flowService.authorizeMinter();

    const transaction = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/transactions/culturalItems/transfer_cultural_item.cdc`
        ),
        "utf8"
      )
      .replace(
        nonFungibleTokenPath,
        fcl.withPrefix(this.nonFungibleTokenAddress)
      )
      .replace(culturalItemsPath, fcl.withPrefix(this.culturalItemsAddress));

    return this.flowService.sendTx({
      transaction,
      args: [fcl.arg(recipient, t.Address), fcl.arg(itemId, t.UInt64)],
      authorizations: [authorization],
      payer: authorization,
      proposer: authorization,
    });
  };

  getCollectionIds = async (account: string): Promise<number[]> => {
    const script = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/scripts/culturalItems/read_collection_ids.cdc`
        ),
        "utf8"
      )
      .replace(
        nonFungibleTokenPath,
        fcl.withPrefix(this.nonFungibleTokenAddress)
      )
      .replace(culturalItemsPath, fcl.withPrefix(this.culturalItemsAddress));

    return this.flowService.executeScript<number[]>({
      script,
      args: [fcl.arg(account, t.Address)],
    });
  };

  getCulturalItemType = async (itemId: number): Promise<number> => {
    const script = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/scripts/culturalItems/read_cultural_item_type_id.cdc`
        ),
        "utf8"
      )
      .replace(
        nonFungibleTokenPath,
        fcl.withPrefix(this.nonFungibleTokenAddress)
      )
      .replace(culturalItemsPath, fcl.withPrefix(this.culturalItemsAddress));

    return this.flowService.executeScript<number>({
      script,
      args: [fcl.arg(itemId, t.UInt64)],
    });
  };

  getSupply = async (): Promise<number> => {
    const script = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/scripts/culturalItems/read_cultural_items_supply.cdc`
        ),
        "utf8"
      )
      .replace(culturalItemsPath, fcl.withPrefix(this.culturalItemsAddress));

    return this.flowService.executeScript<number>({ script, args: [] });
  };
}

export { CulturalItemsService };
