import { APP_IMAGES } from "@/app/app-images";
import { InjectiveRepository } from "@/repository/injective.repository";
import { MultiversXRepository } from "@/repository/multiversx.repository";
import { IRepository } from "@/repository/repository.interface";
import { Persona } from "@/repository/types";

export enum Chain {
  Injective = "injective",
  MultiversX = "multivers_x",
}

export const ChainUtils = {
  toString(chain: Chain): string {
    if (chain === "injective") return "Injective";
    else return "MultiversX";
  },

  fromString(chain: string): Chain {
    if (chain === "Injective") return Chain.Injective;
    else return Chain.MultiversX;
  },

  getLogo(chain: string) {
    switch (chain) {
      case Chain.Injective:
        return APP_IMAGES.INGLogo;
      case Chain.MultiversX:
        return APP_IMAGES.egldLogo;
    }
    return "";
  },

  getRepository(chain: Chain): IRepository<Persona> {
    switch (chain) {
      case Chain.Injective:
        return new InjectiveRepository();
      case Chain.MultiversX:
        return new MultiversXRepository();
    }
  },
};

export type ConnectedWallet = {
  address: string;
  chain: Chain;
  provider: string;
};
