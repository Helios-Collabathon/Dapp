'use client';

import { Chain } from "@/blockchain/types/connected-wallet";
import PersonaSC from "@/utils/PersonaSC/PersonaSC";

export default function TestButton() {
    const personaSC = new PersonaSC();

    const getPersona = async () => {
        const persona = await personaSC.getPersonaByWallet("erd13x29rvmp4qlgn4emgztd8jgvyzdj0p6vn37tqxas3v9mfhq4dy7shalqrx");
        console.log(persona);
    };

    const getPersonas = async () => {
        const personas = await personaSC.getPersonasByLinkedWallet(Chain.MVX, "erd1qyu5wthldzr8wx5c9ucg8kjagg0jfs53s8nr3zpz3hypefsdd8ssycr6th");
        console.log(personas);
    }

    return (
        <button style={{height: "20px", border: "1px solid black", background: "#eee", padding: "25px", display: "flex", alignItems: "center"}} 
          onClick={async () => getPersonas}
        >
          <span>test</span>
        </button>
    )
}