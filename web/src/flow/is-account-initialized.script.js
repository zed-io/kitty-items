import {send, decode, script, args, arg, cdc} from "@onflow/fcl"
import {Address} from "@onflow/types"

const CODE = cdc`
  import FungibleToken from 0xFungibleToken
  import NonFungibleToken from 0xNonFungibleToken
  import CultureToken from 0xCultureToken
  import CulturalItems from 0xCulturalItems
  import CulturalItemsMarket from 0xCulturalItemsMarket

  pub fun hasCultureToken(_ address: Address): Bool {
    let receiver: Bool = getAccount(address)
      .getCapability<&CultureToken.Vault{FungibleToken.Receiver}>(CultureToken.ReceiverPublicPath)
      .check()

    let balance: Bool = getAccount(address)
      .getCapability<&CultureToken.Vault{FungibleToken.Balance}>(CultureToken.BalancePublicPath)
      .check()

    return receiver && balance
  }

  pub fun hasCulturalItems(_ address: Address): Bool {
    return getAccount(address)
      .getCapability<&CulturalItems.Collection{NonFungibleToken.CollectionPublic, CulturalItems.CulturalItemsCollectionPublic}>(CulturalItems.CollectionPublicPath)
      .check()
  }

  pub fun hasCulturalItemsMarket(_ address: Address): Bool {
    return getAccount(address)
      .getCapability<&CulturalItemsMarket.Collection{CulturalItemsMarket.CollectionPublic}>(CulturalItemsMarket.CollectionPublicPath)
      .check()
  }

  pub fun main(address: Address): {String: Bool} {
    let ret: {String: Bool} = {}
    ret["CultureToken"] = hasCultureToken(address)
    ret["CulturalItems"] = hasCulturalItems(address)
    ret["CulturalItemsMarket"] = hasCulturalItemsMarket(address)
    return ret
  }
`

export function isAccountInitialized(address) {
  if (address == null) return Promise.resolve(false)

  // prettier-ignore
  return send([
    script(CODE),
    args([
      arg(address, Address)
    ])
  ]).then(decode)
}
