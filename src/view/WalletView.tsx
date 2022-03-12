import React, { CSSProperties } from "react"

const style: CSSProperties = {
    position: "fixed",
    width: "6rem",
}

export const WalletView = (connected: boolean, address: string, onConnect: Function) => {

    console.log("testing")
    if (connected) {
        return (
            <header>
                <button
                    className="btn btn-dark text-truncate"
                    type="button"
                    onClick={() => onConnect()}
                    style={style}
                >
                    {address}
                </button>
            </header>
        )
    } else {
        return (
            <>
                <header>
                    <button
                        className="btn btn-dark"
                        type="button"
                        onClick={() => onConnect()}
                        style={style}
                    >
                        Connect
                    </button>
                </header>
            </>
        )
    }
}