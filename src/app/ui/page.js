"use client"

import Link from "next/link"
import { useState } from "react"

import Button from "@/components/button"
import Label from "@/components/label"
import Action from "@/components/action"
import Field from "@/components/field"
import Modal from "@/components/modal"
import Review from "@/components/review"

import {
    Save,
    Share,
    Star,
    Verified,
    Location,
    Heart,
    PaperPlane,
    ArrowDown,
    Dollar,
    MarkerTime,
    Grid
} from "@/modules/icons"

import avatar from "../../../public/avatar.png"

import { Loading } from "@/components/loading"


export default function UI() {
    const [loading, setLoading] = useState(false)
    const [inputError, setInputError] = useState(null)
    const [formError, setFormError] = useState(null)

    const [modal, setModal] = useState(false)

    // FORM
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)

    function checkPasswordStrength(password) {
        // Verificar si la contraseña contiene al menos un carácter especial, un número y una mayúscula
        const hasSpecialChar = /[@$]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasUpperCase = /[A-Z]/.test(password);

        // Devolver verdadero si cumple con los requisitos, de lo contrario, devolver falso
        return hasSpecialChar && hasNumber && hasUpperCase;
    }

    function exampleFormValidation(e) {
        e.preventDefault()
        // Hace una validacion en el email y la password
        if (email !== null && password !== null) {
            setInputError(null)
            let isPasswordStrength = checkPasswordStrength(password)
            if (!email.includes("@")) {
                setInputError("You must enter a correct email.")
            } else if (isPasswordStrength === false) {
                setInputError("Password must include at least one special character (@ or $), one number, and one uppercase letter for security.")
            } else setInputError(null)
        } else {
            setInputError("You must enter a correct email.")
        }
    }

    function exampleTextFormValidation(e) {
        e.preventDefault()
        setFormError(true)
    }


    return (
        <section className="flex flex-col gap-6 justify-start p-10">
            <h1>Title 1</h1>
            <h2>Title 2</h2>
            <h3>Title 3</h3>
            <h4>Title 4</h4>

            <span className="font-nyght">1. Primary Button</span>

            <Button variant="primary">
                Click Me!
            </Button>

            <span className="font-nyght">Primary Button Rounded</span>

            <Button variant="primary-rounded">
                <Heart color="#fff" />
            </Button>


            {/* <button className="flex items-center justify-center gap-4 p-2 text-2xl font-bold rounded-lg w-[205px] bg-brand text-white hover:bg-lightbrand hover:text-brand hover:fill-brand">
                <Save color="#fff" />
                Click Me!
            </button> */}

            <span className="font-nyght">2. Secondary Button</span>

            <Button variant="secondary">
                Click Me!
            </Button>


            <span className="font-nyght">Secondary Button With Icon</span>

            <Button variant="secondary">
                <Save />
                Click Me!
            </Button>

            <span className="font-nyght">Secondary Button Rounded</span>

            <Button variant="secondary-rounded">
                <Save />
            </Button>


            <span className="font-nyght">3. Info Label</span>
            <Label variant="info">Info Label</Label>
            <Label variant="green">Green Label</Label>
            <Label variant="orange">Orange Label</Label>
            <Label variant="red">Red Label</Label>


            <span className="font-nyght">Info Label Rounded</span>

            <Label variant="info-rounded">
                <Save color="#111111" />
            </Label>


            <span className="font-nyght">4. Link</span>
            <Link href="/ui">
                <Action>
                    <Share color="#111111" />
                    Share
                </Action>
            </Link>

            <Link href="/ui">
                <Action>
                    <Star opacity="1" />
                    5.0
                </Action>
            </Link>

            <Link href="/ui">
                <Action>
                    <Verified />
                    Verified
                </Action>
            </Link>

            <Link href="/ui">
                <Action>
                    <Location color="#CC7843" />
                    Location
                </Action>
            </Link>

            {/* 
            
            
            INPUT 
            
            
            */}
            <span className="font-nyght">5. Input</span>
            <Field
                variant="primary"
                loading={loading}
                setLoading={setLoading}
            >
                Search a City...
            </Field>


            <span className="font-nyght">Secondary Input</span>
            <Field
                variant="secondary"
                loading={loading}
                setLoading={setLoading}
            >
                Input your email
            </Field>


            <span className="font-nyght">6. Form</span>
            <form className="grid gap-4 max-w-[205px]">
                <div className="grid gap-2">
                    <label className={`font-bold ${inputError ? "text-red-500" : "text-gray"}`}>Email</label>
                    <Field
                        variant="secondary"
                        loading={loading}
                        setLoading={setLoading}
                        error={inputError}
                        onChange={setEmail}
                    >
                        Input your email
                    </Field>
                    {/* ERROR MSG */}
                    {inputError?.toLowerCase().includes("email") && <span className="text-red-500">{inputError}</span>}
                </div>

                <div className="grid gap-2">
                    <label className={`font-bold ${inputError ? "text-red-500" : "text-gray"}`}>Password</label>
                    <Field
                        variant="secondary"
                        loading={loading}
                        setLoading={setLoading}
                        error={inputError}
                        onChange={setPassword}
                    >
                        Input your password
                    </Field>
                    {inputError?.toLowerCase().includes("password") && <span className="text-red-500">{inputError}</span>}

                </div>

                <Button
                    variant="primary"
                    onClick={(e) => exampleFormValidation(e)}
                >
                    Log In
                </Button>
            </form>


            <span className="font-nyght">Text Form</span>
            <form className="relative grid gap-4">
                <textarea
                    // onResize={ }
                    minLength={1}
                    maxLength={350}
                    rows={3}
                    wrap
                    className={`
                    ${formError
                            ? "border-2 border-red-500 bg-red-200 focus:outline-none"
                            : "focus:outline-none focus:ring-2 focus:ring-brand"}
                    bg-lightbrand rounded-lg p-4 resize-y min-h-[100px] max-h-[205px] overflow-hidden
                    `}
                    placeholder="Write a review..."
                />

                <div className="absolute right-2 bottom-2">
                    <Button
                        variant="primary-rounded"
                        onClick={(e) => exampleTextFormValidation(e)}
                    >
                        <PaperPlane size="20" color="white" />
                    </Button>
                </div>
            </form>

            {/* 
            
            USER CARD
            
            */}

            <span className="font-nyght">7. User Card</span>
            <div className="rounded-2xl bg-lightbrand p-2 px-2 flex justify-between items-center max-w-[150px]">
                <div className="flex items-center justify-center gap-2 ml-4">
                    <span>ES</span>
                    <ArrowDown color="#111111" />
                </div>

                <img
                    className="w-[45px] h-[45px] rounded-full"
                    src="/avatar.png"
                />
            </div>


            {/* 
            
            DROPDOWN

            */}

            <span className="font-nyght">8. Dropdown</span>

            <Modal
                variant="user"
                trigger={
                    <div className="rounded-2xl bg-lightbrand p-2 px-2 flex justify-between items-center max-w-[150px]">
                        <div className="flex items-center justify-center gap-2 ml-4">
                            <span>ES</span>
                            <ArrowDown color="#111111" />
                        </div>

                        <img
                            className="w-[45px] h-[45px] rounded-full"
                            src="/avatar.png"
                        />
                    </div>
                } />

            {/* 
            
            REVIEWS
            
            */}

            <span className="font-nyght">9. Reviews</span>
            <Review />
            <hr />
            <Review />
            <hr />
            <Review />


            {/* 
            
            FILTERS
            
            */}
            <span className="font-nyght">10. Filters</span>

            <div className="flex flex-wrap items-center justify-start gap-4">
                {/* FILTER */}
                <button className="flex items-center gap-2 p-1 px-4 border-2 font-medium border-gray rounded-lg hover:bg-lightgray">
                    <Dollar />
                    <span className="text-gray">Price</span>
                </button>
                <button className="flex items-center gap-2 p-1 px-4 border-2 font-medium border-gray rounded-lg hover:bg-lightgray">
                    <Star variant="none" color="#6B6F7B" />
                    <span className="text-gray">Qualification</span>
                </button>
                <button className="flex items-center gap-2 p-1 px-4 border-2 font-medium border-gray rounded-lg hover:bg-lightgray">
                    <Location variant="none" />
                    <span className="text-gray">Distance</span>
                </button>
                <button className="flex items-center gap-2 p-1 px-4 border-2 font-medium border-gray rounded-lg hover:bg-lightgray">
                    <MarkerTime />
                    <span className="text-gray">Open now</span>
                </button>
                <button className="flex items-center gap-2 p-1 px-4 border-2 font-medium border-gray rounded-lg hover:bg-lightgray">
                    <Grid />
                    <span className="text-gray">More</span>
                </button>
            </div>





        </section >
    )
}