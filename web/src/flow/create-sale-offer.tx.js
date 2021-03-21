import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import {tx} from "./util/tx"

const CODE = fcl.cdc`
  import FungibleToken from 0xFungibleToken
  import NonFungibleToken from 0xNonFungibleToken
  import CultureToken from 0xCultureToken
  import CulturalItems from 0xCulturalItems
  import CulturalItemsMarket from 0xCulturalItemsMarket

  transaction(saleItemID: UInt64, salePrice: UFix64) {
    prepare(acct: AuthAccount) {
      let market = acct.borrow<&CulturalItemsMarket.Collection>(from: CulturalItemsMarket.CollectionStoragePath) ?? panic("Need the marketplace resouce")

      let sellerPaymentReceiver = acct.getCapability<&CultureToken.Vault{FungibleToken.Receiver}>(CultureToken.ReceiverPublicPath)

      let providerPath = /private/CulturalItemsCollectionProvider
      acct.unlink(providerPath)
      if !acct.getCapability<&CulturalItems.Collection{NonFungibleToken.Provider}>(providerPath).check() {
        acct.link<&CulturalItems.Collection{NonFungibleToken.Provider}>(providerPath, target: CulturalItems.CollectionStoragePath)
      }
      if !acct.getCapability<&CulturalItems.Collection{NonFungibleToken.Provider}>(providerPath).check() {
        acct.link<&CulturalItems.Collection{NonFungibleToken.Provider}>(providerPath, target: CulturalItems.CollectionStoragePath)
      }
      let itemProvider = acct.getCapability<&CulturalItems.Collection{NonFungibleToken.Provider}>(providerPath)
      assert(itemProvider.borrow() != nil, message: "Missing or mis-typed CulturalItemsCollection provider")

      let offer <- CulturalItemsMarket.createSaleOffer(
        sellerItemProvider: itemProvider,
        saleItemID: saleItemID,
        sellerPaymentReceiver: sellerPaymentReceiver,
        salePrice: salePrice,
      )

      market.insert(offer: <-offer)
    }
  }
`

export function createSaleOffer({itemId, price}, opts = {}) {
  if (itemId == null)
    throw new Error("createSaleOffer(itemId, price) -- itemId required")
  if (price == null)
    throw new Error("createSaleOffer(itemId, price) -- price required")

  // prettier-ignore
  return tx([
    fcl.transaction(CODE),
    fcl.args([
      fcl.arg(Number(itemId), t.UInt64),
      fcl.arg(String(price), t.UFix64),
    ]),
    fcl.proposer(fcl.authz),
    fcl.payer(fcl.authz),
    fcl.authorizations([
      fcl.authz
    ]),
    fcl.limit(1000)
  ], opts)
}
