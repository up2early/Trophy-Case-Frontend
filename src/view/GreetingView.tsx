import React from "react";

export const GreetingView = (greeting: string, onInput: Function, onSubmit: Function) => {
    return (
        <div className="text-center">
            <h1>{greeting}</h1>
            <div>
                <div className="input-group">
                    <input type="string" className="form-control" onChange={(event) => onInput(event)} />
                    <div className="input-group-append">
                        <button className="btn btn-primary" type="button" onClick={() => onSubmit()}>Set Greeting</button>
                    </div>
                </div>
            </div>
        </div>
    )
}