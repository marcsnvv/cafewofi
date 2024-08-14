"use client"

import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"
import Topbar from "@/components/topbar"
import Button from "@/components/button"

export default function Notifications() {
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [notifications, setNotifications] = useState([])
    const [avatar, setAvatar] = useState(null)

    useEffect(() => {
        async function fetchNotifications() {
            const { data: { session } } = await supabase.auth.getSession()
            setAvatar(session?.user?.user_metadata?.avatar_url)

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
            const supabase = createClient()

            // Actualizar el estado de la notificación
            const { error: notificationError } = await supabase
                .from('notifications')
                .update({ status: action })  // 'accepted' or 'declined'
                .eq('id', notificationId)

            if (notificationError) {
                console.error(`Error ${action} follow request:`, notificationError)
                return
            }

            // Si la solicitud es aceptada, agrega una nueva entrada en la tabla 'friends'
            if (action === 'accepted') {
                const { error: friendsError } = await supabase
                    .from('friends')
                    .insert([
                        { user_id: recipientId, friend_id: senderId },
                        { user_id: senderId, friend_id: recipientId }
                    ])

                if (friendsError) {
                    console.error('Error adding friend:', friendsError)
                    return
                }
            }

            // Si la solicitud es declinada, no es necesario realizar ninguna acción adicional en la tabla 'friends'

            // Actualiza el estado de las notificaciones en el frontend
            setNotifications(notifications.filter(notif => notif.id !== notificationId))
        } catch (error) {
            console.error(`Error handling follow request:`, error)
        }
    }


    if (loading) return <div>Loading...</div>

    return (
        <main>
            <Topbar noSearch avatar_url={avatar} />
            <section className="p-5">
                <h2 className="text-2xl font-semibold">Notifications</h2>
                <div className="mt-12">
                    {notifications.length === 0 ? (
                        <p>No notifications</p>
                    ) : (
                        <ul>
                            {notifications.map(notification => (
                                <li key={notification.id} className="p-3 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <img src={notification.users?.avatar_url || '/default-avatar.png'} alt="Avatar" className="w-10 h-10 rounded-full" />
                                            <div className="ml-3">
                                                <p><strong>{notification.users?.username}</strong> sent you a {notification.type}</p>
                                                <p className="text-sm text-gray-500">{new Date(notification.created_at).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div>
                                            {notification.type === 'friend_request' && (
                                                <div className="flex space-x-2">
                                                    <Button onClick={() => handleFollowRequest(notification.id, 'accepted')}>Accept</Button>
                                                    <Button onClick={() => handleFollowRequest(notification.id, 'declined')}>Decline</Button>
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
        </main>
    )
}
