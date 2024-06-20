"use client"

import { useState } from "react"

import Login from "@/modules/popup/login"

export default function Popup({ trigger }) {
    const [modal, setModal] = useState(false)

    return (
        <>
            <button onClick={() => setModal(!modal)}>
                {trigger}
            </button>
            {modal && (
                <div className="z-50 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-md flex flex-col gap-4 w-auto max-w-[400px]">
                        <Login
                            setModal={setModal}
                        />
                    </div>
                </div>
            )}
        </>
    )
}	