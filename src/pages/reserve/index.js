import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser } from '../../lib/useUser';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';

export default function ReservePage() {
    const [resources, setResources] = useState([]);
    const { user, loading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading]);


    useEffect(() => {
        const fetchResources = async () => {
            const { data, error } = await supabase.from('Items').select('*');
            console.log(data)
            if (error) {
                console.error('Ошибка при загрузке данных:', error);
            } else {
                setResources(data);
            }
        };

        fetchResources();
    }, []);

    if (loading) {
        return <p>Загрузка...</p>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>Бронирование</h1>
            <ul>
                {resources.map(item => (
                    <li key={item.id}>
                        <Link href={`/reserve/${item.id}`}>{item.Title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
