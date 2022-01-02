import React from "react";

const WalletDetails = ({ wallet }) => {

    return (
        <>
            <p className='wallet-balance'>
                Balance: {" "} {
                    !isNaN(parseFloat(wallet.balance / (10 ** 18))) ?
                        parseFloat(wallet.balance / (10 ** 18)).toFixed(4)
                        : "0 ETH"
                } <br />

                Network: {wallet.network} <br />
                Decimal: 18
            </p>
        </>
    )
}

export default WalletDetails;