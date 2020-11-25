const { ethers, utils } = require("ethers");
const provider = new ethers.providers.InfuraProvider("mainnet", "76fcf0c16a9f434d975f1b3b88a1c667");
const cors = require('cors')
const axios = require('axios').default;

// GraphQL client to make requests
const { request, gql } = require('graphql-request');

// Subgraph endpoints
const uniswapSubgraphURL = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2"
const wrappedSubgraphURL = "https://api.thegraph.com/subgraphs/name/taarushv/wrapped"

// All supported wrapped asset are listed here
// Adding or removing assets here would automatically update the API endpoint
const wrappedAssets = [
    {
        assetName:"WZEC",
        contractAddress: "0x4A64515E5E1d1073e83f30cB97BEd20400b66E10", // WZEC tradeable
        deployedAtBlock: 10960660
    },
    {
        assetName:"WFIL",
        contractAddress: "0x6e1A19F235bE7ED8E3369eF73b196C07257494DE", // WFIL tradeable
        deployedAtBlock: 11179306
    },
    {
        assetName:"WHNS",
        contractAddress: "0xE7344060f1da1A1f5c759faED07341dBD86D2bb0", // WHNS tradeable
        deployedAtBlock: 11006312
    },
    {
        assetName:"WXTZ",
        contractAddress: "0xA3865E64121537b5b59B5e239Db4aCBe6F36aa74", // WXTZ
        deployedAtBlock: 11180267
    },
    {
        assetName:"WXRP",
        contractAddress: "0xae6a8B826B2f42aADE211B0e11861a47aBb19A75", // WXRP
        deployedAtBlock: 11186146
    },
    {
        assetName:"WXLM",
        contractAddress: "0x219F4a1D142DFC564bD6e80c022cD29f3394A999", // WXLM
        deployedAtBlock: 11185747
    },
    {
        assetName:"WLTC",
        contractAddress: "0x53c4871322Bb47e7A24136fce291a6dcC832a294", // WLTC
        deployedAtBlock: 11185567
    },
    {
        assetName:"WBCH",
        contractAddress: "0x32A9f71ddB6d0910769bBC77838f369Fe7C6D71C", // WBCH
        deployedAtBlock: 11180685
    }
]

// Standard ERC20 abi to query via ethers
const erc20Abi = [
    // Read-Only Functions
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
    "function totalSupply() view returns (uint256)",
    "function name() view returns (string)",
    // Authenticated Functions
    "function transfer(address to, uint amount) returns (boolean)",
    // Events
    "event Transfer(address indexed from, address indexed to, uint amount)"
];

// Proof of reserves aggregator
const proofOfReservesEnabled = ["ZEC", "FIL"] // Assets that have PoR enabled

// All the addresses used for reserves
const reserveAddresses = {
    ZEC: ["t1KrtzvwmiaEDQ7ScVEKZysFmq3g97ViUFA", "t1VARtXNdP2agH8jxTFL6h4YtgJQtEmp8A8"],
    FIL: ["f1fh7hxfvy6wgvho6wnkthhr54plvq2yblv2yxwry"]
}

const wrappedReserveAddresses = {
    ZEC: "0x4A64515E5E1d1073e83f30cB97BEd20400b66E10",
    FIL: "0x6e1A19F235bE7ED8E3369eF73b196C07257494DE"
}

// Block explorers we link to in the PoR table
const blockExplorerURLs = {
    ZEC: "https://explorer.zcha.in/accounts/",
    FIL: "https://filfox.info/en/address/",
    ETH: "https://etherscan.io/token/"
}

// API endpoints we check reserve balances against
// All non-ETH chains can use this array to store the endpoint
// After adding a new endpoint here, add a if condition in getReserveAccountBalance to process the data
const AccountBalanceAPIEndpoints = {
    ZEC: "https://api.zcha.in/v2/mainnet/accounts/",
    FIL: "https://filfox.info/api/v1/address/" // /balance-stats?duration=24h&samples=1
}

// All relevant Uniswap pools for wrapped assets
// API automatically pulls pool info + trades based on this array
const wrappedUniswapPools = {
    ZEC: ["0x2590f6b37796f192a93db7206b7b6158e89c9e5e", "0xe80bbed440e8e6380216c6acc1d8ab389096e250"],
    FIL: ["0x4f9356293dda89a31a924fe1f867825b3adda4d8"],
    HNS: ["0xe71458296ce66f7e8c8df694569b519013f3bd3c"]
}

// Empty object before we populate it with information on req
var wrappedTokensInfo = []

// Get transfers of a wrapped asset by its symbol
// Source: wrapped subgraph
const getTransfers = async(symbol) => {
    const query = gql`
    {
        wrappedAssetTransfers(where:{tokenSymbol:"${symbol}"},orderBy:block) {
          from
          to
          amount
          block
          txHash
        }
    }
    `
    response = await request(wrappedSubgraphURL, query)
    return response.wrappedAssetTransfers
}

