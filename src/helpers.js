// GraphQL client to query information
const { request, gql } = require('graphql-request');

// To get information about wrapped assets
const wrappedSubgraphURL = "https://api.thegraph.com/subgraphs/name/taarushv/wrapped"

// To get wrapped asset trades from the uniswap subgraph
const uniswapSubgraphURL = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2"

// Returns all the wrapped assets
// Alternatively, you can use wrappedAsset(where:{tokenSymbol: "WZEC"}){} to get individual token info
const getWrappedAssets = async() => {
    const query = gql`
    {
        wrappedAssets {
          id
          tokenSymbol
          tokenName
          decimals
          contractAddress
          initTxHash
          initialSupply
        }
      }      
    `
    const res = await request(wrappedSubgraphURL, query)
    return res
}

// Returns how many tokens have been minted for each wrapped asset
// aka total supply of the WERC20 token
// Alternatively, you can use wrappedAssetSupply(where:{tokenSymbol: "WZEC"}){} to get individual token supply
const getWrappedAssetSupplies = async() => {
    const query = gql`
    {
        wrappedAssetSupplies{
          id
          tokenSymbol
          decimals
          currentSupply
        }
      }          
    `
    const res = await request(wrappedSubgraphURL, query)
    return res
}

// Returns all unique "mints"
// Alternatively, you can use wrappedAssetMint(where:{tokenSymbol: "WZEC"}){} to get individual mints
const getWrappedAssetMints = async() => {
    const query = gql`
    {
        wrappedAssetMints{
          id
          tokenSymbol
          to
          amount
          block
          txHash
        }
      }      
    `
    const res = await request(wrappedSubgraphURL, query)
    return res
}

// Returns all ERC20 transfers for wrapped assets
// This includes minting (0x0 => 0xabc), burning (0xabc => 0x0), and other higher order transfers (like swaps)
// Alternatively, you can use wrappedAssetTransfer(where:{tokenSymbol: "WZEC"}){} to get individual transfers
const getWrappedAssetTransfers = async() => {
    const query = gql`
    {
        wrappedAssetTransfers{
          id
          tokenSymbol
          from
          to
          amount
          block
          txHash
        }
      }         
    `
    const res = await request(wrappedSubgraphURL, query)
    return res
}

// For uniswap v2 trades of wrapped assets

const wrappedUniswapPools = [
        "0x2590f6b37796f192a93db7206b7b6158e89c9e5e", // WZEC-USDC
        "0xe80bbed440e8e6380216c6acc1d8ab389096e250", // WZEC-USDT
        "0x4f9356293dda89a31a924fe1f867825b3adda4d8", // WFIL-USDC
        "0xe71458296ce66f7e8c8df694569b519013f3bd3c"  // WHNS-ETH
]

const getUniswapPoolInfo = async(poolAddress) => {
    const query = gql`
    {
        pairs(where:{id:"${poolAddress}"}){
          token0{
            symbol
          }
          token1{
            symbol
          }
          token0Price
          token1Price
          reserve0
          reserve1
          createdAtBlockNumber
        }
    }
    `
    response = await request(uniswapSubgraphURL, query)
    return response.pairs[0]
}


// Get Trades on uniswap
const getUniswapTrades = async(poolAddress) => {
    const query = gql`
    {
        swaps(where:{pair:"${poolAddress}"},orderBy:timestamp){
          pair{
            token0{
              symbol
            }
            token1{
              symbol
            }
          }
          amount0In
          amount1In
          amount0Out
          amount1Out
          amountUSD
          transaction{
              id
          }
          timestamp
        }
    }
    `
    response = await request(uniswapSubgraphURL, query)
    var finalResponse = []
    // Iterate through all the swaps for a given pool
    for(var i=0;i<response.swaps.length;i++){
        var value = response.swaps[i]
        var temp = {}
        // Store tx info
        temp.txHash = value.transaction.id
        temp.timestamp = value.timestamp
        // Check if the swap is A=>B or B=>A
        if(value.amount0In === '0'){
            temp.assetBought = value.pair.token0.symbol
            temp.amountBought = value.amount0Out
            temp.assetSold = value.pair.token1.symbol
            temp.amountSold = value.amount1In
        }else {
            // This is when amount0Out is 0
            temp.assetBought = value.pair.token1.symbol
            temp.amountBought = value.amount1Out
            temp.assetSold = value.pair.token0.symbol
            temp.amountSold = value.amount0In
        }
        finalResponse.push(temp)
    }
    return finalResponse
}

// Iterate through all the pools for a given asset and return trades
const getTradesbyPools = async(pools) => {
    const temp = []
    for(i=0;i<pools.length;i++){
        //console.log(pools[i])
        temp.push({
            poolAddress: pools[i],
            poolInfo: await getUniswapPoolInfo(pools[i]),
            trades: await getUniswapTrades(pools[i])
        })
    }
    return temp
}