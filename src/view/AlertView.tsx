import React from "react"

export const AlertView = (alertType: string, message: string, dismissed: boolean, onDismiss: Function) => {
    if (dismissed) return null

    const style = {
        height: "3rem"
    }

    let alertClass = ""
    if (alertType === "error") {
        alertClass = "alert alert-danger text-center mb-0"
    } else if (alertType === "success") {
        alertClass = "alert alert-success text-center mb-0"
    } else {
        alertClass = "alert alert-primary text-center mb-0"
    }

    return (
        <div className={alertClass} role="alert" style={style}>
            {message}
            <button
                type="button"
                className="close"
                data-dismiss="alert"
                aria-label="Close"
                onClick={() => onDismiss()}
            >
                <span aria-hidden="true">x</span>
            </button>
        </div>
    )
}