import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 text-center text-lg font-bold backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Welcome to Helios Connect: The Future of Cross-Chain Verification. An open-source project from the Helios Collabathon! Explore our features or contribute to the project.
        </h1>
      </div>

      <div className="relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>

      <section className="w-full max-w-5xl px-4 py-16 text-center">
        <h2 className="mb-8 text-3xl font-bold">Key Features</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col items-center p-6 border border-gray-300 rounded-lg shadow-lg dark:border-neutral-700 dark:bg-neutral-800/30">
            <h3 className="text-2xl font-semibold mb-4">Cross-Chain Identity Verification</h3>
            <p className="text-sm opacity-70">
              Helios Connect enables seamless verification of user identities across multiple blockchain ecosystems. This cross-chain compatibility connects wallets on MultiversX and Injective, laying the groundwork for expansion into other chains.
            </p>
          </div>

          <div className="flex flex-col items-center p-6 border border-gray-300 rounded-lg shadow-lg dark:border-neutral-700 dark:bg-neutral-800/30">
            <h3 className="text-2xl font-semibold mb-4">Open-Source Innovation</h3>
            <p className="text-sm opacity-70">
              As an open-source project, Helios Connect empowers the community to build upon its foundation. Developers can contribute to the ongoing evolution of the dApp, fostering innovation across the Web3 space.
            </p>
          </div>

          <div className="flex flex-col items-center p-6 border border-gray-300 rounded-lg shadow-lg dark:border-neutral-700 dark:bg-neutral-800/30">
            <h3 className="text-2xl font-semibold mb-4">Future-Proof & Scalable</h3>
            <p className="text-sm opacity-70">
              Designed with scalability in mind, Helios Connect will support additional blockchain ecosystems beyond MultiversX and Injective, ensuring long-term utility in an ever-expanding Web3 environment.
            </p>
          </div>
        </div>
      </section>

      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-3 lg:text-left">
        <a
          href="https://github.com/your-repo"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Get Involved{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Contribute to the project, explore the codebase, and help us shape the future of cross-chain verification dApp.
          </p>
        </a>

        <a
          href="https://github.com/your-repo/wiki"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Documentation{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Read our documentation to learn how to use and contribute to Helios Connect.
          </p>
        </a>

        <a
          href="https://twitter.com/HeliosStaking"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Twitter{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Follow @HeliosStaking to stay updated with the latest developments and community news.
          </p>
        </a>
      </div>
    </main>
  );
}
