"use client"

import { useState, useEffect } from "react"
import { Close } from "@/modules/icons"

export default function Popup({ trigger, content, opened, closeHandler }) {
    const [modal, setModal] = useState(false)

    useEffect(() => {
        if (opened) {
            setModal(true)
        } else {
            setModal(false)
        }
    }, [opened])

    function handleClosePopup() {
        setModal(false)
        // Llama al manejador de cierre para notificar al componente padre
        if (closeHandler) {
            closeHandler()
        }
    }

    return (
        <>
            <button onClick={() => setModal(true)}>
                {trigger}
            </button>
            {modal && (
                <div className="z-50 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-md flex flex-col gap-4 w-auto max-w-[400px]">
                        <div className="relative bg-white p-2 rounded-lg flex flex-col gap-4">
                            <button
                                className="absolute z-50 top-4 right-4 p-2 rounded-full hover:bg-gray/25"
                                onClick={handleClosePopup}
                            >
                                <Close />
                            </button>
                            {content}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
