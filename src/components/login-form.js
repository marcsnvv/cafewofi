"use client"

import { useState } from "react"
import Button from "./button"
import Field from "./field"

export default function LoginForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [inputError, setInputError] = useState("")

    function checkPasswordStrength(password) {
        // Verificar si la contraseña contiene al menos un carácter especial, un número y una mayúscula
        const hasSpecialChar = /[@$]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasUpperCase = /[A-Z]/.test(password);

        // Devolver verdadero si cumple con los requisitos, de lo contrario, devolver falso
        return hasSpecialChar && hasNumber && hasUpperCase;
    }

    function checkFormValidation(e) {
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

    return (
        <form
            action="/auth/login"
            method="post"
            className="grid gap-4 max-w-[205px]"
        >
            <div className="grid gap-2">
                <label className={`font-bold ${inputError ? "text-red-500" : "text-gray"}`}>Email</label>
                <Field
                    className="w-auto"
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
                    type="password"
                    className="w-auto"
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
                className=""
                variant="primary"
                onClick={(e) => checkFormValidation(e)}
            >
                Log In
            </Button>
        </form>
    )
}