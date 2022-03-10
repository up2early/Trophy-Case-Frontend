import React, { CSSProperties } from "react"

type walletProps = {
    connected: boolean
    onConnect: Function
    address: string | undefined
}

const style: CSSProperties = {
    position: "fixed",
    width: "6rem",
}

export const WalletView = (props: walletProps) => {
    if (props.connected) {
        return (
            <header>
                <button
                    className="btn btn-dark text-truncate"
                    type="button"
                    onClick={() => props.onConnect()}
                    style={style}
                >
                    {props.address}
                </button>
            </header>
        )
    } else {
        return (
            <>
                <button
                    className="btn btn-dark"
                    type="button"
                    onClick={() => props.onConnect()}
                    style={style}
                >
                    Connect
                </button>
            </>
        )
    }
}