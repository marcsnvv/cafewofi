"use client"

import { Bulb, User, Settings, SignOut } from "@/modules/icons"

import Link from "next/link"

import SignOutAction from "@/app/actions/signout"

export default function UserModal() {
    return (
        <div className="border-2 border-gray rounded-2xl bg-white overflow-hidden">
            <div className="cursor-pointer flex items-center justify-start p-4 hover:bg-lightgray">
                <Bulb color="#111111" />
                <span className="ml-4">About CWF</span>
            </div>
            <hr className="border-t border-gray" />
            <Link href={"/account"} className="flex items-center justify-start p-4 hover:bg-lightgray">
                <User color="#111111" />
                <span className="ml-4">Account</span>
            </Link>
            <hr className="border-t border-gray" />
            <Link href={"/account/settings"} className="cursor-pointer flex items-center justify-start p-4 hover:bg-lightgray">
                <Settings color="#111111" />
                <span className="ml-4">Settings</span>
            </Link>
            <hr className="border-t border-gray" />
            <button
                onClick={() => SignOutAction()}
                className="w-full cursor-pointer flex items-center justify-start p-4 hover:bg-lightgray">
                <SignOut color="#111111" />
                <span className="ml-4">Log out</span>
            </button>
        </div>
    )
}