import React, { Component } from "react"
import { TransactionView } from "./view/TransactionView"
import { WalletContainer } from "./container/WalletContainer"
import { initializeWallet, updateGreeting } from "./data/Web3Data"
import { GreetingContainer } from "./container/GreetingContainer"

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
        const provider = null

        this.initialState = { address, walletConnected, txBeingSent, txError, networkError, txHash, txDismissed, provider }

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

                const updateDappWalletState = (selectedAddress: string, provider: any) => {
                    this.setState({ walletConnected: true, provider: provider, address: selectedAddress })
                }

                await initializeWallet(resetState, updateDappWalletState)
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
        return (
            <GreetingContainer 
                setGreeting={async (greeting: string) => {
                    await updateGreeting(greeting, this.state.provider, this.setTxInProgrees, this.setTxError, this.setTxDone)
                }}
                greeting={"Test Greeting"}
            />
        )
    }

    setTxError = () => {
        console.log("Not Implemented")
        return
    }

    setTxInProgrees = () => {
        console.log("Not Implemented")
        return
    }

    setTxDone = () => {
        console.log("Not Implemented")
        return
    }
}