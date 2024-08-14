"use client"

import { useState, useEffect } from "react"

import Login from "@/modules/popup/login"

export default function Popup({ trigger, opened = false }) {
    const [modal, setModal] = useState(false)

    useEffect(() => {
        if (opened) {
            setModal(true)
        } else if (!opened && modal) {
            setModal(true)
        }
    }, [opened, modal])

    return (
        <>
            {!opened && (
                <button onClick={() => setModal(true)}>
                    {trigger}
                </button>
            )}
            {(modal || opened) && (
                <div className="z-50 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-md flex flex-col gap-4 w-auto max-w-[400px]">
                        <Login setModal={setModal} />
                    </div>
                </div>
            )}
        </>
    )
}
