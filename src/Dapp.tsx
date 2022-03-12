import React, { useEffect, useState } from "react"
import { AlertView } from "./view/TransactionView"
import { WalletContainer } from "./container/WalletContainer"
import { web3getGreeting, web3getSigner, web3updateGreeting } from "./data/Web3Data"
import { GreetingContainer } from "./container/GreetingContainer"
import { Provider, Web3Provider } from "zksync-web3"

export const Dapp = () => {
    const [wallet, setWallet] = useState<{ address: string, connected: boolean, provider: Web3Provider | null }>({ address: "", connected: false, provider: null })
    const [alertState, setAlertState] = useState({ message: "", dismissed: true, type: "" })
    const [greeting, setGreeting] = useState("")

    const zksyncProvider = new Provider("https://zksync2-testnet.zksync.dev")

    const TransactionComponent = () => {
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
            WalletContainer(
                wallet.connected,
                wallet.address,
                connectWallet
            )
        )
    }

    const GreetingComponent = () => {
        async function updateGreetingState() {
            // You can await here
            const greeting = await web3getGreeting(zksyncProvider)
            setGreeting(greeting)
        }

        // Get greeting on app load
        useEffect(() => {
            updateGreetingState();
        }, []) // Runs only once

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

            const setTxDone = () => {
                setAlertState({ message: "Transaction success", dismissed: false, type: "success" })
                updateGreetingState()
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
                    async (greeting: string) => {
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
                <TransactionComponent />
            }

            <WalletComponent />

            <GreetingComponent />
        </>
    )
}