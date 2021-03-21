import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import {batch} from "./util/batch"

const CODE = fcl.cdc`
import NonFungibleToken from 0xNonFungibleToken
import CulturalItems from 0xCulturalItems

pub struct Item {
  pub let id: UInt64
  pub let owner: Address
  pub let name: String
  pub let country: String
  pub let year: String
  pub let metadata: {String: String}

  init(
    id: UInt64,
    owner: Address,
    name: String,
    country: String,
    year: String,
    metadata: {String: String}
  ) {
    self.id = id
    self.owner = owner
    self.name = name
    self.country = country
    self.year = year
    self.metadata = metadata
  }
}

pub fun fetch(address: Address, id: UInt64): Item? {
  if let col = getAccount(address).getCapability<&CulturalItems.Collection{NonFungibleToken.CollectionPublic, CulturalItems.CulturalItemsCollectionPublic}>(CulturalItems.CollectionPublicPath).borrow() {
    if let item = col.borrowCulturalItem(id: id) {
      return Item(
        id: id,
        owner: address,
        name: item.name,
        country: item.country,
        year: item.year,
        metadata: item.metadata
      )
    }
  }

  return nil
}

pub fun main(keys: [String], addresses: [Address], ids: [UInt64]): {String: Item?} {
  let r: {String: Item?} = {}
  var i = 0
  while i < keys.length {
    let key = keys[i]
    let address = addresses[i]
    let id = ids[i]
    r[key] = fetch(address: address, id: id)
    i = i + 1
  }
  return r
}
`

const collate = px => {
  return Object.keys(px).reduce(
    (acc, key) => {
      acc.keys.push(key)
      acc.addresses.push(px[key][0])
      acc.ids.push(px[key][1])
      return acc
    },
    {keys: [], addresses: [], ids: []}
  )
}

const {enqueue} = batch("FETCH_ACCOUNT_ITEM", async px => {
  const {keys, addresses, ids} = collate(px)

  return fcl
    .send([
      fcl.script(CODE),
      fcl.args([
        fcl.arg(keys, t.Array(t.String)),
        fcl.arg(addresses, t.Array(t.Address)),
        fcl.arg(ids.map(Number), t.Array(t.UInt64)),
      ]),
    ])
    .then(fcl.decode)
})

export async function fetchAccountItem(address, id) {
  if (address == null) return Promise.resolve(null)
  if (id == null) return Promise.resolve(null)
  return enqueue(address, id)
}
