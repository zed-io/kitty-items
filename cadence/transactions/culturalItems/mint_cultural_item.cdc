import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import CulturalItems from "../../contracts/CulturalItems.cdc"

// This transction uses the NFTMinter resource to mint a new NFT.
//
// It must be run with the account that has the minter resource
// stored at path /storage/NFTMinter.

transaction(
    recipient: Address, 
    name: String,
    description: String,
    year: String,
    country: String,
    culturalSignificance: String,
    metadata: {String: String}
) {
    
    // local variable for storing the minter reference
    let minter: &CulturalItems.NFTMinter

    prepare(signer: AuthAccount) {

        // borrow a reference to the NFTMinter resource in storage
        self.minter = signer.borrow<&CulturalItems.NFTMinter>(from: CulturalItems.MinterStoragePath)
            ?? panic("Could not borrow a reference to the NFT minter")
    }

    execute {
        // get the public account object for the recipient
        let recipient = getAccount(recipient)

        // borrow the recipient's public NFT collection reference
        let receiver = recipient
            .getCapability(CulturalItems.CollectionPublicPath)!
            .borrow<&{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not get receiver reference to the NFT Collection")

        // mint the NFT and deposit it to the recipient's collection
        self.minter.mintNFT(
            recipient: receiver,
            name: name,
            description: description,
            year: year,
            country: country,
            culturalSignificance: culturalSignificance,
            metadata: metadata
        )
    }
}
