import React, { useEffect, useState } from "react"
import { AlertView } from "./view/TransactionView"
import { web3getGreeting, web3getSigner, web3updateGreeting } from "./data/Web3Data"
import { GreetingContainer } from "./container/GreetingContainer"
import { Provider, Web3Provider } from "zksync-web3"
import { WalletView } from "./view/WalletView"

export const Dapp = () => {
    const [wallet, setWallet] = useState<{ address: string, connected: boolean, provider: Web3Provider | null }>({ address: "", connected: false, provider: null })
    const [alertState, setAlertState] = useState({ message: "", dismissed: true, type: "" })
    const [greeting, setGreeting] = useState("")
    const [zksyncProvider] = useState(new Provider("https://zksync2-testnet.zksync.dev"))

    // Get greeting on app load
    useEffect(() => {
        async function updateGreetingState() {
            // You can await here
            const greeting = await web3getGreeting(zksyncProvider)
            setGreeting(greeting)
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
            setWallet({ address: "", connected: false, provider: null })
        }

        const connectWallet = async () => {
            if (wallet.connected) {
                resetWalletState()
            } else {
                const updateDappWalletState = (address: string, provider: Web3Provider) => {
                    setWallet({ address, connected: true, provider })
                }

                await web3getSigner(resetWalletState, updateDappWalletState)
            }
        }

        return (
            WalletView(
                wallet.connected,
                wallet.address,
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

    return (
        <>
            {!alertState.dismissed &&
                <AlertComponent />
            }

            <WalletComponent />

            <GreetingComponent />
        </>
    )
}