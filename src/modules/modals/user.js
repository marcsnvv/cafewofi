"use client"

import { Bulb, User, Settings, SignOut, Bell } from "@/modules/icons"
import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import Link from "next/link"
import SignOutAction from "@/app/actions/signout"

export default function UserModal() {
    const [notificationCount, setNotificationCount] = useState(0)

    useEffect(() => {
        async function fetchNotifications() {
            const supabase = createClient()
            const { data: { session } } = await supabase.auth.getSession()

            if (session) {
                const { data, error } = await supabase
                    .from('notifications')
                    .select('status')
                    .eq('recipient_id', session.user.id)
                    .eq('status', 'pending')

                if (!error) {
                    setNotificationCount(data.length)
                }
            }
        }

        fetchNotifications()
    }, [])

    return (
        <div className="w-[255px] border-2 border-gray rounded-2xl bg-white overflow-hidden">
            <Link href={"/about"} className="cursor-pointer flex items-center justify-start p-4 hover:bg-lightgray">
                <Bulb color="#111111" />
                <span className="ml-4">About CWF</span>
            </Link>
            <hr className="border-t border-gray" />
            <Link href={"/account"} className="flex items-center justify-start p-4 hover:bg-lightgray">
                <User color="#111111" />
                <span className="ml-4">Account</span>
            </Link>
            <hr className="border-t border-gray" />
            <Link href={"/notifications"} className="relative flex items-center justify-start p-4 hover:bg-lightgray">
                <Bell color="#111111" />
                <span className="ml-4">Notifications</span>
                {notificationCount > 0 && (
                    <div className="absolute right-4 flex items-center justify-center w-5 h-5 bg-brand text-white text-xs font-bold rounded-full">
                        {notificationCount}
                    </div>
                )}
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
