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
    Link, FormLabel,
} from '@mui/material';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        const { error } = await supabase.auth.signInWithPassword({
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
            <Container maxWidth="sm" >
                <Typography component="h1" variant="h5" marginTop={"100px"} sx={{fontSize: 28}}>
                    Добро пожаловать!
                </Typography>
                <Typography variant="body2" color="text.secondary" align="left" sx={{ mt: 1, fontSize: 14 }}>
                    Войдите, чтобы получить больше<br/> возможностей и продолжить свое дело!
                </Typography>
            </Container>

                <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 , marginTop:8}}>
                    <FormLabel sx={{color:"black"}}>Логин</FormLabel>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Логин"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '10px',
                                border: 'solid 1px black',
                            }}}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <FormLabel sx={{color:"black"}}>Пароль</FormLabel>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Введите пароль"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '10px',
                                background: 'lightGray',
                            }}}
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
                        Войти
                    </Button>
                    <Link href="/forgot-password" variant="body2">
                        Забыли пароль?
                    </Link>
                </Box>
        </Container>
    );
}
