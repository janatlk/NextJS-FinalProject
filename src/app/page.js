'use client';

import { useUser } from '../lib/useUser';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {useState} from "react";
import { supabase } from '../lib/supabaseClient';
import LogoutButton from '../components/LogoutButton';
export default function HomePage() {
    const { user, loading } = useUser();
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/onboarding');
        }
    }, [user, loading]);

    useEffect(() => {
        if (user) {
            const checkAdmin = async () => {
                const { data, error } = await supabase
                    .from('adminList')
                    .select('role')
                    .eq('user_id', user.id)
                    .single();
                console.log('Admin check:', data, error);
                if (data && data.role === 'admin') {
                    setIsAdmin(true);
                }
            };

            checkAdmin();
        }
    }, [user]);

    if (loading) return <p>Загрузка...</p>;
    if (!user) return null; // пока редирект

    return (
        <div style={{ padding: '20px' }}>
            <h1>Добро пожаловать, {user.email}, {isAdmin && <p>Admin</p>}</h1>
            <p>Вы авторизованы!</p>
            <LogoutButton></LogoutButton>
        </div>
    );
}
