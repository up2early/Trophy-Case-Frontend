import React, { ChangeEvent, Component } from "react";
import { MintView } from "../view/MintView";

interface IMintProps {
  tokensAvailable: number
  purchasePrice: number
  mint: Function
  tokenSymbol: string
  tokenName: String
  phase: number
  purchaseUnit: string
}

interface IMintState {
  numberToMint: number
  totalPrice: string
}

export class MintContainer extends Component<
  IMintProps,
  IMintState>
{
  constructor(props: IMintProps) {
    super(props);
    this.state = {
      numberToMint: 1,
      totalPrice: this.props.purchasePrice.toString()
    }
  }

  onChangeAmount = (event: ChangeEvent<HTMLInputElement>) => {
    const numberToMint = parseInt(event.target.value)
    const totalPrice = (0.1 * numberToMint).toFixed(20)

    this.setState({ totalPrice, numberToMint })
  }

  onMint = () => {
    const { numberToMint, totalPrice } = this.state
    const { mint } = this.props
    mint(numberToMint)
    console.log("Container: Minting %s NFTs for %s", numberToMint, totalPrice)
  }

  render() {
    return (
      <>
        <MintView
          tokensAvailable={this.props.tokensAvailable}
          tokenSymbol={this.props.tokenSymbol}
          tokenName={this.props.tokenName}
          purchasePrice={this.props.purchasePrice}
          phase={this.props.phase}
          purchaseUnit={this.props.purchaseUnit}
          totalPrice={this.state.totalPrice}
          onChangeAmount={this.onChangeAmount}
          onMint={this.onMint}
        />
      </>
    )
  }
}