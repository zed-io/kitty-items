import CulturalItemsMarket from "../../contracts/CulturalItemsMarket.cdc"

// This transaction configures an account to hold SaleOffer items.

transaction {
    prepare(signer: AuthAccount) {

        // if the account doesn't already have a collection
        if signer.borrow<&CulturalItemsMarket.Collection>(from: CulturalItemsMarket.CollectionStoragePath) == nil {

            // create a new empty collection
            let collection <- CulturalItemsMarket.createEmptyCollection() as! @CulturalItemsMarket.Collection
            
            // save it to the account
            signer.save(<-collection, to: CulturalItemsMarket.CollectionStoragePath)

            // create a public capability for the collection
            signer.link<&CulturalItemsMarket.Collection{CulturalItemsMarket.CollectionPublic}>(CulturalItemsMarket.CollectionPublicPath, target: CulturalItemsMarket.CollectionStoragePath)
        }
    }
}
