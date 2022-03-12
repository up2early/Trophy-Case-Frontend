import { ChangeEvent, useState } from "react";
import { GreetingView } from "../view/GreetingView";

export const GreetingContainer = (setGreeting: Function, greeting: string) => {
  const [input, setInput] = useState("")

  const onInput = (event: ChangeEvent<HTMLInputElement>) => {
    const newInput = event.target.value
    setInput(newInput)
  }

  const onSubmit = () => {
    setGreeting(input)
  }

  return (
    GreetingView(
      greeting,
      onInput,
      onSubmit
    )
  )
}