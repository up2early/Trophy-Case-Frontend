import React from "react"

type transactionProps = {
    txHash: string
    txError: string
    txBeingSent: boolean
    dismissed: boolean
    onDismiss: Function
}

export const TransactionView = (props: transactionProps) => {
    if(props.dismissed) return null

    let alertType = ""
    let message = ""
    if(props.txError !== "") {
        message = "Transaction failed with error: " + props.txError
        alertType = "alert alert-danger"
    } else if (props.txBeingSent) {
        message = "Transaction is confirming. Please wait"
        alertType = "alert alert-info"
    } else {
        message = "Transaction finished successfully"
        alertType = "alert alert-success"
    }

    return (
        <div className={alertType} role="alert">
            {message}
            <button
                type="button"
                className="close"
                data-dismiss="alert"
                aria-label="Close"
                onClick={() => props.onDismiss()}
            >
                <span aria-hidden="true">x</span>
            </button>
        </div>
    )
}