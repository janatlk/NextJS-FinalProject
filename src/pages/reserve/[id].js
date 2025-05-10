import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';
import { useAuthRedirect } from '../../lib/useAuthRedirect';

export default function ReserveDetailPage() {
    const router = useRouter();
    const { id } = router.query;
    const { user, loading } = useAuthRedirect();

    const [item, setItem] = useState(null);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!id || !user) return;

        const fetchItem = async () => {
            const { data, error } = await supabase
                .from('Items')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Ошибка загрузки ресурса:', error);
            } else {
                setItem(data);
            }
        };

        fetchItem();
    }, [id, user]);





    const handleSubmit = async (e) => {
        e.preventDefault();

        const start = new Date(startTime);
        const end = new Date(endTime);
        const now = new Date();

        // 1. Проверка: конец позже начала
        if (end <= start) {
            setMessage('Время окончания должно быть позже начала.');
            return;
        }

        // 2. Проверка: нельзя бронировать в прошлом
        if (start < now) {
            setMessage('Нельзя бронировать время в прошлом.');
            return;
        }

        // 3. Проверка: конфликтов с другими бронями
        const { data: existing, error: conflictError } = await supabase
            .from('ItemsToReserve')
            .select('*')
            .eq('Item', Number(id))
            .or(`and(start_time.lt.${endTime},end_time.gt.${startTime})`);

        if (conflictError) {
            console.error('Ошибка при проверке конфликта:', conflictError);
            setMessage('Ошибка при проверке конфликта.');
            return;
        }

        if (existing.length > 0) {
            setMessage('Выбранное время уже занято. Пожалуйста, выберите другое.');
            return;
        }

        // 4. Запись в таблицу
        const { error } = await supabase.from('ItemsToReserve').insert({
            Item: Number(id),
            User: user.email,
            start_time: startTime,
            end_time: endTime,
        });

        if (error) {
            console.error('Ошибка при создании бронирования:', error);
            setMessage('Ошибка при создании бронирования.');
        } else {
            setMessage('Бронирование успешно!');
        }
    };





    if (loading || !item) return <p>Загрузка...</p>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>Бронирование: {item.Title}</h1>

            <form onSubmit={handleSubmit}>
                <label>Начало бронирования:</label><br />
                <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                /><br />

                <label>Конец бронирования:</label><br />
                <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                /><br /><br />

                <button type="submit">Забронировать</button>
            </form>

            {message && <p>{message}</p>}
        </div>
    );
}
