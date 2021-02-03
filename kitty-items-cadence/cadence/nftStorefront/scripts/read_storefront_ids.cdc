import NFTStorefront from 0xNFTSTOREFRONT

// This transaction returns an array of all the nft uuids for sale through the Storefront

pub fun main(account: Address): [UInt64] {
    let storefrontRef = acct
        .getCapability<&KittyItemsMarket.Collection{NFTStorefront.StorefrontPublic}>(
            NFTStorefront.StorefrontPublicPath
        )
        .borrow()
        ?? panic("Could not borrow public storefront from address")
    
    return storefrontRef.getSaleOfferIDs()
}
 