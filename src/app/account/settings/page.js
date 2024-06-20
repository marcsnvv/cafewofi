"use client"

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Topbar from "@/components/topbar";
import Field from "@/components/field";
import Button from "@/components/button";

export default function Settings() {
    const supabase = createClientComponentClient();
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [avatar, setAvatar] = useState("");
    const [thumbnail, setThumbnail] = useState("");
    const [bio, setBio] = useState("")
    const [sid, setSid] = useState(null)

    const [loading, setLoading] = useState(false);
    const [inputError, setInputError] = useState({
        name: null,
        username: null,
        avatar: null,
        thumbnail: null,
        bio: null,
    });

    useEffect(() => {
        async function getData() {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                window.location.href = "/";
                return;
            } else {
                setSid(session.user.id)
            }

            setAvatar(session.user.user_metadata.avatar_url);

            const { data, error } = await supabase
                .from("users")
                .select("*")
                .eq("id", session.user.id);

            if (error) {
                console.error('Error fetching data:', error);
                return;
            }

            setName(data[0]?.name || "");
            setUsername(data[0]?.username || "");
            setThumbnail(data[0]?.thumbnail || "");
            setBio(data[0]?.biography || "");
        }

        getData();
    }, []);

    function validateFields() {
        let errors = {};

        // Validations for Name
        if (!name.trim()) {
            errors.name = "Name is required";
        } else if (name.length > 40) {
            errors.name = "Name must be less than 40 characters";
        } else if (!/^[a-zA-Z ]+$/.test(name)) {
            errors.name = "Name can only contain letters and spaces";
        }

        // Validations for Username
        if (!username.trim()) {
            errors.username = "Username is required";
        } else if (!/^[a-z0-9_\.]+$/.test(username)) {
            errors.username = "Username can only contain lowercase letters, numbers, '_', and '.'";
        }

        setInputError(errors);

        return Object.keys(errors).length === 0;
    }

    async function saveChanges(e) {
        e.preventDefault();


        if (!validateFields()) {
            return;
        }

        setLoading(true)

        const { data, error } = await supabase.from("users").update([
            {
                name: name.trim(),
                username: username.trim(),
                biography: bio.trim(),
                // Add other fields like avatar and thumbnail if needed
            }
        ]).eq("id", sid)

        setLoading(false)

        if (error) {
            console.error('Error saving data:', error);
            // Handle error states or display error messages
        } else {
            console.log('Data saved successfully:', data);
            // Optionally, redirect or show success message
        }
    }

    return (
        <main>
            <Topbar loading={loading} avatar={avatar} name={name} noSearch />

            <section className="p-5 pt-28">
                <span className="font-nyght text-2xl">Settings</span>
                <form className="grid gap-4 w-full mt-5">
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
                            @{username}
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
    );
}
