'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';

export async function login(formData) {
    const supabase = createClient()

    // Casteo para conveniencia, en la práctica deberías validar los inputs
    const data = {
        email: formData.get('email'),
        password: formData.get('password'),
    };

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
        redirect('/error');
    }

    revalidatePath('/', 'layout');
    redirect('/');
}

export async function loginWithGoogle() {
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
    });

    if (error) {
        redirect('/error');
    }

    revalidatePath('/', 'layout');
    redirect('/');
}

export async function loginWithTwitter() {
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'twitter',
    });

    if (error) {
        redirect('/error');
    }

    revalidatePath('/', 'layout');
    redirect('/');
}

export async function signup(formData) {
    const supabase = createClient()

    // Casteo para conveniencia, en la práctica deberías validar los inputs
    const data = {
        email: formData.get('email'),
        password: formData.get('password'),
    };

    const { error } = await supabase.auth.signUp(data);

    if (error) {
        redirect('/error');
    }

    revalidatePath('/', 'layout');
    redirect('/');
}
