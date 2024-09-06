import {
  ChainGrpcWasmApi,
  MsgExecuteContract,
  Msgs,
} from "@injectivelabs/sdk-ts";
import { IRepository } from "./repostory.interface";
import { Network, getNetworkEndpoints } from "@injectivelabs/networks";
import { encodedBase64 } from "@/utils/utils";
import { Persona, Wallet } from "./types";
import { AddPersonaMsg } from "@/blockchain/smart-contract/inj-sc";
import { MsgBroadcaster, WalletStrategy } from "@injectivelabs/wallet-ts";
import { ChainId } from "@injectivelabs/ts-types";
import { Chain, ConnectedWallet } from "@/blockchain/types/connected-wallet";

export class InjectiveRepository<T> implements IRepository<T> {
  NETWORK = Network.TestnetSentry;
  ENDPOINTS = getNetworkEndpoints(this.NETWORK);
  chainGrpcWasmApi = new ChainGrpcWasmApi(this.ENDPOINTS.grpc);

  async getPersonaFromWallet(address: string): Promise<Persona> {
    console.log(process.env.NEXT_PUBLIC_INJ_SC);
    const query_raw = {
      get_persona: { address },
    };
    const query = encodedBase64(query_raw);
    const contractState = await this.chainGrpcWasmApi.fetchSmartContractState(
      process.env.NEXT_PUBLIC_INJ_SC ?? "",
      query,
    );
    const persona: Persona = JSON.parse(
      Buffer.from(contractState.data).toString(),
    );
    return persona;
  }

  async addWallet(
    connectedWallet: ConnectedWallet,
    wallet: Wallet,
  ): Promise<{ txn: string; persona: Persona }> {
    const addPersonaMsg: AddPersonaMsg = {
      add_wallet: {
        wallet,
      },
    };
    const msg = MsgExecuteContract.fromJSON({
      sender: connectedWallet.address,
      contractAddress: process.env.NEXT_PUBLIC_INJ_SC ?? "",
      msg: addPersonaMsg,
    });

    const walletStrategy = new WalletStrategy({
      wallet: connectedWallet.provider as any,
      chainId: ChainId.Testnet,
    });

    const txn = await this.broadcastTransactionWindow(
      false,
      walletStrategy,
      msg,
      connectedWallet.address,
    );

    const persona = await this.getPersonaFromWallet(connectedWallet.address);

    return {
      txn: `https://testnet.explorer.injective.network/transaction/${txn.txHash}`,
      persona,
    };
  }

  async getPersonasFromLinkedWallet(wallet: Wallet): Promise<Persona[]> {
    console.log(`RECEIVED ${wallet.address}`);
    const query_raw = {
      get_persona_from_linked_wallet: { wallet },
    };
    const query = encodedBase64(query_raw);
    const contractState = await this.chainGrpcWasmApi.fetchSmartContractState(
      process.env.NEXT_PUBLIC_INJ_SC ?? "",
      query,
    );
    let personas: Persona[] = JSON.parse(
      Buffer.from(contractState.data).toString(),
    );

    const updatedPersonas = personas.map((persona) => {
      return {
        ...persona,
        chain: Chain.INJ,
      };
    });

    return updatedPersonas;
  }

  async broadcastTransactionWindow(
    isMainnet: boolean,
    walletStrategy: WalletStrategy,
    msg: Msgs | Msgs[],
    sender: string,
    memo?: string,
  ) {
    const chainId = isMainnet ? ChainId.Mainnet : ChainId.Testnet;

    const txn = await new MsgBroadcaster({
      walletStrategy,
      network: isMainnet ? Network.MainnetSentry : Network.TestnetSentry,
      simulateTx: true,
    }).broadcast({
      msgs: msg,
      injectiveAddress: sender,
      memo,
    });

    return txn;
  }
}
