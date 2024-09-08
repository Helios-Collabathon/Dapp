import { Persona } from "@/repository/types";

export function getApiUrl() {
    return "https://devnet-api.multiversx.com";
}

export function parseMultiversXResponse(parsedResponse: any[]): Persona {
    if (parsedResponse.length == 0) {
        return {
            addr: undefined,
            chain: undefined,
            linked_wallets: undefined,
        }
    }

    return parsedResponse[0] as Persona;
}