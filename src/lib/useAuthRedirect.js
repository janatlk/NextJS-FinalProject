import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from './useUser';

export function useAuthRedirect() {
    const { user, loading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading]);

    return { user, loading };
}