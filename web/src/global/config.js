import {config} from "@onflow/fcl"

config()
  .put("env", process.env.REACT_APP_CHAIN_ENV)
  .put("accessNode.api", process.env.REACT_APP_ACCESS_NODE)
  .put("challenge.handshake", process.env.REACT_APP_WALLET_DISCOVERY)
  .put("0xFungibleToken", process.env.REACT_APP_CONTRACT_FUNGIBLE_TOKEN)
  .put("0xNonFungibleToken", process.env.REACT_APP_CONTRACT_NON_FUNGIBLE_TOKEN)
  .put("0xCultureToken", process.env.REACT_APP_CONTRACT_KIBBLE)
  .put(
    "0xCulturalItemsMarket",
    process.env.REACT_APP_CONTRACT_KITTY_ITEMS_MARKET
  )
  .put("0xCulturalItems", process.env.REACT_APP_CONTRACT_KITTY_ITEMS)
  .put("0xCulturalItems", process.env.REACT_APP_CONTRACT_KITTY_ITEMS)
  .put(
    "0xCulturalItemsMarket",
    process.env.REACT_APP_CONTRACT_KITTY_ITEMS_MARKET
  )
