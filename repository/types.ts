import { Chain } from "@/blockchain/types/connected-wallet";

export type Wallet = {
    chain: Chain;
    address: string;
};

export type Persona = {
    adr: string,
    linked_wallets: Wallet[];
};