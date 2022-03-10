import { Contract, Web3Provider } from "zksync-web3";

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

export const mintDegenGambler = async (amount: number, provider: any, setTransactionInProgress: Function, setTxError: Function, setTxDone: Function) => {
    try {
        const contract = new Contract(
            contractAddresses.TrophyCase,
            TrophyCaseArtifact.abi,
            provider.getSigner(0)
        )

        const price = await contract.mintPrice(amount)

        const tx = await contract.mint(amount, false, { value: price })

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

export const initializeEthers = async (resetState: Function, updateDappState: Function) => {
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
    if(false) {
        console.log("Wrong Network")
        return
    }

    // Setup Callbacks
    window.ethereum.on("accountsChanged", async (accounts: string[]) => {
        await initializeEthers(resetState, updateDappState)
        console.log("Account changed", accounts);
    });

    // Subscribe to chainId change
    window.ethereum.on("chainChanged", async (chainId: number) => {
        await initializeEthers(resetState, updateDappState)
        console.log("ChainId changed", chainId);
    });

    // Subscribe to provider connection
    window.ethereum.on("connect", async (info: { chainId: number }) => {
        await initializeEthers(resetState, updateDappState)
        console.log("Connected", info);
    });

    // Subscribe to provider disconnection
    window.ethereum.on("disconnect", async (error: { code: number; message: string }) => {
        await initializeEthers(resetState, updateDappState)
        console.log("Disconnected", error);
    });

    const address = await provider.getSigner().getAddress()
    updateDappState(address, provider)

    return provider
}