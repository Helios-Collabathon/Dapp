import {
  AbiRegistry,
  Address,
  QueryRunnerAdapter,
  TransactionsFactoryConfig,
  TransactionComputer,
} from "@multiversx/sdk-core";
import {
  SmartContractQueriesController,
  SmartContractTransactionsFactory,
} from "@multiversx/sdk-core/out";
import { sendTransactions } from "@multiversx/sdk-dapp/services";
import { useTrackTransactionStatus } from "@multiversx/sdk-dapp/hooks";
import personaAbi from "./abis/identity.abi.json";
import { ApiNetworkProvider } from "@multiversx/sdk-network-providers";
import { getApiUrl, parseMultiversXResponse } from "../utils";
import { Persona, Wallet } from "@/repository/types";
import {
  SmartContractQuery,
  SmartContractQueryResponse,
} from "@multiversx/sdk-core/out/smartContractQuery";
import { ChainUtils } from "@/blockchain/types/connected-wallet";

export default class PersonaSC {
  factory!: SmartContractTransactionsFactory;
  controller!: SmartContractQueriesController;
  transactionComputer!: TransactionComputer;
  scAddress: string = process.env.NEXT_PUBLIC_MVX_SC!;

  constructor() {
    this.transactionComputer = new TransactionComputer();
    (async () => {
      let abi = AbiRegistry.create(personaAbi);
      const apiProvider = new ApiNetworkProvider(getApiUrl(), {
        clientName: "Helios",
      });
      const factoryConfig = new TransactionsFactoryConfig({
        chainID: process.env.NEXT_PUBLIC_MVX_CHAIN_ID!,
      });
      this.factory = new SmartContractTransactionsFactory({
        config: factoryConfig,
        abi: abi,
      });
      const queryRunner = new QueryRunnerAdapter({
        networkProvider: apiProvider,
      });
      this.controller = new SmartContractQueriesController({
        queryRunner: queryRunner,
        abi: abi,
      });
    })();
  }

  //----------------------------------------------
  //                   Views
  //----------------------------------------------

  public async getPersonaByWallet(address: string): Promise<Persona> {
    const query: SmartContractQuery = await this.controller.createQuery({
      contract: this.scAddress,
      function: "getPersona",
      arguments: [address],
    });

    const response: SmartContractQueryResponse =
      await this.controller.runQuery(query);
    const parsedResponse = this.controller.parseQueryResponse(response);
    const persona: Persona = parseMultiversXResponse(parsedResponse);
    persona.address = address;

    return persona;
  }

  public async getPersonasByLinkedWallet(wallet: Wallet): Promise<Persona[]> {
    const query: SmartContractQuery = this.controller.createQuery({
      contract: this.scAddress,
      function: "getPersonasByAddress",
      arguments: [ChainUtils.toString(wallet.chain!), wallet.address],
    });

    const response: SmartContractQueryResponse =
      await this.controller.runQuery(query);
    const parsedResponse = this.controller.parseQueryResponse(response);
    const personas = parsedResponse.map((response: any) =>
      parseMultiversXResponse(response),
    );

    return personas;
  }

  //----------------------------------------------
  //                   User Actions
  //----------------------------------------------

  public async addWallet(sender: Address, wallet: Wallet): Promise<Uint8Array> {
    const transaction = this.factory.createTransactionForExecute({
      sender: sender,
      contract: new Address(this.scAddress),
      function: "addWallet",
      gasLimit: BigInt(20000000),
      arguments: [ChainUtils.toString(wallet.chain!), wallet.address],
    });

    const {sessionId, _} = await sendTransactions({
      transactions: [transaction],
    });

    return sessionId;
  }

  public async removeWallet(
    sender: Address,
    wallet: Wallet,
  ): Promise<Uint8Array> {
    const transaction = await this.factory.createTransactionForExecute({
      sender: sender,
      contract: new Address(this.scAddress),
      function: "removeWallet",
      gasLimit: BigInt(20000000),
      arguments: [ChainUtils.toString(wallet.chain!), wallet.address],
    });

    const {sessionId, _} = await sendTransactions({
      transactions: [transaction],
    });

    return sessionId;
  }
}
