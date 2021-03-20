import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import CulturalItems from "../../contracts/CulturalItems.cdc"

// This transaction configures an account to hold Cultural Items.

transaction {
    prepare(signer: AuthAccount) {
        // if the account doesn't already have a collection
        if signer.borrow<&CulturalItems.Collection>(from: CulturalItems.CollectionStoragePath) == nil {

            // create a new empty collection
            let collection <- CulturalItems.createEmptyCollection()
            
            // save it to the account
            signer.save(<-collection, to: CulturalItems.CollectionStoragePath)

            // create a public capability for the collection
            signer.link<&CulturalItems.Collection{NonFungibleToken.CollectionPublic, CulturalItems.CulturalItemsCollectionPublic}>(CulturalItems.CollectionPublicPath, target: CulturalItems.CollectionStoragePath)
        }
    }
}
