import FungibleToken from "../../contracts/FungibleToken.cdc"
import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import CultureToken from "../../contracts/CultureToken.cdc"
import CulturalItems from "../../contracts/CulturalItems.cdc"
import CulturalItemsMarket from "../../contracts/CulturalItemsMarket.cdc"

transaction(saleItemID: UInt64, saleItemPrice: UFix64) {
    let cultureTokenVault: Capability<&CultureToken.Vault{FungibleToken.Receiver}>
    let culturalItemsCollection: Capability<&CulturalItems.Collection{NonFungibleToken.Provider}>
    let marketCollection: &CulturalItemsMarket.Collection

    prepare(signer: AuthAccount) {
        // we need a provider capability, but one is not provided by default so we create one.
        let CulturalItemsCollectionProviderPrivatePath = /private/culturalItemsCollectionProvider

        self.cultureTokenVault = signer.getCapability<&CultureToken.Vault{FungibleToken.Receiver}>(CultureToken.ReceiverPublicPath)!
        assert(self.cultureTokenVault.borrow() != nil, message: "Missing or mis-typed CultureToken receiver")

        if !signer.getCapability<&CulturalItems.Collection{NonFungibleToken.Provider}>(CulturalItemsCollectionProviderPrivatePath)!.check() {
            signer.link<&CulturalItems.Collection{NonFungibleToken.Provider}>(CulturalItemsCollectionProviderPrivatePath, target: CulturalItems.CollectionStoragePath)
        }

        self.culturalItemsCollection = signer.getCapability<&CulturalItems.Collection{NonFungibleToken.Provider}>(CulturalItemsCollectionProviderPrivatePath)!
        assert(self.culturalItemsCollection.borrow() != nil, message: "Missing or mis-typed CulturalItemsCollection provider")

        self.marketCollection = signer.borrow<&CulturalItemsMarket.Collection>(from: CulturalItemsMarket.CollectionStoragePath)
            ?? panic("Missing or mis-typed CulturalItemsMarket Collection")
    }

    execute {
        let offer <- CulturalItemsMarket.createSaleOffer (
            sellerItemProvider: self.culturalItemsCollection,
            saleItemID: saleItemID,
            sellerPaymentReceiver: self.cultureTokenVault,
            salePrice: saleItemPrice
        )
        self.marketCollection.insert(offer: <-offer)
    }
}
