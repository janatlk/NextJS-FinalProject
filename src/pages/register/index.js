'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    Link,
    FormLabel,
} from '@mui/material';
import Image from "next/image";

export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();

        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setErrorMsg(error.message);
        } else {
            router.push('/');
        }
    };

    return (
        <Container maxWidth="sm">
            <Image src={'/images/Gradients.png'} width={420} style={{position:'absolute', bottom: 0, left: 0, zIndex: -1, transform:''}} height={420} alt={'login'}></Image>
            <Container maxWidth="sm">
                <Typography component="h1" variant="h5" marginTop={"100px"} sx={{ fontSize: 28 }}>
                    Добро пожаловать!
                </Typography>
                <Typography variant="body2" color="text.secondary" align="left" sx={{ mt: 1, fontSize: 14 }}>
                    Зарегистрируйтесь, чтобы получить больше<br /> возможностей и начать свое дело!
                </Typography>
            </Container>

            <Box component="form" onSubmit={handleRegister} sx={{ mt: 2, marginTop: 8 }}>
                <FormLabel sx={{ color: "black" }}>Почта</FormLabel>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '10px',
                        }
                    }}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <FormLabel sx={{ color: "black" }}>Пароль</FormLabel>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Введите пароль"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    value={password}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '10px',
                            background: 'rgb(10,0,0,5%)',
                        }
                    }}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {errorMsg && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {errorMsg}
                    </Alert>
                )}
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Зарегистрироваться
                </Button>
                <Link href="/login" variant="body2" marginLeft={27}>
                    Уже есть аккаунт? Войти
                </Link>


            </Box>
        </Container>
    );
}