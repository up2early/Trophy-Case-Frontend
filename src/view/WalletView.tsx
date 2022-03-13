import React from "react"

export const WalletView = (connected: boolean, address: string, onConnect: Function) => {

    const style = {
        height: "3rem",
        maxWidth: "8rem"
    }

    if (connected) {
        return (
            <>
                <button
                    className="btn btn-dark text-truncate"
                    type="button"
                    onClick={() => onConnect()}
                    style={style}
                >
                    {address}
                </button>
            </>
        )
    } else {
        return (
            <>
                <button
                    className="btn btn-dark"
                    type="button"
                    onClick={() => onConnect()}
                    style={style}
                >
                    Connect
                </button>
            </>
        )
    }
}