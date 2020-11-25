import { Transfer, Initialize1Call, TokenSoftToken } from '../generated/WZEC/TokenSoftToken'
import { WrappedAsset, WrappedAssetTransfer, WrappedAssetSupply, WrappedAssetMint } from '../generated/schema'
import { Address } from '@graphprotocol/graph-ts';

// Helper to get the latest minted supply of a wrapped asset
const getAssetCurrentSupply = function (e: Address): string {
  let erc20Contract = TokenSoftToken.bind(e)
  let currentSupply = erc20Contract.totalSupply().toString()
  return currentSupply;
};

// This is executed every time a wrapped ERC20 is initialized
export function handleInit(call:Initialize1Call) : void {
  let initCall = new WrappedAsset(call.inputs.symbol.toString())
  initCall.tokenSymbol = call.inputs.symbol.toString()
  initCall.tokenName = call.inputs.name.toString()
  initCall.decimals = call.inputs.decimals
  initCall.contractAddress = call.to.toHexString()
  initCall.initTxHash = call.transaction.hash.toHexString()
  initCall.initialSupply = call.inputs.initialSupply.toString()
  initCall.save()
}

// Handles all transfers for WZEC
export function handleZECTransfer(event: Transfer): void {
  // Every time a transfer is made, we update the total supply
  let supplyEntity = new WrappedAssetSupply("WZEC")
  supplyEntity.tokenSymbol = "WZEC"
  supplyEntity.decimals = 18
  supplyEntity.currentSupply = getAssetCurrentSupply(event.address)
  supplyEntity.save()

  // Log transfer entities
  let transferEvent = new WrappedAssetTransfer(event.transaction.hash.toHexString())
  transferEvent.tokenSymbol = "WZEC"
  transferEvent.from = event.params.from.toHexString()
  transferEvent.to = event.params.to.toHexString()
  transferEvent.amount = event.params.value.toString()
  transferEvent.block = event.block.number.toI32()
  transferEvent.txHash = event.transaction.hash.toHexString()
  transferEvent.save()

  // See if the transfer is a mint
  if (event.params.from.toHexString() == "0x0000000000000000000000000000000000000000" && event.params.value.toString() != "0"){
    let mintEvent = new WrappedAssetMint(event.transaction.hash.toHexString())
    mintEvent.tokenSymbol = "WZEC"
    mintEvent.to = event.params.to.toHexString()
    mintEvent.amount = event.params.value.toString()
    mintEvent.block = event.block.number.toI32()
    mintEvent.txHash = event.transaction.hash.toHexString()
    mintEvent.save()
  }
}
export function handleFILTransfer(event: Transfer): void {
  let supplyEntity = new WrappedAssetSupply("WFIL")
  supplyEntity.tokenSymbol = "WFIL"
  supplyEntity.decimals = 18
  supplyEntity.currentSupply = getAssetCurrentSupply(event.address)
  supplyEntity.save()
  let transferEvent = new WrappedAssetTransfer(event.transaction.hash.toHexString())
  transferEvent.tokenSymbol = "WFIL"
  transferEvent.from = event.params.from.toHexString()
  transferEvent.to = event.params.to.toHexString()
  transferEvent.amount = event.params.value.toString()
  transferEvent.block = event.block.number.toI32()
  transferEvent.txHash = event.transaction.hash.toHexString()
  transferEvent.save()

  // See if the transfer is a mint
  if (event.params.from.toHexString() == "0x0000000000000000000000000000000000000000" && event.params.value.toString() != "0"){
    let mintEvent = new WrappedAssetMint(event.transaction.hash.toHexString())
    mintEvent.tokenSymbol = "WFIL"
    mintEvent.to = event.params.to.toHexString()
    mintEvent.amount = event.params.value.toString()
    mintEvent.block = event.block.number.toI32()
    mintEvent.txHash = event.transaction.hash.toHexString()
    mintEvent.save()
  }
}

// Template to add new wrapped assets to the subgraph
/*
export function handleHNSTransfer(event: Transfer): void {
  let supplyEntity = new WrappedAssetSupply("WHNS")
  supplyEntity.tokenSymbol = "WHNS"
  supplyEntity.decimals = 18
  supplyEntity.currentSupply = getAssetCurrentSupply(event.address)
  supplyEntity.save()
  let transferEvent = new WrappedAssetTransfer(event.transaction.hash.toHexString())
  transferEvent.tokenSymbol = "WHNS"
  transferEvent.from = event.params.from.toHexString()
  transferEvent.to = event.params.to.toHexString()
  transferEvent.amount = event.params.value.toString()
  transferEvent.block = event.block.number.toI32()
  transferEvent.txHash = event.transaction.hash.toHexString()
  transferEvent.save()

  // See if the transfer is a mint
  if (event.params.from.toHexString() == "0x0000000000000000000000000000000000000000" && event.params.value.toString() != "0"){
    let mintEvent = new WrappedAssetMint(event.transaction.hash.toHexString())
    mintEvent.tokenSymbol = "WHNS"
    mintEvent.to = event.params.to.toHexString()
    mintEvent.amount = event.params.value.toString()
    mintEvent.block = event.block.number.toI32()
    mintEvent.txHash = event.transaction.hash.toHexString()
    mintEvent.save()
  }
}

*/