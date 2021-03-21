import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import CulturalItems from "../../contracts/CulturalItems.cdc"

// This script returns the size of an account's CulturalItems collection.

pub fun main(address: Address): Int {
    let account = getAccount(address)

    let collectionRef = account.getCapability(CulturalItems.CollectionPublicPath)!
        .borrow<&{NonFungibleToken.CollectionPublic}>()
        ?? panic("Could not borrow capability from public collection")
    
    return collectionRef.getIDs().length
}
