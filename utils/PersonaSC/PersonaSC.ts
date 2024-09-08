import {
  AbiRegistry,
  Address,
  QueryRunnerAdapter,
  TransactionHash,
  TransactionsFactoryConfig,
} from "@multiversx/sdk-core";
import {
  SmartContractQueriesController,
  SmartContractTransactionsFactory,
} from "@multiversx/sdk-core/out";
import { sendTransactions } from "@multiversx/sdk-dapp/services";
import personaAbi from "./abis/identity.abi.json";
import { ApiNetworkProvider } from "@multiversx/sdk-network-providers";
import { getApiUrl, parseMultiversXResponse } from "../utils";
import { Persona, Wallet } from "@/repository/types";
import {
  SmartContractQuery,
  SmartContractQueryResponse,
} from "@multiversx/sdk-core/out/smartContractQuery";
import { Chain } from "@/blockchain/types/connected-wallet";

export default class PersonaSC {
  factory!: SmartContractTransactionsFactory;
  controller!: SmartContractQueriesController;
  scAddress: string =
    "erd1qqqqqqqqqqqqqpgq6xwqc9w99t5m0ezqxyq6yrcje4v3nxxudy7s97x3qx";

  constructor() {
    (async () => {
      let abi = AbiRegistry.create(personaAbi);
      const apiProvider = new ApiNetworkProvider(getApiUrl());
      const factoryConfig = new TransactionsFactoryConfig({
        chainID: "D",
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
      arguments: [wallet.chain, wallet.address],
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

  public async addWallet(
    sender: Address,
    wallet: Wallet,
  ): Promise<TransactionHash> {
    console.log(wallet);
    const transaction = this.factory.createTransactionForExecute({
      sender: sender,
      contract: new Address(this.scAddress),
      function: "addWallet",
      gasLimit: BigInt(20000000),
      arguments: [wallet.chain, wallet.address],
    });

    await sendTransactions({
      transactions: [transaction],
    });

    return transaction.getHash();
  }

  public async removeWallet(
    sender: Address,
    wallet: Wallet,
  ): Promise<TransactionHash> {
    const transaction = await this.factory.createTransactionForExecute({
      sender: sender,
      contract: new Address(this.scAddress),
      function: "removeWallet",
      gasLimit: BigInt(20000000),
      arguments: [wallet.chain, wallet.address],
    });

    await sendTransactions({
      transactions: [transaction],
    });

    return transaction.getHash();
  }
}
