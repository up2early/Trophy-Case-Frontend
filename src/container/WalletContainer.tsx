import { WalletView } from "../view/WalletView";

export const WalletContainer = (connected: boolean, address: string, onConnect: Function) => {
    return (
        WalletView(connected, address, onConnect)
    )
}