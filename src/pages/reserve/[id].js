import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';

export default function ResourcePage() {
    const [resource, setResource] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reservationData, setReservationData] = useState({
        start: '',
        end: '',
        user: ''
    });

    const router = useRouter();
    const { id } = router.query; // Получаем параметр id из URL

    useEffect(() => {
        // Если id еще не получен
        if (!id) return;

        const fetchResource = async () => {
            const { data, error } = await supabase
                .from('Items')
                .select('*')
                .eq('id', id)
                .single(); // Мы ожидаем только один объект

            if (error) {
                setError(error.message);
            } else {
                setResource(data);
            }
            setLoading(false);
        };

        fetchResource();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setReservationData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleReservation = async (e) => {
        e.preventDefault();

        const { start, end, user } = reservationData;

        if (!start || !end || !user) {
            setError('Пожалуйста, заполните все поля.');
            return;
        }

        const { error } = await supabase
            .from('ItemsToReserve')
            .insert([
                {
                    Item: id,
                    User: user,
                    start_time: start,
                    end_time: end,
                }
            ]);

        if (error) {
            setError('Ошибка при создании бронирования: ' + error.message);
        } else {
            alert('Ресурс успешно забронирован!');
            router.push('/reserve');
        }
    };

    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div>Ошибка: {error}</div>;
    }

    if (!resource) {
        return <div>Ресурс не найден.</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>{resource.name}</h1>
            <p><strong>Тип:</strong> {resource.type}</p>
            <p><strong>Описание:</strong> {resource.description}</p>

            <h2>Забронировать ресурс</h2>
            <form onSubmit={handleReservation}>
                <div>
                    <label>Имя пользователя:</label>
                    <input
                        type="text"
                        name="user"
                        value={reservationData.user}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Дата начала:</label>
                    <input
                        type="datetime-local"
                        name="start"
                        value={reservationData.start}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Дата окончания:</label>
                    <input
                        type="datetime-local"
                        name="end"
                        value={reservationData.end}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Забронировать</button>
            </form>
        </div>
    );
}
