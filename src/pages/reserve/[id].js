import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';
import { useAuthRedirect } from '../../lib/useAuthRedirect';
import Navbar from "@/components/Navbar";
import {Alert, Box, Button, Card, CardContent, Container, TextField, Typography} from "@mui/material";

export default function ReserveDetailPage() {
    const router = useRouter();
    const { id } = router.query;
    const { user, loading } = useAuthRedirect();
    const [reservations, setReservations] = useState([]);

    const [item, setItem] = useState(null);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [message, setMessage] = useState('');

    const fetchReservations = async () => {
        const { data, error } = await supabase
            .from('ItemsToReserve')
            .select('*')
            .eq('Item', Number(id))
            .gt('end_time', new Date().toISOString()) // Показываем только активные бронирования
            .order('start_time', { ascending: true });

        if (error) {
            console.error('Ошибка загрузки бронирований:', error);
        } else {
            setReservations(data);
        }
    };

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
        fetchReservations();
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
            await fetchReservations();
        }
    };





    if (loading || !item) return <p>Загрузка...</p>;

    return (
        <Container maxWidth="sm" sx={{ pt: 4, pb: 4 }}>
            <Navbar />
            <Box sx={{ mt: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center', justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
                    <p style={{width:'200px'}}>
                    Бронирование: {item.Title} {item.Type}
                    </p>
                </Typography>

                <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: '10px' }}>
                    <CardContent>
                        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="Начало бронирования"
                                type="datetime-local"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                required
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '10px',
                                        backgroundColor: 'rgba(0,0,0,0.05)',
                                    },
                                }}
                            />
                            <TextField
                                label="Конец бронирования"
                                type="datetime-local"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                required
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '10px',
                                        backgroundColor: 'rgba(0,0,0,0.05)',
                                    },
                                }}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    backgroundColor: '#3B82F6',
                                    borderRadius: '8px',
                                    textTransform: 'none',
                                    padding: '10px 0',
                                    mt: 1,
                                }}
                            >
                                Забронировать
                            </Button>
                        </Box>
                    </CardContent>
                </Card>

                {message && (
                    <Alert
                        severity={message.includes('успешно') ? 'success' : 'error'}
                        sx={{ mt: 2, borderRadius: '10px' }}
                    >
                        {message}
                    </Alert>
                )}
            </Box>
            {reservations.length > 0 && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Текущие бронирования:
                    </Typography>
                    {reservations.map((res) => (
                        <Card key={res.id} sx={{ mb: 2, backgroundColor: '#f9f9f9', borderRadius: '10px' }}>
                            <CardContent>
                                <Typography>
                                    <strong>Пользователь:</strong> {res.User}
                                </Typography>
                                <Typography>
                                    <strong>С:</strong> {new Date(res.start_time).toLocaleString()}
                                </Typography>
                                <Typography>
                                    <strong>До:</strong> {new Date(res.end_time).toLocaleString()}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            )}
        </Container>
    );
}