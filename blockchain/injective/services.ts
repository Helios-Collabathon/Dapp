import { ChainGrpcBankApi, ChainGrpcWasmApi } from '@injectivelabs/sdk-ts'
import { Network, getNetworkEndpoints } from '@injectivelabs/networks'
import { MsgBroadcaster } from '@injectivelabs/wallet-ts'
import { walletStrategy } from './wallet'

export const NETWORK = Network.TestnetSentry
export const ENDPOINTS = getNetworkEndpoints(NETWORK)

export const WasmAPI = new ChainGrpcWasmApi(ENDPOINTS.grpc)
export const BankAPI = new ChainGrpcBankApi(ENDPOINTS.grpc)

export const BroadcastClient = new MsgBroadcaster({
  walletStrategy,
  network: NETWORK,
})
