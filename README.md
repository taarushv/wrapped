# Wrapped-sdk

This repo contains: 
* [Subgraph](https://thegraph.com/explorer/subgraph/taarushv/wrapped) implementation to query information about wrapped assets.
* API endpoint to aggregate information from the subgraph and more. 
* React dashboard client to visualize all the data on the client side.
* [Gist](https://gist.github.com/taarushv/7ff6e6fafedf515c715fe7baef977230) on how to interact with the subgraph.   

Assets currently enabled on the subgraph: WZEC, WHNS
## Subgraph

[Live](https://thegraph.com/explorer/subgraph/taarushv/wrapped)

Code: `/wrapped-subgraph` 

Getting historical information from the ETH state can be slow, TheGraph's service is faster given their hosted archive node.

Current subgraph schema: 

```
type WrappedAsset @entity {
  id: ID!
  tokenSymbol: String!
  tokenName: String!
  decimals: Int!
  contractAddress: String!
  initTxHash: String!
  initialSupply: String!
}

type WrappedAssetSupply @entity {
  id: ID! 
  tokenSymbol: String!
  decimals: Int!
  currentSupply: String!
}

type WrappedAssetTransfer @entity {
  id: ID!
  tokenSymbol: String!
  from: String!
  to: String!
  amount: String!
  block: Int!
  txHash: String!
}

type WrappedAssetMint @entity {
  id: ID!
  tokenSymbol: String!
  to: String!
  amount: String!
  block: Int!
  txHash: String!
} 
```

In order to add new wrapped assets to the subgraph, edit `subgraph.yaml` and `src/mappings.ts` in accordance with the current templates. 

## API endpoint
[Live](http://wrapped-api.ngrok.io/v1)
 
Code:  `/src/index.js`

Returns:
* List of wrapped assets and their info (totalMinted, deployedAtBlock, contractAddress et el). 
* List of all transfers involving wrapped assets
* List of Uniswap pools that include the wrapped assets + all relevant trades
* Proof of Reserves (balances of main chain reserve addresses = WAsset supply)

## Client

![](https://i.imgur.com/EYWOxKP.png)

Standard react + redux dashboard which queries our API endpoint to display relevant information. Client side code still needs some cleanup code/design clean up depending on what we end up doing on the client side. 
