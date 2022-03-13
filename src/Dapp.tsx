import React, { useEffect, useState } from "react"
import { AlertView } from "./view/AlertView"
import { web3getENSName, web3getGreeting, web3getSigner, web3updateGreeting } from "./data/Web3Data"
import { GreetingContainer } from "./container/GreetingContainer"
import { Provider, Web3Provider } from "zksync-web3"
import { WalletView } from "./view/WalletView"

export const Dapp = () => {
    const [wallet, setWallet] = useState<{ address: string, name: string, connected: boolean, provider: Web3Provider | null }>({ address: "", name: "", connected: false, provider: null })
    const [alertState, setAlertState] = useState({ message: "", dismissed: true, type: "" })
    const [zksyncProvider] = useState(new Provider("https://zksync2-testnet.zksync.dev"))
    const [L1Provider] = useState(new Provider("https://mainnet.infura.io/v3/1aac0bdb650849a799a2a5ee75829dd1"))
    const [greeting, setGreeting] = useState("")
    const [loading, setLoading] = useState(true)

    // Get greeting on app load
    useEffect(() => {
        async function updateGreetingState() {
            // You can await here
            const greeting = await web3getGreeting(zksyncProvider)
            setGreeting(greeting)
            setLoading(false)
        }
        updateGreetingState();
    }, [zksyncProvider]) // Runs only once

    const AlertComponent = () => {
        const dismissTx = () => {
            setAlertState({ message: "", dismissed: true, type: "" })
        }

        return (
            AlertView(
                alertState.type,
                alertState.message,
                alertState.dismissed,
                dismissTx
            )
        )
    }

    const WalletComponent = () => {
        const resetWalletState = () => {
            setWallet({ address: "", name: "", connected: false, provider: null })
        }

        const connectWallet = async () => {
            if (wallet.connected) {
                resetWalletState()
            } else {
                const updateDappWalletState = async (address: string, provider: Web3Provider) => {
                    // Once wallet is connected the state to reflect that
                    setWallet({ address, name: address, connected: true, provider })

                    // Then check for ENS name
                    const name = await web3getENSName(L1Provider, address)

                    if(name !== address) {
                        setWallet({ address, name, connected: true, provider })
                    }
                }

                await web3getSigner(resetWalletState, updateDappWalletState)
            }
        }

        return (
            WalletView(
                wallet.connected,
                wallet.name,
                connectWallet
            )
        )
    }

    const GreetingComponent = () => {
        const provider = wallet.provider

        if (provider) {
            // Define functions to update the Dapp's state based on Tx status
            const setTxError = () => {
                setAlertState({ message: "Transaction error", dismissed: false, type: "error" })
                return
            }

            const setTxInProgress = () => {
                setAlertState({ message: "Transaction in progress", dismissed: false, type: "" })
                return
            }

            const setTxDone = async () => {
                setAlertState({ message: "Transaction success", dismissed: false, type: "success" })
                const greeting = await web3getGreeting(zksyncProvider)
                setGreeting(greeting)
                return
            }

            return (
                GreetingContainer(
                    async (greeting: string) => {
                        await web3updateGreeting(
                            greeting,
                            provider,
                            setTxInProgress,
                            setTxError,
                            setTxDone
                        )
                    },
                    greeting
                )
            )
        } else {
            return (
                GreetingContainer(
                    async () => {
                        setAlertState({ message: "Please connect your wallet", dismissed: false, type: "error" })
                    },
                    greeting
                )
            )

        }
    }
    if (loading) {
        return (
            <>
                <h1 className="text-center">Loading...</h1>
            </>
        )
    } else {
        return (
            <>
                <div className="d-flex flex-row align-items-stretch">
                    <div className="p-2 align-self-stretch">
                        <WalletComponent />

                    </div>
                    <div className="flex-fill p-2">
                        {!alertState.dismissed &&
                            <AlertComponent />
                        }
                    </div>
                </div>

                <GreetingComponent />
            </>
        )
    }
}