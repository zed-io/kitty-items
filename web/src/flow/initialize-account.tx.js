// prettier-ignore
import {transaction, limit, proposer, payer, authorizations, authz, cdc} from "@onflow/fcl"
import {invariant} from "@onflow/util-invariant"
import {tx} from "./util/tx"

const CODE = cdc`
  import FungibleToken from 0xFungibleToken
  import NonFungibleToken from 0xNonFungibleToken
  import CultureToken from 0xCultureToken
  import CulturalItems from 0xCulturalItems
  import CulturalItemsMarket from 0xCulturalItemsMarket

  pub fun hasCultureToken(_ address: Address): Bool {
    let receiver = getAccount(address)
      .getCapability<&CultureToken.Vault{FungibleToken.Receiver}>(CultureToken.ReceiverPublicPath)
      .check()

    let balance = getAccount(address)
      .getCapability<&CultureToken.Vault{FungibleToken.Balance}>(CultureToken.BalancePublicPath)
      .check()

    return receiver && balance
  }

  pub fun hasItems(_ address: Address): Bool {
    return getAccount(address)
      .getCapability<&CulturalItems.Collection{NonFungibleToken.CollectionPublic, CulturalItems.CulturalItemsCollectionPublic}>(CulturalItems.CollectionPublicPath)
      .check()
  }

  pub fun hasMarket(_ address: Address): Bool {
    return getAccount(address)
      .getCapability<&CulturalItemsMarket.Collection{CulturalItemsMarket.CollectionPublic}>(CulturalItemsMarket.CollectionPublicPath)
      .check()
  }

  transaction {
    prepare(acct: AuthAccount) {
      if !hasCultureToken(acct.address) {
        if acct.borrow<&CultureToken.Vault>(from: CultureToken.VaultStoragePath) == nil {
          acct.save(<-CultureToken.createEmptyVault(), to: CultureToken.VaultStoragePath)
        }
        acct.unlink(CultureToken.ReceiverPublicPath)
        acct.unlink(CultureToken.BalancePublicPath)
        acct.link<&CultureToken.Vault{FungibleToken.Receiver}>(CultureToken.ReceiverPublicPath, target: CultureToken.VaultStoragePath)
        acct.link<&CultureToken.Vault{FungibleToken.Balance}>(CultureToken.BalancePublicPath, target: CultureToken.VaultStoragePath)
      }

      if !hasItems(acct.address) {
        if acct.borrow<&CulturalItems.Collection>(from: CulturalItems.CollectionStoragePath) == nil {
          acct.save(<-CulturalItems.createEmptyCollection(), to: CulturalItems.CollectionStoragePath)
        }
        acct.unlink(CulturalItems.CollectionPublicPath)
        acct.link<&CulturalItems.Collection{NonFungibleToken.CollectionPublic, CulturalItems.CulturalItemsCollectionPublic}>(CulturalItems.CollectionPublicPath, target: CulturalItems.CollectionStoragePath)
      }

      if !hasMarket(acct.address) {
        if acct.borrow<&CulturalItemsMarket.Collection>(from: CulturalItemsMarket.CollectionStoragePath) == nil {
          acct.save(<-CulturalItemsMarket.createEmptyCollection(), to: CulturalItemsMarket.CollectionStoragePath)
        }
        acct.unlink(CulturalItemsMarket.CollectionPublicPath)
        acct.link<&CulturalItemsMarket.Collection{CulturalItemsMarket.CollectionPublic}>(CulturalItemsMarket.CollectionPublicPath, target:CulturalItemsMarket.CollectionStoragePath)
      }
    }
  }
`

export async function initializeAccount(address, opts = {}) {
  // prettier-ignore
  invariant(address != null, "Tried to initialize an account but no address was supplied")

  return tx(
    [
      transaction(CODE),
      limit(70),
      proposer(authz),
      payer(authz),
      authorizations([authz]),
    ],
    opts
  )
}
