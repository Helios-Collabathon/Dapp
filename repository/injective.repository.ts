import {
  BaseAccount,
  ChainGrpcBankApi,
  ChainGrpcWasmApi,
  ChainRestAuthApi,
  ChainRestTendermintApi,
  CosmosTxV1Beta1Tx,
  createTxRawEIP712,
  createWeb3Extension,
  DEFAULT_STD_FEE,
  getEip712TypedData,
  getEthereumAddress,
  hexToBase64,
  hexToBuff,
  MsgExecuteContractCompat,
  Msgs,
  recoverTypedSignaturePubKey,
  SIGN_AMINO,
  TxGrpcApi,
} from '@injectivelabs/sdk-ts'
import { IRepository } from './repository.interface'
import { Network, getNetworkEndpoints } from '@injectivelabs/networks'
import { encodedBase64 } from '@/utils/utils'
import { Persona, Wallet } from './types'
import { AddWalletMsg, RemoveWalletMsg } from '@/blockchain/smart-contract/inj-sc'
import { MsgBroadcaster, WalletStrategy } from '@injectivelabs/wallet-ts'
import { ChainId, EthereumChainId } from '@injectivelabs/ts-types'
import { Chain, ConnectedWallet } from '@/blockchain/types/connected-wallet'
import { createTransaction, TxRestClient } from '@injectivelabs/sdk-ts'
import { BigNumberInBase, DEFAULT_BLOCK_TIMEOUT_HEIGHT } from '@injectivelabs/utils'
export class InjectiveRepository<T> implements IRepository<T> {
  NETWORK = process.env.NEXT_PUBLIC_NETWORK === 'mainnet' ? Network.MainnetSentry : Network.TestnetSentry
  ENDPOINTS = getNetworkEndpoints(this.NETWORK)
  chainGrpcWasmApi = new ChainGrpcWasmApi(this.ENDPOINTS.grpc)
  chainGrpcBankApi = new ChainGrpcBankApi(this.ENDPOINTS.grpc)
  explorerEndpoint = process.env.NEXT_PUBLIC_NETWORK === 'mainnet' ? 'https://explorer.injective.network' : 'https://testnet.explorer.injective.network'
  chainId = process.env.NEXT_PUBLIC_NETWORK === 'mainnet' ? ChainId.Mainnet : ChainId.Testnet

  async getBalance(address: string): Promise<number> {
    const b = await this.chainGrpcBankApi.fetchBalance({
      accountAddress: address,
      denom: 'inj',
    })

    return Number((parseInt(b.amount) / Math.pow(10, 18)).toFixed(3))
  }

  async getPersonaFromWallet(address: string): Promise<Persona> {
    const query_raw = {
      get_persona: { address },
    }
    const query = encodedBase64(query_raw)
    const contractState = await this.chainGrpcWasmApi.fetchSmartContractState(process.env.NEXT_PUBLIC_INJ_SC!, query)
    const persona: Persona = JSON.parse(Buffer.from(contractState.data).toString())
    return persona
  }

  async getPersonasFromLinkedWallet(wallet: Wallet): Promise<Persona[]> {
    const query_raw = {
      get_persona_from_linked_wallet: { wallet },
    }
    const query = encodedBase64(query_raw)
    const contractState = await this.chainGrpcWasmApi.fetchSmartContractState(process.env.NEXT_PUBLIC_INJ_SC ?? '', query)
    let personas: Persona[] = JSON.parse(Buffer.from(contractState.data).toString())

    const updatedPersonas = personas
      .map((persona) => {
        return {
          ...persona,
          chain: Chain.Injective,
        }
      })
      .filter((persona) => persona.address !== wallet.address)

    return updatedPersonas
  }

  async addWallet(connectedWallet: ConnectedWallet, wallet: Wallet): Promise<{ txn: string; persona: Persona }> {
    const addPersonaMsg: AddWalletMsg = {
      add_wallet: {
        wallet,
      },
    }

    const msg = MsgExecuteContractCompat.fromJSON({
      sender: connectedWallet.address,
      contractAddress: process.env.NEXT_PUBLIC_INJ_SC!,
      msg: addPersonaMsg,
    })

    const walletStrategy = new WalletStrategy({
      wallet: connectedWallet.provider as any,
      chainId: this.chainId,
      ethereumOptions: {
        ethereumChainId: EthereumChainId.Mainnet,
      },
    })

    let txn
    if (connectedWallet.provider === 'metamask')
      txn = await this.broadcastEthTxn(process.env.NEXT_PUBLIC_NETWORK === 'mainnet', walletStrategy, msg, connectedWallet.address)
    else txn = await this.broadcastTransactionWindow(process.env.NEXT_PUBLIC_NETWORK === 'mainnet', walletStrategy, msg, connectedWallet.address)

    const persona = await this.getPersonaFromWallet(connectedWallet.address)

    return {
      txn: `${this.explorerEndpoint}/transaction/${txn?.txHash}`,
      persona,
    }
  }

