import React, { Component } from "react"
import { MintContainer } from "./container/MintContainer"
import { TransactionView } from "./view/TransactionView"
import { WalletContainer } from "./container/WalletContainer"
import { initializeEthers, mintDegenGambler } from "./data/Web3Data"

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

                <this.MintComponent />

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

                await initializeEthers(resetState, updateDappWalletState)
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

    MintComponent = () => {
        const mint = async (amount: number) => {
            const setTxInProgress = (txHash: string) => {
                this.setState({ txBeingSent: true, txHash: txHash, txDismissed: false, txError: ""})
            }
            const setTxError = (message: string) => {
                this.setState({ txError: message, txBeingSent: true, txDismissed: false })
            }
            const setTxDone = () => {
                this.setState({ txBeingSent: false})
            }

            mintDegenGambler(amount, this.state.provider, setTxInProgress, setTxError, setTxDone)
        }

        const displayError = () => {
            this.setState({ txError: "Wallet not connected", txDismissed: false, txHash: " "})
        }

        if (this.state.walletConnected) {
            return (
                <MintContainer
                    tokensAvailable={100}
                    tokenSymbol={"GAMBLERS"}
                    tokenName={"Degen Gamblers"}
                    purchasePrice={0.1}
                    phase={1}
                    purchaseUnit={"eth"}
                    mint={mint} />
            )
        } else {
            return (
                <MintContainer
                    tokensAvailable={100}
                    tokenSymbol={"GAMBLERS"}
                    tokenName={"Degen Gamblers"}
                    purchasePrice={0.1}
                    phase={1}
                    purchaseUnit={"eth"}
                    mint={displayError} />
            )
        }
    }
}