"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import Image from "next/image"
import Topbar from "@/components/topbar"
import Field from "@/components/field"
import Button from "@/components/button"
import { FileAdd } from "@/modules/icons"

export default function Settings() {
    const supabase = createClient()
    const [name, setName] = useState("")
    const [username, setUsername] = useState("")
    const [avatar, setAvatar] = useState("")
    const [thumbnail, setThumbnail] = useState("")
    const [bio, setBio] = useState("")
    const [sid, setSid] = useState(null)

    const [loading, setLoading] = useState(false)
    const [inputError, setInputError] = useState({
        name: null,
        username: null,
        avatar: null,
        thumbnail: null,
        bio: null,
    })

    useEffect(() => {
        async function getData() {
            const { data: { session } } = await supabase.auth.getSession()
            setSid(session.user.id)

            const { data, error } = await supabase
                .from("users")
                .select("*")
                .eq("id", session.user.id)

            if (error || !data?.user) {
                window.href = "/"
            } else {
                setSid(session.user.id)
            }

            setName(data[0]?.name || "")
            setAvatar(data[0]?.avatar_url || "")
            setUsername(data[0]?.username || "")
            setThumbnail(data[0]?.thumbnail || "")
            setBio(data[0]?.biography || "")
        }

        getData()
    }, [])

    function resizeImage(file, maxWidth, maxHeight) {
        return new Promise((resolve, reject) => {
            const img = document.createElement('img')
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')

            const reader = new FileReader()
            reader.onload = (e) => {
                img.src = e.target.result
                img.onload = () => {
                    canvas.width = maxWidth
                    canvas.height = maxHeight
                    ctx.drawImage(img, 0, 0, maxWidth, maxHeight)
                    canvas.toBlob((blob) => {
                        resolve(blob)
                    }, file.type)
                }
            }
            reader.onerror = (e) => {
                reject(e)
            }
            reader.readAsDataURL(file)
        })
    }

    function validateFields() {
        let errors = {}

        // Validations for Name
        if (!name.trim()) {
            errors.name = "Name is required"
        } else if (name.length > 40) {
            errors.name = "Name must be less than 40 characters"
        } else if (!/^[a-zA-Z ]+$/.test(name)) {
            errors.name = "Name can only contain letters and spaces"
        }

        // Validations for Username
        if (!username.trim()) {
            errors.username = "Username is required"
        } else if (!/^[a-z0-9_\.]+$/.test(username)) {
            errors.username = "Username can only contain lowercase letters, numbers, '_', and '.'"
        }

        setInputError(errors)

        return Object.keys(errors).length === 0
    }

    const handleUpload = async (file, type) => {
        // const file = event.target.files[0]
        if (!file) return

        // Resize image
        let resizesImageBuffer = await resizeImage(file, 500, 500)

        // Generar un nombre único para el archivo
        const filePath = `${sid}/${Date.now()}-${file.name}`

        // Intentar subir el archivo al bucket "thumbnails"
        const { data: storageData, error: storageError } = await supabase
            .storage
            .from('images')
            .upload(filePath, resizesImageBuffer, {
                cacheControl: '3600',
                upsert: false,
                contentType: file.type
            })

        if (storageError) {
            console.error('Error uploading file:', storageError)
            return
        }

        // Obtener la URL pública del archivo subido
        const { data: publicUrlData, error: publicUrlError } = await supabase
            .storage
            .from('images')
            .getPublicUrl(filePath)

        if (publicUrlError) {
            console.error('Error getting public URL:', publicUrlError)
            return
        }

        const publicUrl = publicUrlData.publicUrl
        return publicUrl
    }

    async function saveChanges(e) {
        e.preventDefault()

        if (!validateFields()) {
            return
        }

        setLoading(true)

        let avatarUrl = avatar
        let thumbnailUrl = thumbnail

        if (avatar && typeof avatar !== 'string') {
            avatarUrl = await handleUpload(avatar, 'avatar')
        }

        if (thumbnail && typeof thumbnail !== 'string') {
            thumbnailUrl = await handleUpload(thumbnail, 'thumbnail')
        }

        const { data, error } = await supabase.from("users").update([
            {
                name: name.trim(),
                username: username.trim(),
                biography: bio.trim(),
                avatar_url: avatarUrl,
                thumbnail: thumbnailUrl,
            }
        ]).eq("id", sid)

        setLoading(false)

        if (error) {
            console.error('Error saving data:', error)
        } else {
            console.log('Data saved successfully:', data)
        }
    }

    return (
        <main>
            <Topbar loading={loading} avatar_url={avatar} name={name} noSearch />

            <section className="p-5 pt-28 lg:flex items-center justify-center">
                <form className="grid gap-4 w-full mt-5 lg:max-w-lg">
                    <label className="font-nyght text-2xl">Settings</label>
                    <div className="grid gap-2">
                        <label className={`${inputError.name ? "text-red-500" : "text-gray"}`}>
                            Name
                        </label>
                        <Field
                            variant="primary"
                            loading={loading}
                            setLoading={setLoading}
                            error={inputError.name}
                            onChange={(value) => setName(value)}
                            noSearch
                        >
                            {name}
                        </Field>
                        {inputError.name && (
                            <span className="text-red-500">{inputError.name}</span>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <label className={`${inputError.username ? "text-red-500" : "text-gray"}`}>
                            Username
                        </label>
                        <Field
                            variant="primary"
                            loading={loading}
                            setLoading={setLoading}
                            error={inputError.username != null}
                            onChange={(value) => setUsername(value)}
                            noSearch
                        >
                            {username}
                        </Field>
                        {inputError.username && (
                            <span className="text-red-500">{inputError.username}</span>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <label className={`${inputError.bio ? "text-red-500" : "text-gray"}`}>
                            Bio
                        </label>
                        <textarea
                            minLength={1}
                            maxLength={100}
                            rows={3}
                            className={`
                                ${inputError.bio
                                    ? "border-2 border-red-500 bg-red-200 focus:outline-none"
                                    : "focus:outline-none focus:ring-2 focus:ring-brand"}
                                bg-lightbrand rounded-lg p-4 resize-y min-h-[100px] max-h-[205px] overflow-hidden
                            `}
                            placeholder={bio ? bio : "I love coffee..."}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                        />
                        {inputError.bio && (
                            <span className="text-red-500">{inputError.bio}</span>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <label className={`${inputError.avatar ? "text-red-500" : "text-gray"} cursor-pointer flex flex-col gap-2 w-fit`}>
                            Avatar (recommended 500x500 px)
                            <Image src={avatar} width={50} height={50} className="rounded-full hover:opacity-75" />
                            {/* <div className={`flex items-center justify-center p-5 rounded-full hover:bg-lightgray bg-center`}>
                                <FileAdd />
                            </div> */}
                            <input
                                type="file"
                                className="hidden"
                                onChange={(e) => setAvatar(e.target.files[0])}
                                accept="image/*"
                            />
                        </label>
                        {inputError.avatar && (
                            <span className="text-red-500">{inputError.avatar}</span>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <label className={`${inputError.avatar ? "text-red-500" : "text-gray"} cursor-pointer flex flex-col gap-2`}>
                            Thumnbail (recommended 385x720)
                            <Image src={thumbnail} width={720} height={1080} className="rounded-md hover:opacity-75" />
                            <div className={`flex items-center justify-center p-5 rounded-md hover:bg-lightgray bg-center`}>
                                <FileAdd />
                            </div>
                            <input
                                type="file"
                                className="hidden"
                                onChange={(e) => setThumbnail(e.target.files[0])}
                                accept="image/*"
                            />
                        </label>
                        {inputError.avatar && (
                            <span className="text-red-500">{inputError.avatar}</span>
                        )}
                    </div>



                    <Button
                        variant="primary"
                        type="submit"
                        onClick={(e) => saveChanges(e)}
                        loading={loading}
                    >
                        Save changes
                    </Button>
                </form>
            </section>
        </main>
    )
}
