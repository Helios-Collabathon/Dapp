import { faXTwitter, IconDefinition } from "@fortawesome/free-brands-svg-icons";
import { faBook, faScrewdriverWrench } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { Heading } from "./features/controls/Heading";

export default function Home() {
  return (
    <>
      <section className="p-4 text-center sm:p-8 md:p-12">
        <Heading>
          Welcome to Helios Connect: The Future of Cross-Chain Verification.
        </Heading>
        <p>
          An open-source project from the Helios Collabathon! Explore our
          features or contribute to the project.
        </p>
      </section>
      <section className="mx-auto max-w-5xl px-4 py-16 text-center text-black dark:text-white">
        <h2 className="mb-8 text-3xl font-bold">Key Features</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col items-center rounded-lg border border-gray-300 p-6 shadow-lg dark:border-neutral-700 dark:bg-neutral-800/30">
            <h3 className="mb-4 text-2xl font-semibold">
              Cross-Chain Identity Verification
            </h3>
            <p className="text-sm opacity-70">
              Helios Connect enables seamless verification of user identities
              across multiple blockchain ecosystems. This cross-chain
              compatibility connects wallets on MultiversX and Injective, laying
              the groundwork for expansion into other chains.
            </p>
          </div>
          <div className="flex flex-col items-center rounded-lg border border-gray-300 p-6 shadow-lg dark:border-neutral-700 dark:bg-neutral-800/30">
            <h3 className="mb-4 text-2xl font-semibold">
              Open-Source Innovation
            </h3>
            <p className="text-sm opacity-70">
              As an open-source project, Helios Connect empowers the community
              to build upon its foundation. Developers can contribute to the
              ongoing evolution of the dApp, fostering innovation across the
              Web3 space.
            </p>
          </div>
          <div className="flex flex-col items-center rounded-lg border border-gray-300 p-6 shadow-lg dark:border-neutral-700 dark:bg-neutral-800/30">
            <h3 className="mb-4 text-2xl font-semibold">
              Future-Proof & Scalable
            </h3>
            <p className="text-sm opacity-70">
              Designed with scalability in mind, Helios Connect will support
              additional blockchain ecosystems beyond MultiversX and Injective,
              ensuring long-term utility in an ever-expanding Web3 environment.
            </p>
          </div>
        </div>
      </section>
      <div className="mx-auto mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-3 lg:text-left">
        <LinkCard
          title="Get Involved"
          description="Contribute to the project, explore the codebase, and help us shape the future of cross-chain verification dApp."
          icon={faScrewdriverWrench}
          href="####"
        />
        <LinkCard
          title="Documentation"
          description="Read our documentation to learn how to use and contribute to Helios Connect."
          icon={faBook}
          href="####"
        />
        <LinkCard
          title="Socials"
          description="Follow @HeliosStaking to stay updated with the latest developments and community news."
          icon={faXTwitter}
          href="https://twitter.com/HeliosStaking"
        />
      </div>
    </>
  );
}

function LinkCard(props: {
  title: string;
  description: string;
  icon: IconDefinition;
  href: string;
}) {
  return (
    <Link
      href={props.href}
      className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
      target="_blank"
      rel="noopener noreferrer"
    >
      <h2 className="mb-2 text-2xl font-semibold">
        <span className="mr-2 inline-block">{props.title}</span>
        <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
          <FontAwesomeIcon icon={props.icon} className="opacity-80" />
        </span>
      </h2>
      <p className="m-0 max-w-[30ch] text-sm opacity-50">{props.description}</p>
    </Link>
  );
}
