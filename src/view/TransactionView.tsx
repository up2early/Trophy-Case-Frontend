import React from "react"

export const AlertView = (alertType: string, message: string, dismissed: boolean, onDismiss: Function) => {
    if (dismissed) return null

    let alertClass = ""
    if (alertType === "error") {
        alertClass = "alert alert-danger"
    } else if (alertType === "success") {
        alertClass = "alert alert-success"
    } else {
        alertClass = "alert alert-primary"
    }

    return (
        <div className={alertClass} role="alert">
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