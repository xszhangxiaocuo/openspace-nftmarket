import {
  Cancel as CancelEvent,
  EIP712DomainChanged as EIP712DomainChangedEvent,
  List as ListEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  SetFeeTo as SetFeeToEvent,
  SetWhiteListSigner as SetWhiteListSignerEvent,
  Sold as SoldEvent
} from "../generated/NFTMarketV3/NFTMarketV3"
import { Bytes } from "@graphprotocol/graph-ts"
import {
  Cancel,
  EIP712DomainChanged,
  List,
  OwnershipTransferred,
  SetFeeTo,
  SetWhiteListSigner,
  Sold,
  OrderBook,
  FilledOrder
} from "../generated/schema"

export function handleCancel(event: CancelEvent): void {
  // 数据ID： 交易哈希 + 事件日志索引
  let entity = new Cancel(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.orderId = event.params.orderId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  let orderBook = OrderBook.load(entity.orderId)
  if (orderBook != null) {
    orderBook.cancelTxHash = entity.id
    orderBook.save()
  }

  entity.save()
}

export function handleEIP712DomainChanged(
  event: EIP712DomainChangedEvent
): void {
  let entity = new EIP712DomainChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleList(event: ListEvent): void {
  let entity = new List(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.nft = event.params.nft
  entity.tokenId = event.params.tokenId
  entity.orderId = event.params.orderId
  entity.seller = event.params.seller
  entity.payToken = event.params.payToken
  entity.price = event.params.price
  entity.deadline = event.params.deadline

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

let orderBook = new OrderBook(event.params.orderId)
orderBook.nft = entity.nft
orderBook.tokenId = entity.tokenId
orderBook.seller = entity.seller
orderBook.payToken = entity.payToken
orderBook.price = entity.price
orderBook.deadline = entity.deadline
orderBook.blockNumber = entity.blockNumber
orderBook.blockTimestamp = entity.blockTimestamp
orderBook.transactionHash = entity.transactionHash
orderBook.cancelTxHash = Bytes.fromHexString("0x")
orderBook.filledTxHash = Bytes.fromHexString("0x")
orderBook.save()

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSetFeeTo(event: SetFeeToEvent): void {
  let entity = new SetFeeTo(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.to = event.params.to

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSetWhiteListSigner(event: SetWhiteListSignerEvent): void {
  let entity = new SetWhiteListSigner(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.signer = event.params.signer

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSold(event: SoldEvent): void {
  let entity = new Sold(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.orderId = event.params.orderId
  entity.buyer = event.params.buyer
  entity.fee = event.params.fee

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  let orderBook = OrderBook.load(entity.orderId)
  if (orderBook != null) {
    orderBook.filledTxHash = entity.id
    orderBook.save()
  }

  let filledOrder = new FilledOrder(entity.orderId)
  filledOrder.buyer = entity.buyer
  filledOrder.fee = entity.fee
  filledOrder.blockNumber = entity.blockNumber
  filledOrder.blockTimestamp = entity.blockTimestamp
  filledOrder.transactionHash = entity.transactionHash
  filledOrder.order = orderBook ? orderBook.id : null
  filledOrder.save()


  entity.save()
}
