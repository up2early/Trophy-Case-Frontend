import React from "react"

export const AlertView = (alertType: string, message: string, dismissed: boolean, onDismiss: Function) => {
    if (dismissed) return null

    let alertClass = ""
    if (alertType === "error") {
        alertClass = "alert alert-danger text-center"
    } else if (alertType === "success") {
        alertClass = "alert alert-success text-center"
    } else {
        alertClass = "alert alert-primary text-center"
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