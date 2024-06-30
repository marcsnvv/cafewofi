"use client"

import { useRef, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import Link from "next/link"

export default function UserAutocomplete({ username }) {
    const supabase = createClientComponentClient()
    const inputRef = useRef()
    const [showAutocomplete, setShowAutocomplete] = useState(false)
    const [results, setResults] = useState([])

    const handleInput = async () => {
        const query = inputRef.current.value
        if (query.length > 2) {
            const { data, error } = await supabase
                .from('users')
                .select('id, username, name, avatar_url')
                .ilike('username', `%${query}%`)

            if (error) {
                console.error(error)
            } else {
                setResults(data)
                setShowAutocomplete(true)
            }
        } else {
            setShowAutocomplete(false)
        }
    }

    return (
        <div className="relative">
            <input
                placeholder={`@${username}`}
                className="text-darkgray font-medium bg-lightbrand rounded-md p-2 px-4 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-opacity-50 w-full"
                onKeyUp={handleInput}
                ref={inputRef}
            />

            {showAutocomplete && (
                <div className="absolute z-10 bg-white border border-gray rounded-md shadow-lg w-full mt-2">
                    {results.length > 0 ? (
                        results.map(user => (
                            <Link
                                href={`/${user.username}`}
                                key={user.id}
                                className="hover:bg-lightgray cursor-pointer rounded-md"
                            >
                                <div className="flex items-center p-2">
                                    <img src={user.avatar_url} alt={user.username} className="w-8 h-8 rounded-full" />
                                    <div className="ml-2">
                                        <p className="text-sm font-medium">@{user.username}</p>
                                        <p className="text-xs text-gray-500">{user.name}</p>
                                    </div>
                                </div>
                                <hr className="text-gray"></hr>
                            </Link>
                        ))
                    ) : (
                        <div className="p-2 text-gray-500">No users found</div>
                    )}
                </div>
            )}
        </div>
    )
}
