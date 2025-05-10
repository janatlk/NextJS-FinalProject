import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useUser } from '../../lib/useUser';
import { useRouter } from 'next/router';

export default function Profile() {
    const { user, loading } = useUser();
    const router = useRouter();
    const [reservations, setReservations] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (loading) return;

        if (!user) {
            router.push('/login');
        } else {
            const fetchReservations = async () => {
                const { data, error } = await supabase
                    .from('ItemsToReserve')
                    .select('*')
                    .eq('User', user.email);

                if (error) {
                    console.error('Ошибка при загрузке бронирований:', error);
                } else {
                    setReservations(data);
                }
            };

            fetchReservations();
        }
    }, [user, loading]);

    const handleDelete = async (id) => {
        // Отправляем запрос на удаление
        const { error } = await supabase
            .from('ItemsToReserve')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Ошибка при удалении бронирования:', error);
            setMessage('Не удалось удалить бронирование.');
        } else {
            setMessage('Бронирование успешно удалено.');
            // Обновляем список бронирований без удаленного элемента
            setReservations(reservations.filter((reservation) => reservation.id !== id));
        }
    };

    if (loading) {
        return <p>Загрузка...</p>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>Личный кабинет</h1>
            {message && <p>{message}</p>}
            <h3>Мои бронирования:</h3>
            {reservations.length === 0 ? (
                <p>У вас нет бронирований.</p>
            ) : (
                <ul>
                    {reservations.map((reservation) => (
                        <li key={reservation.id}>
                            <p>Ресурс: {reservation.Item}</p>
                            <p>Начало: {new Date(reservation.start_time).toLocaleString()}</p>
                            <p>Конец: {new Date(reservation.end_time).toLocaleString()}</p>
                            <button onClick={() => handleDelete(reservation.id)}>
                                Удалить
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
