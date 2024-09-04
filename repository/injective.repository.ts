import { ChainGrpcBankApi, ChainGrpcWasmApi } from "@injectivelabs/sdk-ts";
import { IRepository } from "./repostory.interface";
import { Network, getNetworkEndpoints } from "@injectivelabs/networks";
import { encodedBase64 } from "@/utils/utils";
import { Persona } from "./types";

export class InjectiveRepository<T> implements IRepository<T> {
  async getPersonaFromWallet(address: string): Promise<Persona> {
    const NETWORK = Network.TestnetSentry;
    const ENDPOINTS = getNetworkEndpoints(NETWORK);
    const chainGrpcWasmApi = new ChainGrpcWasmApi(ENDPOINTS.grpc);
    const query_raw = {
      get_persona: { address },
    };
    const query = encodedBase64(query_raw);
    const contractState = await chainGrpcWasmApi.fetchSmartContractState(
      "inj1wffzkwtnr5wjzr32mnjcj9qm402enjtcmnavxj",
      query
    );
    const persona: Persona = JSON.parse(
      Buffer.from(contractState.data).toString()
    );
    return persona;
  }
  getPersonasFromLinkedWallet(): Promise<{ data: T[] }> {
    throw new Error("Method not implemented.");
  }
}
