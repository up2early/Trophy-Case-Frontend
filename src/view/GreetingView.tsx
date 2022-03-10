import React from "react";

type props = {
    greeting: string
    onInput: Function
    onSubmit: Function
}

export const GreetingView = (props: props) => {
    return (
        <div className="text-center">
            <h1>{props.greeting}</h1>
            <div>
                <div className="input-group">
                    <input type="string" className="form-control" onChange={(event) => props.onInput(event)} />
                    <div className="input-group-append">
                        <button className="btn btn-primary" type="button" onClick={() => props.onSubmit()}>Set Greeting</button>
                    </div>
                </div>
            </div>
        </div>
    )
}