import React, { ChangeEvent, Component } from "react";
import { GreetingView } from "../view/GreetingView";

interface props {
  setGreeting: Function
  greeting: string
}

interface state {
  input: string
}

export class GreetingContainer extends Component<
  props,
  state>
{
  constructor(props: props) {
    super(props);
    this.state = {
      input: "" 
    }
  }

  onChangeAmount = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value

    this.setState({ input })
  }

  onSubmit = () => {
    const { input } = this.state
    const { setGreeting } = this.props
    setGreeting(input)
  }

  render() {
    return (
      <>
        <GreetingView
          onInput={this.onChangeAmount}
          onSubmit={this.onSubmit}
          greeting={this.props.greeting}
        />
      </>
    )
  }
}