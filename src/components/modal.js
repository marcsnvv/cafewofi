"use client"

import { useState, useEffect, useRef } from "react"

import UserModal from "@/modules/modals/user"

export default function Modal({ trigger, variant }) {
    const [modal, setModal] = useState(false)
    const modalRef = useRef(null)

    useEffect(() => {
        function handleClickOutside(event) {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setModal(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [modalRef])

    return (
        <div className="relative" ref={modalRef}>
            <button onClick={() => setModal(!modal)}>
                {trigger}
            </button>
            {modal && (
                <div className="absolute mt-4 right-0 w-[255px] z-50">
                    <UserModal />
                </div>
            )}
        </div>
    )
}
