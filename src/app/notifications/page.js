"use client"

import Image from "next/image"
import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"
import Topbar from "@/components/topbar"
import Button from "@/components/button"
import ETS from "@/utils/elapsed"
import LoadingPage from "@/modules/loading-page"

export default function Notifications() {
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [notifications, setNotifications] = useState([])
    const [avatar, setAvatar] = useState(null)

    useEffect(() => {
        async function fetchNotifications() {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                window.location.href = "/"
            }
            const { data: profile } = await supabase
                .from('users')
                .select('avatar_url')
                .eq('id', session.user.id)
            setAvatar(profile[0].avatar_url)

            // Obtener notificaciones del usuario
            const { data, error } = await supabase
                .from('notifications')
                .select(`
                    id,
                    sender_id,
                    recipient_id,
                    type,
                    status,
                    created_at,
                    users:sender_id (username, avatar_url)
                `)
                .eq('recipient_id', session.user.id)
                .eq('status', 'pending')

            if (error) {
                console.error("Error fetching notifications:", error)
                setLoading(false)
                return
            }

            setNotifications(data)
            setLoading(false)
        }

        fetchNotifications()
    }, [])

    const markAsRead = async (notificationId) => {
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ status: 'read' })
                .eq('id', notificationId)

            if (error) {
                console.error("Error marking notification as read:", error)
            } else {
                setNotifications(notifications.map(notif =>
                    notif.id === notificationId ? { ...notif, status: 'read' } : notif
                ))
            }
        } catch (error) {
            console.error("Error marking notification as read:", error)
        }
    }



    const handleFollowRequest = async (notificationId, action, senderId, recipientId) => {
        try {
            console.log(action)
            const supabase = createClient()
            const { data: { session } } = await supabase.auth.getSession()

            const currentUserId = session.user.id

            await supabase.rpc('set_current_user_id', { user_id: currentUserId })

            const { error: notificationError } = await supabase
                .from('notifications')
                .update({ status: action })  // 'accepted' or 'declined'
                .eq('id', notificationId)

            if (notificationError) {
                console.error(`Error ${action} follow request:`, notificationError);
                return
            }

            if (action === 'accepted') {
                const { error: updateFriendsError } = await supabase
                    .from('friends')
                    .update({ status: 'accepted' }) // Asegúrate de que el nombre de la columna sea 'status'
                    .eq('user_id', senderId)
                    .eq('friend_id', recipientId)

                if (updateFriendsError) {
                    console.error('Error updating friend relationship:', updateFriendsError)
                    return
                }
            }

            setNotifications(notifications.filter(notif => notif.id !== notificationId));
        } catch (error) {
            console.error(`Error handling follow request:`, error);
        }
    }

    return (
        <main>
            <Topbar noSearch avatar_url={avatar} />
            {loading ? (
                <LoadingPage />
            ) : (
                <section className="">
                    <h2 className="text-2xl font-semibold">Notifications</h2>
                    <div className="mt-14">
                        {notifications.length === 0 ? (
                            <div className="mt-56 h-full w-screen flex items-center justify-center">
                                <div className="flex flex-col items-center justify-center gap-5">
                                    <Image src="/notfound.png" width={150} height={150} />
                                    <span className="text-lg font-nyght">Nothing here...</span>
                                </div>
                            </div>
                        ) : (
                            <ul>
                                {notifications.map(notification => (
                                    <li key={notification.id} className="px-5 py-3 border-b border-lightbrand">
                                        <div className="flex items-center justify-between gap-1">
                                            <div className="flex items-center text-xs">
                                                <img src={notification.users?.avatar_url || '/default-avatar.png'} alt="Avatar" className="w-10 h-10 rounded-full" />
                                                <div className="ml-3">
                                                    <p><strong>{notification.users?.username}</strong> sent you a {notification.type}</p>
                                                    <p className="text-xs text-gray">{ETS(notification.created_at)}</p>
                                                </div>
                                            </div>
                                            <div>
                                                {notification.type === 'friend_request' && (
                                                    <div className="flex space-x-2">
                                                        <Button className={"text-xs"} onClick={() => handleFollowRequest(notification.id, 'accepted', notification.sender_id, notification.recipient_id)}>Accept</Button>
                                                        <Button className={"bg-secondary text-xs"} onClick={() => handleFollowRequest(notification.id, 'declined', notification.sender_id, notification.recipient_id)}>Decline</Button>
                                                    </div>
                                                )}
                                                {notification.status === 'unread' && (
                                                    <Button onClick={() => markAsRead(notification.id)}>Mark as Read</Button>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </section>
            )}
        </main>
    )
}
