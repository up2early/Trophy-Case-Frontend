import React, { useEffect, useState } from "react"
import { TransactionView } from "./view/TransactionView"
import { WalletContainer } from "./container/WalletContainer"
import { web3getGreeting, web3getSigner, web3updateGreeting } from "./data/Web3Data"
import { GreetingContainer } from "./container/GreetingContainer"
import { Provider, Web3Provider } from "zksync-web3"

export const Dapp = () => {
    const [wallet, setWallet] = useState<{ address: string, connected: boolean, provider: Web3Provider | null }>({ address: "", connected: false, provider: null })
    const [web3dataProvider, setWeb3datProvider] = useState(new Provider("https://zksync2-testnet.zksync.dev"))
    const [notificationData, setNotificationData] = useState({ message: "", dismissed: true })
    const [greeting, setGreeting] = useState("")

    const TransactionComponent = () => {
        const dismissTx = () => {
            setNotificationData({ message: "", dismissed: true })
        }

        return (
            <TransactionView
                txHash={" tx Hash "}
                txBeingSent={true}
                txError={" tx Error "}
                dismissed={notificationData.dismissed}
                onDismiss={dismissTx}
            />
        )
    }

    const WalletComponent = () => {
        const resetWalletState = () => {
            setWallet({ address: "", connected: false, provider: null })
        }

        const connectWallet = async () => {
            if (wallet?.connected) {
                resetWalletState()
            } else {
                const updateDappWalletState = (address: string, provider: Web3Provider) => {
                    setWallet({ address, connected: true, provider })
                }

                await web3getSigner(resetWalletState, updateDappWalletState)
            }
        }

        return (
            <WalletContainer
                address={wallet.address}
                connected={wallet.connected}
                onConnect={connectWallet}
            />
        )
    }

    const GreetingComponent = () => {
        async function updateGreetingState() {
            // You can await here
            const greeting = await web3getGreeting(web3dataProvider)
            setGreeting(greeting)
        }
        const setTxError = () => {
            console.log("Not Implemented")
            return
        }

        const setTxInProgress = () => {
            console.log("Not Implemented")
            return
        }

        const setTxDone = () => {
            updateGreetingState()
            return
        }

        useEffect(() => {
            updateGreetingState();
        }, []) // Runs only once
        
        const provider = wallet.provider

        if (provider) {
            return (
                <GreetingContainer
                    setGreeting={async (greeting: string) => {
                        await web3updateGreeting(greeting, provider, setTxInProgress, setTxError, setTxDone)
                    }}
                    greeting={greeting}
                />
            )
        } else {
            return (
                <GreetingContainer
                    setGreeting={async (greeting: string) => {
                        setNotificationData({ message: "Please connect your wallet", dismissed: false})
                    }}
                    greeting={greeting}
                />
            )

        }
    }

    return (
        <>
            {!notificationData.dismissed &&
                <TransactionComponent />
            }

            <WalletComponent />

            {wallet.connected &&
                <GreetingComponent />
            }
        </>
    )
}