import CulturalItemsMarket from "../../contracts/CulturalItemsMarket.cdc"

transaction(saleItemID: UInt64) {
    let marketCollection: &CulturalItemsMarket.Collection

    prepare(signer: AuthAccount) {
        self.marketCollection = signer.borrow<&CulturalItemsMarket.Collection>(from: CulturalItemsMarket.CollectionStoragePath)
            ?? panic("Missing or mis-typed CulturalItemsMarket Collection")
    }

    execute {
        let offer <-self.marketCollection.remove(saleItemID: saleItemID)
        destroy offer
    }
}
