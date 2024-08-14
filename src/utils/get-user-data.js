import { createClient } from "@/utils/supabase/client";

export async function getUserData(username, sessionUserId) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('users')
        .select(`
        *,
        reviews(*),
        likes(cafe_id, cafes(*)),
        friends!friends_user_id_fkey(friend_id, users!friends_friend_id_fkey(username, avatar_url))
    `)
        .eq('username', username);
    console.log(data)

    if (error) {
        console.error('Error fetching user data:', error);
        return { error };
    }

    if (!data || data.length === 0) {
        return { error: 'User not found' };
    }

    const profile = data[0];
    const reviews = profile.reviews;
    const likes = profile.likes.map(like => like.cafes);

    // Verificar si el usuario actual ya es amigo del perfil
    const isAlreadyFriend = profile.friends.some(friend => friend.friend_id === sessionUserId);

    return {
        profile,
        reviews,
        likes,
        isAlreadyFriend,
    };
}
