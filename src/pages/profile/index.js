import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useUser } from '../../lib/useUser';
import { useRouter } from 'next/router';
import {Alert, Box, Button, Card, CardActions, CardContent, Container, Typography} from "@mui/material";
import Navbar from "@/components/Navbar";

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
        <Container maxWidth="sm" sx={{ pt: 4, pb: 4 }}>
            <Navbar />
            <Box sx={{ mt: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
                    Личный кабинет
                </Typography>

                {message && (
                    <Alert
                        severity={message.includes('успешно') ? 'success' : 'error'}
                        sx={{ mb: 2, borderRadius: '10px' }}
                    >
                        {message}
                    </Alert>
                )}

                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Мои бронирования:
                </Typography>

                {reservations.length === 0 ? (
                    <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary' }}>
                        У вас нет бронирований.
                    </Typography>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {reservations.map((reservation) => (
                            <Card
                                key={reservation.id}
                                sx={{
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    borderRadius: '10px',
                                    backgroundColor: '#fff',
                                }}
                            >
                                <CardContent>
                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                        Ресурс ID: {reservation.Item}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Начало: {new Date(reservation.start_time).toLocaleString()}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Конец: {new Date(reservation.end_time).toLocaleString()}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color="error"
                                        sx={{
                                            borderRadius: '8px',
                                            textTransform: 'none',
                                        }}
                                        onClick={() => handleDelete(reservation.id)}
                                    >
                                        Удалить
                                    </Button>
                                </CardActions>
                            </Card>
                        ))}
                    </Box>
                )}
            </Box>
        </Container>
    );
}