import React, { Component, useEffect } from "react"
import { TransactionView } from "./view/TransactionView"
import { WalletContainer } from "./container/WalletContainer"
import { web3getGreeting, web3getSigner, web3updateGreeting } from "./data/Web3Data"
import { GreetingContainer } from "./container/GreetingContainer"
import { Provider, Web3Provider } from "zksync-web3"

interface IDappProps {
}

interface IDappState {
    address: string
    walletConnected: boolean
    txBeingSent: boolean
    txError: string
    networkError: boolean
    txHash: string
    txDismissed: boolean
    provider: any
    greeting: string
}

export class Dapp extends Component<IDappProps, IDappState> {
    initialState: IDappState
    constructor(props: IDappProps) {
        super(props)

        const address = ""
        const walletConnected = false
        const txBeingSent = false
        const txError = ""
        const networkError = false
        const txHash = ""
        const txDismissed = false
        const provider = new Provider("https://zksync2-testnet.zksync.dev")
        const greeting = "Loading..."

        this.initialState = { address, walletConnected, txBeingSent, txError, networkError, txHash, txDismissed, provider, greeting }

        this.state = this.initialState
    }

    render() {
        return (
            <>
                {this.state.txHash !== "" &&
                    <this.TransactionComponent />
                }

                <this.WalletComponent />

                {this.state.walletConnected &&
                    <this.GreetingComponent />
                }
            </>
        )
    }

    TransactionComponent = () => {
        const dismissTx = () => {
            this.setState({ txDismissed: true })
        }

        return (
            <TransactionView
                txHash={this.state.txHash}
                txBeingSent={this.state.txBeingSent}
                txError={this.state.txError}
                dismissed={this.state.txDismissed}
                onDismiss={dismissTx}
            />
        )
    }

    WalletComponent = () => {
        const connectWallet = async () => {
            if (this.state.walletConnected) {
                this.setState(this.initialState)
            } else {
                const resetState = () => {
                    this.setState(this.initialState)
                }

                const updateDappWalletState = (selectedAddress: string, provider: Web3Provider) => {
                    this.setState({ walletConnected: true, provider , address: selectedAddress })
                }

                await web3getSigner(resetState, updateDappWalletState)
            }
        }

        return (
            <WalletContainer
                address={this.state.address}
                connected={this.state.walletConnected}
                onConnect={connectWallet}
            />
        )
    }

    GreetingComponent = () => {
        useEffect(() => {
            async function fetchData(provider: Provider, setState: Function) {
                // You can await here
                const greeting = await web3getGreeting(provider)
                setState(greeting)
            }

            fetchData(
                this.state.provider,
                (greeting: string) => {
                    this.setState({ greeting })
                }
            );
        }, []) // <-- empty dependency array
        return (
            <GreetingContainer
                setGreeting={async (greeting: string) => {
                    await web3updateGreeting(greeting, this.state.provider, this.setTxInProgrees, this.setTxError, this.setTxDone)
                }}
                greeting={this.state.greeting}
            />
        )
    }

    // TODO: Move these functions to be inside the component they're used in
    setTxError = () => {
        console.log("Not Implemented")
        return
    }

    setTxInProgrees = () => {
        console.log("Not Implemented")
        return
    }

    setTxDone = async () => {
        const greeting = await web3getGreeting(this.state.provider)
        this.setState({ greeting })
        return
    }
}