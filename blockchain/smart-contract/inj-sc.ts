import { Wallet } from "@/repository/types";
import { Chain } from "../types/connected-wallet";

export type AddPersonaMsg = {
  add_wallet: {
    wallet: Wallet;
  };
};
