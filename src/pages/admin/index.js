import { useEffect, useState } from 'react';
import { useUser } from '../../lib/useUser';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';

export default function AdminPage() {
    const { user, loading } = useUser();
    const [isAdmin, setIsAdmin] = useState(false);
    const [currentSection, setCurrentSection] = useState('items');
    const [data, setData] = useState([]);
    const [message, setMessage] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
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

                if (data && data.role === 'admin') {
                    setIsAdmin(true);
                } else {
                    router.push('/');
                }
            };

            checkAdmin();
        }
    }, [user]);

    useEffect(() => {
        if (isAdmin) {
            fetchTable(currentSection);
        }
    }, [isAdmin, currentSection]);

    const fetchTable = async (table) => {
        const { data, error } = await supabase.from(table).select('*');
        if (error) {
            console.error(error);
            setMessage('Ошибка при загрузке данных');
        } else {
            setData(data);
        }
    };

    const handleDelete = async (id) => {
        const { error } = await supabase.from(currentSection).delete().eq('id', id);
        if (error) {
            setMessage('Ошибка при удалении');
        } else {
            setData(data.filter(item => item.id !== id));
        }
    };

    if (loading || !isAdmin) return <p>Загрузка...</p>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>Админ-панель</h1>
            <div style={{ marginBottom: '10px' }}>
                <button onClick={() => setCurrentSection('Items')}>Оборудование</button>
                <button onClick={() => setCurrentSection('ItemsToReserve')}>Бронирования</button>
                <button onClick={() => setCurrentSection('adminList')}>Админы</button>
                <button onClick={() => setCurrentSection('users')}>Пользователи</button>
            </div>

            <h2>Таблица: {currentSection}</h2>
            {message && <p>{message}</p>}
            {data.length === 0 ? (
                <p>Нет данных.</p>
            ) : (
                <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse' }}>
                    <thead>
                    <tr>
                        {Object.keys(data[0]).map((key) => (
                            <th key={key}>{key}</th>
                        ))}
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((row) => (
                        <tr key={row.id}>
                            {Object.keys(row).map((key) => (
                                <td key={key}>{String(row[key])}</td>
                            ))}
                            <td>
                                <button onClick={() => handleDelete(row.id)}>Удалить</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
