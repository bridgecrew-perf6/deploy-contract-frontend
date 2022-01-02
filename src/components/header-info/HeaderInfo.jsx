import React from "react";

const HeaderInfo = ({ isDeployContractOrErc20, logo, wallet }) => {

    return (
        <>
            <img src={logo} className="App-logo" alt="logo" />
            <div className='erc20_token'>
                {
                    wallet.account.length > 0 &&
                    <p className='walletAddress_top'> Wallet:- {" "} {wallet.account} </p>
                }

                <h2> {isDeployContractOrErc20 ? "Deploy Contract" : "Deploy Token"} </h2>
                <p> {isDeployContractOrErc20 ? "Add Details & Deploy Smart Contract." : "Add Details & Get Your Own Erc20 Token"} </p>
            </div>      </>
    )
}

export default HeaderInfo;