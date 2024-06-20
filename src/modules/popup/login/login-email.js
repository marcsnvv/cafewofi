"use client"

import { Close } from '@/modules/icons'
import LoginForm from '@/components/login-form'

export default function SignUpWithEmail({
    closeModal,
    changeToLogin
}) {
    return (
        <div className='p-10 flex flex-col items-center gap-4'>
            <label className="font-nyght text-2xl">Login</label>

            <LoginForm
                closeModal={closeModal}
                changeToLogin={changeToLogin}
            />
        </div>
    )
}