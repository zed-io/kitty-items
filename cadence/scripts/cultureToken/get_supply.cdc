import CultureToken from "../../contracts/CultureToken.cdc"

// This script returns the total amount of CultureToken currently in existence.

pub fun main(): UFix64 {

    let supply = CultureToken.totalSupply

    log(supply)

    return supply
}
