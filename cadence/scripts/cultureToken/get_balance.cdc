import CultureToken from "../../contracts/CultureToken.cdc"
import FungibleToken from "../../contracts/FungibleToken.cdc"

// This script returns an account's CultureToken balance.

pub fun main(address: Address): UFix64 {
    let account = getAccount(address)
    
    let vaultRef = account.getCapability(CultureToken.BalancePublicPath)!.borrow<&CultureToken.Vault{FungibleToken.Balance}>()
        ?? panic("Could not borrow Balance reference to the Vault")

    return vaultRef.balance
}
