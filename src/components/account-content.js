"use client"

import { useState } from "react"
import CoffeeCard from "@/components/cafe-card"
import Review from "@/components/review"
import Image from "next/image"

export default function AccountContent({ likes, reviews, friends, profile }) {
    const [activeSection, setActiveSection] = useState('likes')
    console.log(likes)
    console.log(reviews)
    console.log(friends)

    return (
        <section>
            {/* Toggle buttons */}
            <div className="flex justify-around mb-5">
                <button
                    className={`p-2 ${activeSection === 'likes' ? 'bg-gray-300' : 'bg-white'} rounded-lg`}
                    onClick={() => setActiveSection('likes')}
                >
                    Cafes you like
                </button>
                <button
                    className={`p-2 ${activeSection === 'reviews' ? 'bg-gray-300' : 'bg-white'} rounded-lg`}
                    onClick={() => setActiveSection('reviews')}
                >
                    Your reviews
                </button>
                <button
                    className={`p-2 ${activeSection === 'friends' ? 'bg-gray-300' : 'bg-white'} rounded-lg`}
                    onClick={() => setActiveSection('friends')}
                >
                    Your Friends
                </button>
            </div>

            {/* Content Sections */}
            {activeSection === 'likes' && (
                <div className="grid grid-cols-2 gap-5">
                    {likes && likes.length > 0 ? (
                        likes
                            .slice()
                            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                            .map((coffee, index) => (
                                <CoffeeCard
                                    key={index}
                                    props={{ likes }}
                                    data={coffee}
                                    size="xs"
                                />
                            ))
                    ) : (
                        <p className="text-gray">No likes found.</p>
                    )}
                </div>
            )}

            {activeSection === 'reviews' && (
                <div className="flex flex-wrap gap-5">
                    {reviews && reviews.length > 0 ? (
                        reviews
                            .slice()
                            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                            .map((review, index) => (
                                <Review
                                    key={index}
                                    data={review}
                                    avatar={profile.avatar_url}
                                    name={profile.name}
                                    username={profile.username}
                                />
                            ))
                    ) : (
                        <p className="text-gray">No reviews found.</p>
                    )}
                </div>
            )}

            {activeSection === 'friends' && (
                <div className="grid grid-cols-2 gap-5">
                    {friends && friends.length > 0 ? (
                        friends.map((friend, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-lightgray rounded-lg">
                                <Image
                                    src={friend.avatar_url || '/default-avatar.png'}
                                    width={50}
                                    height={50}
                                    className="rounded-full"
                                    alt={friend.name}
                                />
                                <div>
                                    <h4 className="font-semibold">{friend.name}</h4>
                                    <span className="text-gray">@{friend.username}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray">No friends found.</p>
                    )}
                </div>
            )}
        </section>
    )
}
