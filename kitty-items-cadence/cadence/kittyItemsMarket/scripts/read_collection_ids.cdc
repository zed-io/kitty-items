import KittyItemsMarket from 0xKITTYMARKET

// This script returns an array of all the nft ids for sale in the collection

pub fun main(account: Address): [UInt64] {
    let acct = getAccount(account)
    let marketCollectionRef = getAccount(marketCollectionAddress)
         .getCapability<&KittyItemsMarket.Collection{KittyItemsMarket.CollectionPublic}>(
            KittyItemsMarket.CollectionPublicPath
        )
        .borrow()
        ?? panic("Could not borrow market collection from market address")
    
    return marketCollectionRef.getSaleOfferIDs()
}
 