import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import {tx} from "./util/tx"
import {invariant} from "@onflow/util-invariant"

const CODE = fcl.cdc`
  import FungibleToken from 0xFungibleToken
  import NonFungibleToken from 0xNonFungibleToken
  import CultureToken from 0xCultureToken
  import CulturalItems from 0xCulturalItems
  import CulturalItemsMarket from 0xCulturalItemsMarket

  transaction(saleItemID: UInt64, marketCollectionAddress: Address) {
      let paymentVault: @FungibleToken.Vault
      let culturalItemsCollection: &CulturalItems.Collection{NonFungibleToken.Receiver}
      let marketCollection: &CulturalItemsMarket.Collection{CulturalItemsMarket.CollectionPublic}

      prepare(acct: AuthAccount) {
          self.marketCollection = getAccount(marketCollectionAddress)
              .getCapability<&CulturalItemsMarket.Collection{CulturalItemsMarket.CollectionPublic}>(CulturalItemsMarket.CollectionPublicPath)
              .borrow() ?? panic("Could not borrow market collection from market address")

          let price = self.marketCollection.borrowSaleItem(saleItemID: saleItemID)!.salePrice

          let mainCultureTokenVault = acct.borrow<&CultureToken.Vault>(from: CultureToken.VaultStoragePath)
              ?? panic("Cannot borrow CultureToken vault from acct storage")
          self.paymentVault <- mainCultureTokenVault.withdraw(amount: price)

          self.culturalItemsCollection = acct.borrow<&CulturalItems.Collection{NonFungibleToken.Receiver}>(
              from: CulturalItems.CollectionStoragePath
          ) ?? panic("Cannot borrow CulturalItems collection receiver from acct")
      }

      execute {
          self.marketCollection.purchase(
              saleItemID: saleItemID,
              buyerCollection: self.culturalItemsCollection,
              buyerPayment: <- self.paymentVault
          )
      }
  }
`

// prettier-ignore
export function buyMarketItem({itemId, ownerAddress}, opts = {}) {
  invariant(itemId != null, "buyMarketItem({itemId, ownerAddress}) -- itemId required")
  invariant(ownerAddress != null, "buyMarketItem({itemId, ownerAddress}) -- ownerAddress required")

  return tx([
    fcl.transaction(CODE),
    fcl.args([
      fcl.arg(Number(itemId), t.UInt64),
      fcl.arg(String(ownerAddress), t.Address),
    ]),
    fcl.proposer(fcl.authz),
    fcl.payer(fcl.authz),
    fcl.authorizations([fcl.authz]),
    fcl.limit(1000),
  ], opts)
}
