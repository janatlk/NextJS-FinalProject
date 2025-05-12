'use client';

import { useUser } from '../lib/useUser';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LogoutButton from '../components/LogoutButton';
export default function HomePage() {
    const { user, loading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading]);

    if (loading) return <p>Загрузка...</p>;
    if (!user) return null; // пока редирект

    return (
        <div style={{ padding: '20px' }}>
            <h1>Добро пожаловать, {user.email}</h1>
            <p>Вы авторизованы! 123</p>
            <LogoutButton></LogoutButton>
        </div>
    );
}
