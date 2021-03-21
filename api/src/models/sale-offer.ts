import { BaseModel } from "./base";
import { CulturalItem } from "./cultural-item";

class SaleOffer extends BaseModel {
  id?: string;
  price!: number;
  seller_address?: string;
  is_complete!: boolean;
  tx_hash?: string;

  cultural_item?: CulturalItem;

  static get tableName() {
    return "sale_offers";
  }

  static relationMappings = {
    cultural_item: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: CulturalItem,
      join: {
        from: "sale_offers.cultural_item_id",
        to: "cultural_items.id",
      },
    },
  };
}

export { SaleOffer };
