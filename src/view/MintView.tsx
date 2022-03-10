import React from "react";

type mintProps = {
    tokensAvailable: number
    tokenSymbol: String
    tokenName: String
    purchasePrice: number
    phase: number
    purchaseUnit: String
    totalPrice: String
    onChangeAmount: Function
    onMint: Function
}

export const MintView = (props: mintProps) => {
    return (
        <div className="text-center">
            <h1>Mint {props.tokenName}</h1>
            <h2>Phase {props.phase} - {props.purchasePrice} {props.purchaseUnit} per {props.tokenSymbol}</h2>
            <p>{props.tokensAvailable} {props.tokenName} left!</p>
            <div>
                <div className="input-group">
                    <input type="number" className="form-control" min="0" defaultValue="1" onChange={(event) => props.onChangeAmount(event)} />
                    <div className="input-group-append">
                        <span className="input-group-text" id="inputGroup-sizing-sm">{props.totalPrice} {props.purchaseUnit}</span>
                        <button className="btn btn-primary" type="button" onClick={() => props.onMint()}>Mint</button>
                    </div>
                </div>
            </div>
        </div>
    )
}