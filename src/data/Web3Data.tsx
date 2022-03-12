import { Contract, Provider, Web3Provider } from "zksync-web3";
import contractAddresses from "../contracts/contract-address.json"
import TrophyCaseArtifact from "../contracts/TrophyCase.json"
import Web3Modal from "web3modal"


const networkIds = {
    rinkeby: 4,
    hardhat: 31337
}

const errorCodes = {
    rejected_by_user: {
        code: 4001,
        message: "Rejected by user"
    }
}

export const web3getENSName = async (provider: Provider, address: string) => {
    const name = await provider.lookupAddress(address)
    console.log("Name: ", name)
}

export const web3getGreeting = async (provider: Provider) => {
    console.log("Web3: Getting Greeting")
    const contract = new Contract(
        contractAddresses.TrophyCase,
        TrophyCaseArtifact.abi,
        provider
    )

    const tx = await contract.greet()
    return tx
}

export const web3updateGreeting = async (greeting: string, provider: Web3Provider, setTransactionInProgress: Function, setTxError: Function, setTxDone: Function) => {
    try {
        const contract = new Contract(
            contractAddresses.TrophyCase,
            TrophyCaseArtifact.abi,
            provider.getSigner()
        )

        const tx = await contract.setGreeting(greeting)

        setTransactionInProgress(tx.hash)

        await tx.wait()
    } catch (error: any) {
        let message = ""
        switch (error.code) {
            case errorCodes.rejected_by_user.code:
                message = errorCodes.rejected_by_user.message
                break
            default:
                message = error.message

        }
        setTxError(message)
        console.error(error)
    } finally {
        setTxDone()
    }
}

export const web3getSigner = async (resetState: Function, updateDappState: Function) => {
    resetState()
    const providerOptions = {
        /* See Provider Options Section */
    };

    const web3Modal = new Web3Modal({
        // network: "mainnet", // optional
        cacheProvider: true, // optional
        providerOptions // required
    });

    const instance = await web3Modal.connect();

    const provider = new Web3Provider(instance);

    const chainId = (await provider.getNetwork()).chainId

    // if (chainId !== networkIds.hardhat && chainId !== networkIds.rinkeby) { TODO: Create check for zksync or goerli
    if (false) {
        console.log("Wrong Network")
        return
    }

    // Update the Dapp state
    const address = await provider.getSigner().getAddress()
    updateDappState(address, provider)

    // Setup Callbacks
    window.ethereum.on("accountsChanged", async (accounts: string[]) => {
        await web3getSigner(resetState, updateDappState)
        console.log("Account changed", accounts);
    });

    // Subscribe to chainId change
    window.ethereum.on("chainChanged", async (chainId: number) => {
        await web3getSigner(resetState, updateDappState)
        console.log("ChainId changed", chainId);
    });

    // Subscribe to provider connection
    window.ethereum.on("connect", async (info: { chainId: number }) => {
        await web3getSigner(resetState, updateDappState)
        console.log("Connected", info);
    });

    // Subscribe to provider disconnection
    window.ethereum.on("disconnect", async (error: { code: number; message: string }) => {
        await web3getSigner(resetState, updateDappState)
        console.log("Disconnected", error);
    });

    return provider
}