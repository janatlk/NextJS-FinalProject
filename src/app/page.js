'use client';

import { useUser } from '../lib/useUser';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import LogoutButton from '../components/LogoutButton';
import { Box, Container, Card, CardContent, CardActions, Button, Typography } from '@mui/material';
import Input from '@mui/joy/Input';
import Image from 'next/image';
import styles from './page.module.css';
import Navbar from '@/components/Navbar';

export default function HomePage() {
    const { user, loading } = useUser();
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);
    const [resources, setResources] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    // Fetch resources from API route
    useEffect(() => {
        const fetchResources = async () => {
            const { data, error } = await supabase.from('Items').select('*');
            if (error) {
                setError('Ошибка при загрузке данных:', error);
            } else {
                setResources(data);
            }
        };

        fetchResources();
    }, []);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/onboarding');
        }
    }, [user, loading]);

    if (loading) return <p>Загрузка...</p>;
    if (!user) return <h1>Перенаправление на логин.</h1>;

    return (
        <Container maxWidth="sm">
            <Image
                src={'/images/Group 208.png'}
                alt="Background Image 1"
                width={430}
                height={240}
                style={{ position: 'absolute', zIndex: -1, left: 0, bottom: 0 }}
            />
            <Navbar />
            <div style={{ marginTop: 45, position: 'relative' }}>

                <div style={{ padding: '25px', paddingBottom: '10px', paddingLeft: '10px' }}>
                    <p className={styles.Title2}>Привет, {user.email}</p>
                </div>
                <div style={{ width: '100%', height: '230px', position: 'relative' }}>
                    <Image
                        src={'/images/Rectangle.png'}
                        alt="Background Image 2"
                        width={399}
                        height={100}
                        style={{ position: 'absolute', zIndex: -1 }}
                    />
                    <div className={styles.Box1}>
                        <p className={styles.Title1}>Начнём Искать!</p>
                        <div>
                            <Image src={'/images/12.png'} alt="Icon" width={180} height={180} />
                        </div>
                    </div>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <Input
                            placeholder={'Поиск'}
                            sx={{ width: 350 }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Resource Cards Section */}
                <Box sx={{ mt: 4, mb: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}>
                        Ресурсы
                    </Typography>
                    {resources.map((resource) => {
                        const matchesSearch = (
                            (resource.Title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (resource.Type || '').toLowerCase().includes(searchTerm.toLowerCase())
                        );
                        return (

                            <Card
                                key={resource.id}
                                sx={{
                                    mb: 2,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    borderRadius: '10px',
                                    backgroundColor: '#fff',
                                    display: matchesSearch ? 'block' : 'none',
                                }}
                            >
                                <CardContent>
                                    <Typography variant="h6" sx={{fontWeight: 'bold'}}>
                                        {resource.Title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Тип: {resource.Type}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{justifyContent: 'flex-end', p: 2}}>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        sx={{
                                            backgroundColor: '#3B82F6',
                                            borderRadius: '8px',
                                            textTransform: 'none',
                                        }}
                                        onClick={() => router.push(`/reserve/${resource.id}`)} // Replace with your route
                                    >
                                        Забронировать
                                    </Button>
                                </CardActions>
                            </Card>
                        );
                    })
                    }
                </Box>
            </div>
        </Container>
    );
}