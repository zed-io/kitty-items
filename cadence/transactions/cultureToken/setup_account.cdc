import FungibleToken from "../../contracts/FungibleToken.cdc"
import CultureToken from "../../contracts/CultureToken.cdc"

// This transaction is a template for a transaction
// to add a Vault resource to their account
// so that they can use the CultureToken

transaction {

    prepare(signer: AuthAccount) {

        if signer.borrow<&CultureToken.Vault>(from: CultureToken.VaultStoragePath) == nil {
            // Create a new CultureToken Vault and put it in storage
            signer.save(<-CultureToken.createEmptyVault(), to: CultureToken.VaultStoragePath)

            // Create a public capability to the Vault that only exposes
            // the deposit function through the Receiver interface
            signer.link<&CultureToken.Vault{FungibleToken.Receiver}>(
                CultureToken.ReceiverPublicPath,
                target: CultureToken.VaultStoragePath
            )

            // Create a public capability to the Vault that only exposes
            // the balance field through the Balance interface
            signer.link<&CultureToken.Vault{FungibleToken.Balance}>(
                CultureToken.BalancePublicPath,
                target: CultureToken.VaultStoragePath
            )
        }
    }
}
