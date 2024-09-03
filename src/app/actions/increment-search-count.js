// Nueva server action
"use server"

import { cookies } from "next/headers"

export default async function incrementSearchCount() {
    const cookieStore = cookies()
    let searchCount = parseInt(cookieStore.get('searchCount')?.value || '0')
    searchCount++
    cookies().set('searchCount', searchCount.toString())
    return searchCount
}