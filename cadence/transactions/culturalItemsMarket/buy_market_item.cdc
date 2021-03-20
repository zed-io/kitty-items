import FungibleToken from "../../contracts/FungibleToken.cdc"
import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import CultureToken from "../../contracts/CultureToken.cdc"
import CulturalItems from "../../contracts/CulturalItems.cdc"
import CulturalItemsMarket from "../../contracts/CulturalItemsMarket.cdc"

transaction(saleItemID: UInt64, marketCollectionAddress: Address) {
    let paymentVault: @FungibleToken.Vault
    let culturalItemsCollection: &CulturalItems.Collection{NonFungibleToken.Receiver}
    let marketCollection: &CulturalItemsMarket.Collection{CulturalItemsMarket.CollectionPublic}

    prepare(signer: AuthAccount) {
        self.marketCollection = getAccount(marketCollectionAddress)
            .getCapability<&CulturalItemsMarket.Collection{CulturalItemsMarket.CollectionPublic}>(
                CulturalItemsMarket.CollectionPublicPath
            )!
            .borrow()
            ?? panic("Could not borrow market collection from market address")

        let saleItem = self.marketCollection.borrowSaleItem(saleItemID: saleItemID)
                    ?? panic("No item with that ID")
        let price = saleItem.salePrice

        let mainCultureTokenVault = signer.borrow<&CultureToken.Vault>(from: CultureToken.VaultStoragePath)
            ?? panic("Cannot borrow CultureToken vault from acct storage")
        self.paymentVault <- mainCultureTokenVault.withdraw(amount: price)

        self.culturalItemsCollection = signer.borrow<&CulturalItems.Collection{NonFungibleToken.Receiver}>(
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
