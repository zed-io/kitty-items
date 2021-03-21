import CulturalItems from "../../contracts/CulturalItems.cdc"

// This scripts returns the number of CulturalItems currently in existence.

pub fun main(): UInt64 {    
    return CulturalItems.totalSupply
}
