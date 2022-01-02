import React, { useState } from "react";
import { Toast } from "react-bootstrap";
import copy from 'copy-to-clipboard';

const CopyContract = ({ contract, setContract }) => {
    const [isCopied, setIsCopied] = useState(false);

    const copyToClipboard = (address) => {
        copy(address);
        setIsCopied(true);
        setTimeout(() => {
            setContract({ isShowContract: false, address: "" });
            setIsCopied(false);
        }, 2000)
    }

    return (
        <>
            {
                contract.isShowContract &&
                <Toast>
                    <Toast.Body>
                        <p className='toastmessage' onClick={copyToClipboard.bind(this, contract.address)}>
                            {
                                isCopied ?
                                    <small>Copied...!!</small> :
                                    <small>ImportContractForm Address:- {" "} {contract.address}</small>
                            }
                        </p>
                    </Toast.Body>
                </Toast>
            }
        </>
    )
}

export default CopyContract;