import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

const CODE = fcl.cdc`
  import CulturalItemsMarket from 0xCulturalItemsMarket

  pub fun main(address: Address): [UInt64] {
    if let col = getAccount(address).getCapability<&CulturalItemsMarket.Collection{CulturalItemsMarket.CollectionPublic}>(CulturalItemsMarket.CollectionPublicPath).borrow() {
      return col.getSaleOfferIDs()
    } 
    
    return []
  }
`

export function fetchMarketItems(address) {
  if (address == null) return Promise.resolve([])

  // prettier-ignore
  return fcl.send([
    fcl.script(CODE),
    fcl.args([
      fcl.arg(address, t.Address)
    ])
  ]).then(fcl.decode).then(d => d.sort((a, b) => a - b))
}
