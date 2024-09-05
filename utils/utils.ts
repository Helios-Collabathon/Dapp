import { Persona } from "@/repository/types";

export function getApiUrl() {
    return "https://devnet-api.multiversx.com";
}

export function parseMultiversXResponse(parsedResponse: any[]): Persona {
    if (parsedResponse.length == 0) {
        return {
            adr: "",
            linked_wallets: []
        }
    }

    return parsedResponse[0] as Persona;
}