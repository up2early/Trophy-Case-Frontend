import React, { Component } from "react";
import { WalletView } from "../view/WalletView";

interface Props {
    connected: boolean
    address: string | undefined
    onConnect: Function
}

interface State {
}

export class WalletContainer extends Component<Props, State> {

    render() {
        return (
            <>
                <WalletView 
                    connected={this.props.connected}
                    address={this.props.address}
                    onConnect={this.props.onConnect}
                />
            </>
        )
    }
}
