import NonFungibleToken from "./NonFungibleToken.cdc"

// CulturalItems
// NFT items for Culture!
//
pub contract CulturalItems: NonFungibleToken {

    // Events
    //
    pub event ContractInitialized()
    pub event Withdraw(id: UInt64, from: Address?)
    pub event Deposit(id: UInt64, to: Address?)
    pub event Minted(
        id: UInt64,
        name: String,
        description: String,
        year: String,
        country: String,
        culturalSignificance: String,
        metadata: {String: String}
    )

    // Named Paths
    //
    pub let CollectionStoragePath: StoragePath
    pub let CollectionPublicPath: PublicPath
    pub let MinterStoragePath: StoragePath

    // totalSupply
    // The total number of CulturalItems that have been minted
    //
    pub var totalSupply: UInt64

    // NFT
    // A Cultural Item as an NFT
    //
    pub resource NFT: NonFungibleToken.INFT {
        // The token's ID
        pub let id: UInt64
        pub let name: String
        pub let description: String
        pub let year: String
        pub let country: String
        pub let culturalSignificance: String
        pub let metadata: {String: String}

        // initializer
        //
        init(
            initID: UInt64,
            initName: String,
            initDescription: String,
            initYear: String,
            initCountry: String,
            initCulturalSignificance: String,
            initMetadata: {String: String}
        ) {
            self.id = initID
            self.name = initName
            self.description = initDescription
            self.year = initYear
            self.country = initCountry
            self.culturalSignificance = initCulturalSignificance
            self.metadata = initMetadata
        }
    }

    // This is the interface that users can cast their CulturalItems Collection as
    // to allow others to deposit CulturalItems into their Collection. It also allows for reading
    // the details of CulturalItems in the Collection.
    pub resource interface CulturalItemsCollectionPublic {
        pub fun deposit(token: @NonFungibleToken.NFT)
        pub fun getIDs(): [UInt64]
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
        pub fun borrowCulturalItem(id: UInt64): &CulturalItems.NFT? {
            // If the result isn't nil, the id of the returned reference
            // should be the same as the argument to the function
            post {
                (result == nil) || (result?.id == id):
                    "Cannot borrow CulturalItem reference: The ID of the returned reference is incorrect"
            }
        }
    }

    // Collection
    // A collection of CulturalItem NFTs owned by an account
    //
    pub resource Collection: CulturalItemsCollectionPublic, NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic {
        // dictionary of NFT conforming tokens
        // NFT is a resource type with an `UInt64` ID field
        //
        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        // withdraw
        // Removes an NFT from the collection and moves it to the caller
        //
        pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
            let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("missing NFT")

            emit Withdraw(id: token.id, from: self.owner?.address)

            return <-token
        }

        // deposit
        // Takes a NFT and adds it to the collections dictionary
        // and adds the ID to the id array
        //
        pub fun deposit(token: @NonFungibleToken.NFT) {
            let token <- token as! @CulturalItems.NFT

            let id: UInt64 = token.id

            // add the new token to the dictionary which removes the old one
            let oldToken <- self.ownedNFTs[id] <- token

            emit Deposit(id: id, to: self.owner?.address)

            destroy oldToken
        }

        // getIDs
        // Returns an array of the IDs that are in the collection
        //
        pub fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        // borrowNFT
        // Gets a reference to an NFT in the collection
        // so that the caller can read its metadata and call its methods
        //
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            return &self.ownedNFTs[id] as &NonFungibleToken.NFT
        }

        // borrowCulturalItem
        // Gets a reference to an NFT in the collection as a CulturalItem,
        // exposing all of its fields (including the typeID).
        // This is safe as there are no functions that can be called on the CulturalItem.
        //
        pub fun borrowCulturalItem(id: UInt64): &CulturalItems.NFT? {
            if self.ownedNFTs[id] != nil {
                let ref = &self.ownedNFTs[id] as auth &NonFungibleToken.NFT
                return ref as! &CulturalItems.NFT
            } else {
                return nil
            }
        }

        // destructor
        destroy() {
            destroy self.ownedNFTs
        }

        // initializer
        //
        init () {
            self.ownedNFTs <- {}
        }
    }

    // createEmptyCollection
    // public function that anyone can call to create a new empty collection
    //
    pub fun createEmptyCollection(): @NonFungibleToken.Collection {
        return <- create Collection()
    }

    // NFTMinter
    // Resource that an admin or something similar would own to be
    // able to mint new NFTs
    //
	pub resource NFTMinter {

		// mintNFT
        // Mints a new NFT with a new ID
		// and deposit it in the recipients collection using their collection reference
        //
		pub fun mintNFT(
            recipient: &{NonFungibleToken.CollectionPublic},
            name: String,
            description: String,
            year: String,
            country: String,
            culturalSignificance: String,
            metadata: {String: String}
        ) {
            emit Minted(
                id: CulturalItems.totalSupply,
                name: name,
                description: description,
                year: year,
                country: country,
                culturalSignificance: culturalSignificance,
                metadata: metadata
            )

			// deposit it in the recipient's account using their reference
			recipient.deposit(token: <-create CulturalItems.NFT(
                initID: CulturalItems.totalSupply,
                initName: name,
                initDescription: description,
                initYear: year,
                initCountry: country,
                initCulturalSignificance: culturalSignificance,
                initMetadata: metadata
            ))

            CulturalItems.totalSupply = CulturalItems.totalSupply + (1 as UInt64)
		}
	}

    // fetch
    // Get a reference to a CulturalItem from an account's Collection, if available.
    // If an account does not have a CulturalItems.Collection, panic.
    // If it has a collection but does not contain the itemId, return nil.
    // If it has a collection and that collection contains the itemId, return a reference to that.
    //
    pub fun fetch(_ from: Address, itemID: UInt64): &CulturalItems.NFT? {
        let collection = getAccount(from)
            .getCapability(CulturalItems.CollectionPublicPath)!
            .borrow<&CulturalItems.Collection{CulturalItems.CulturalItemsCollectionPublic}>()
            ?? panic("Couldn't get collection")
        // We trust CulturalItems.Collection.borowCulturalItem to get the correct itemID
        // (it checks it before returning it).
        return collection.borrowCulturalItem(id: itemID)
    }

    // initializer
    //
	init() {
        // Set our named paths
        //FIXME: REMOVE SUFFIX BEFORE RELEASE
        self.CollectionStoragePath = /storage/CulturalItemsCollection001
        self.CollectionPublicPath = /public/CulturalItemsCollection001
        self.MinterStoragePath = /storage/CulturalItemsMinter001

        // Initialize the total supply
        self.totalSupply = 0

        // Create a Minter resource and save it to storage
        let minter <- create NFTMinter()
        self.account.save(<-minter, to: self.MinterStoragePath)

        emit ContractInitialized()
	}
}