// Get mints
const getMints = async(symbol) => {
    const query = gql`
    {
        wrappedAssetTransfers(where:{tokenSymbol:"${symbol}", amount_not:"0", from:"0x0000000000000000000000000000000000000000"},orderBy:block) {
          from
          to
          amount
          block
          txHash
        }
    }
    `
    response = await request(wrappedSubgraphURL, query)
    return response.wrappedAssetTransfers
}

// Helper function to get current block #
const getBlockNo = async() => {
    const query = gql`
    {
        _meta{
          block{
            number
          }
        }
    }
    `
    response = await request(wrappedSubgraphURL, query)
    return response._meta.block.number
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

// More helper functions
const getERC20TotalSupplyFixed = async(contractAddress) => {
    const tempErc20Instance = new ethers.Contract(contractAddress, erc20Abi, provider);
    var totalSupply = (await tempErc20Instance.totalSupply())
    return (parseFloat(totalSupply)/parseFloat(10**18))
}
const getERC20TotalSupply = async(contractAddress) => {
    const tempErc20Instance = new ethers.Contract(contractAddress, erc20Abi, provider);
    var totalSupply = (await tempErc20Instance.totalSupply())
    return totalSupply.toString()
}

// Get balances of reserve accounts that store the main asset
const getReserveAccountBalance = async(symbol, address) => {
    if (symbol === "ZEC"){
        return new Promise((resolve, request)=> {
            axios.get(AccountBalanceAPIEndpoints.ZEC + address)
            .then(function (response) {
                // handle success
                resolve(response.data.balance);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })        
        })
    } else if (symbol === "FIL"){
        return new Promise((resolve, request)=> {
            axios.get(AccountBalanceAPIEndpoints.FIL + address)
            .then(function (response) {
                // handle success
                resolve(parseFloat(response.data.balance)/(10**18));
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })        
        })
    }
}

// Helper to generate PoR in the format we need
const generateProofOfReserves = async(symbol) => {
    var temp = {}
    temp.asset = symbol
    temp.wrappedContractAddress = wrappedReserveAddresses[symbol]
    temp.wrappedTotalSupply = await getERC20TotalSupplyFixed(temp.wrappedContractAddress)
    temp.wrappedSupplySource = blockExplorerURLs.ETH + wrappedReserveAddresses[symbol]
    temp.reserveAddresses = []
    // Iterate through all reserve addresses and sum them up
    for(var i=0;i<reserveAddresses[symbol].length;i++){
        temp.reserveAddresses.push({
            address: reserveAddresses[symbol][i],
            balance: await getReserveAccountBalance(symbol, reserveAddresses[symbol][i]),
            source: `https://explorer.zcha.in/accounts/${reserveAddresses[symbol][i]}`
        })
    }
    var sum = 0;
    for(var i=0; i<temp.reserveAddresses.length;i++){
        sum = sum + temp.reserveAddresses[i].balance 
    }
    temp.reserveAddressesTotalBalance = sum
    return temp
}

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

// Main function that returns all the API data
const getInfo = async () => {
    var finalAPIResponse = {}
    finalAPIResponse.version = "1.0.0"

    // Asset list
    finalAPIResponse.wrappedAssetsList = wrappedAssets

    // Individual asset events
    for(var i=0;i<finalAPIResponse.wrappedAssetsList.length;i++){
        var aName = finalAPIResponse.wrappedAssetsList[i].assetName
        
        if(aName.substring(1,4) in wrappedUniswapPools){
            var pools = wrappedUniswapPools[aName.substring(1,4)]
            finalAPIResponse[aName] = {
                // erc20 contract events
                transfers:await getTransfers(aName),
                mints: await getMints(aName),
                pools: await getTradesbyPools(pools)
            }
        } else {
            finalAPIResponse[aName] = {
                // erc20 contract events
                transfers:await getTransfers(aName),
                mints: await getMints(aName),
                pools:[]
            }
        }
        // total supply of wrapped assets
        finalAPIResponse.wrappedAssetsList[i].onUniswap = (aName.substring(1,4) in wrappedUniswapPools)
        finalAPIResponse.wrappedAssetsList[i].totalMinted = await getERC20TotalSupply(finalAPIResponse.wrappedAssetsList[i].contractAddress)
        
    }

    // Add proof of reserves
    proofOfReserves = []
    for(var i=0;i<proofOfReservesEnabled.length;i++){
        var temp = await generateProofOfReserves(proofOfReservesEnabled[i])
        proofOfReserves.push(temp)
    }
    finalAPIResponse.proofOfReserves = proofOfReserves

    return finalAPIResponse
}

// Server stuff
const express = require('express')
const app = express()
const port = 1337
app.use(cors())

app.get('/v1', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(await getInfo())
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
