import { useState } from 'react';

const Modal = ({ closeModal }) => {
    return (
        <>
            <div className="modalBackground">
                <div className="modalContainer">
                    <button onClick={() => closeModal(false)}> X </button>
                    <div className="body">
                        <p>Correct! 🥳</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Modal;