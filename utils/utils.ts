import { Chain } from "@/blockchain/types/connected-wallet";
import { Persona } from "@/repository/types";

export function encodedBase64(obj: any) {
  return Buffer.from(JSON.stringify(obj)).toString("base64");
}

export function getApiUrl() {
  return "https://devnet-api.multiversx.com";
}

export function parseMultiversXResponse(parsedResponse: any): Persona {
  return (
    parsedResponse[0] ?? {
      address: "",
      chain: Chain.MultiversX,
      linked_wallets: [],
    }
  );
}

export function getChainByAddress(address: string): Chain {
  switch (true) {
    case address.startsWith("inj1"):
      return Chain.Injective;
    case address.startsWith("erd1"):
      return Chain.MultiversX;
    default:
      throw new Error("Unsupported chain or invalid address");
  }
}