  async removeWallet(connectedWallet: ConnectedWallet, wallet: Wallet): Promise<{ txn: string; persona: Persona }> {
    const removeWalletMsg: RemoveWalletMsg = {
      remove_wallet: {
        wallet,
      },
    }
    const msg = MsgExecuteContractCompat.fromJSON({
      sender: connectedWallet.address,
      contractAddress: process.env.NEXT_PUBLIC_INJ_SC!,
      msg: removeWalletMsg,
    })

    const walletStrategy = new WalletStrategy({
      wallet: connectedWallet.provider as any,
      chainId: ChainId.Mainnet,
      ethereumOptions: {
        ethereumChainId: 1,
      },
    })

    let txn
    if (connectedWallet.provider === 'metamask')
      txn = await this.broadcastEthTxn(process.env.NEXT_PUBLIC_NETWORK === 'mainnet', walletStrategy, msg, connectedWallet.address)
    else txn = await this.broadcastTransactionWindow(process.env.NEXT_PUBLIC_NETWORK === 'mainnet', walletStrategy, msg, connectedWallet.address)

    const persona = await this.getPersonaFromWallet(connectedWallet.address)

    return {
      txn: `${this.explorerEndpoint}/transaction/${txn?.txHash}`,
      persona,
    }
  }

  async broadcastTransactionWindow(isMainnet: boolean, walletStrategy: WalletStrategy, msg: Msgs | Msgs[], sender: string, memo?: string) {
    const chainId = isMainnet ? ChainId.Mainnet : ChainId.Testnet

    const txn = await new MsgBroadcaster({
      walletStrategy,
      network: isMainnet ? Network.MainnetSentry : Network.TestnetSentry,
      simulateTx: false,
    }).broadcast({
      msgs: msg,
      injectiveAddress: sender,
      memo,
    })

    return txn
  }

  async broadcastEthTxn(isMainnet: boolean, walletStrategy: WalletStrategy, msg: Msgs | Msgs[], sender: string) {
    const endpoints = getNetworkEndpoints(isMainnet ? Network.MainnetSentry : Network.TestnetSentry)
    const chainRestAuthApi = new ChainRestAuthApi(endpoints.rest)
    const chainRestTendermintApi = new ChainRestTendermintApi(endpoints.rest)
    const accountDetailsResponse = await chainRestAuthApi.fetchAccount(sender)
    const baseAccount = BaseAccount.fromRestApi(accountDetailsResponse)
    const accountDetails = baseAccount.toAccountDetails()

    const latestBlock = await chainRestTendermintApi.fetchLatestBlock()
    const latestHeight = latestBlock.header.height
    const timeoutHeight = new BigNumberInBase(latestHeight).plus(DEFAULT_BLOCK_TIMEOUT_HEIGHT)

    const eip712TypedData = getEip712TypedData({
      msgs: msg,
      tx: {
        memo: '',
        accountNumber: accountDetails.accountNumber.toString(),
        sequence: accountDetails.sequence.toString(),
        timeoutHeight: timeoutHeight.toFixed(),
        chainId: ChainId.Mainnet,
      },
      ethereumChainId: 1,
    })

    const signature = (await walletStrategy.signEip712TypedData(JSON.stringify(eip712TypedData), getEthereumAddress(sender))) as string
    const signatureBuff = hexToBuff(signature) as any

    /** Get Public Key of the signer */
    const publicKeyHex = recoverTypedSignaturePubKey(eip712TypedData, signature)
    const publicKeyBase64 = hexToBase64(publicKeyHex)
    const { txRaw } = createTransaction({
      message: msg,
      signMode: SIGN_AMINO,
      fee: DEFAULT_STD_FEE,
      pubKey: publicKeyBase64 /* From previous step */,
      accountNumber: accountDetails.accountNumber,
      sequence: accountDetails.sequence,
      timeoutHeight: Number(timeoutHeight),
      chainId: isMainnet ? ChainId.Mainnet : ChainId.Testnet,
    })

    const web3Extension = createWeb3Extension({
      ethereumChainId: EthereumChainId.Mainnet,
    })
    const txRawEip712 = createTxRawEIP712(txRaw, web3Extension)

    await this.simulateTxRaw(isMainnet, txRawEip712)

    txRawEip712.signatures = [signatureBuff]

    const response = await new TxGrpcApi(endpoints.grpc).broadcast(txRawEip712)
    return response
  }

  async simulateTxRaw(isMainnet: boolean, txRaw: CosmosTxV1Beta1Tx.TxRaw) {
    const endpoints = getNetworkEndpoints(isMainnet ? Network.MainnetSentry : Network.TestnetSentry)

    txRaw.signatures = [new Uint8Array(0)]

    const simulationResponse = await new TxGrpcApi(endpoints.grpc).simulate(txRaw)

    return simulationResponse
  }
}
