import { BaseModel } from "./base";

class CulturalItem extends BaseModel {
  id!: number;
  owner_address?: string;

  static get tableName() {
    return "cultural_items";
  }
}

export { CulturalItem };
