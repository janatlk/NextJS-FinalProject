import { Box, Button, Typography } from '@mui/material';
import Image from "next/image"
import {router} from "next/client";
export default function onboardingPage() {

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                backgroundColor: '#fff',
                padding: '20px',
            }}
        >
            <Image
                src="/images/Group207.png"  // или относительный путь от public
                alt="Splash Image"
                width={430}               // задаёшь размеры явно
                height={550}
                style={{ marginBottom: '20px' }}
            />
            <Typography
                variant="h6"
                sx={{
                    mb: 2,
                    fontWeight: 'bold',
                    lineHeight: 1.5,
                }}
            >
                Забронируй нужный кабинет или <br />
                оборудование в пару кликов - <br />
                никаких очередей и согласований!
            </Typography>
            <Button
                onClick={(e) => {router.push('/login')}}
                variant="contained"
                sx={{
                    background: 'linear-gradient(90deg, #3B82F6 0%, #60A5FA 100%)',
                    color: '#fff',
                    mb: 2,
                    borderRadius: '8px',
                    padding: '10px 20px',
                    width: '100%',
                    maxWidth: '300px',
                }}
            >
                Войти
            </Button>
            <Button
                variant="text"
                sx={{
                    color: '#4B5563',
                    textDecoration: 'underline',
                }}
                onClick={(e) => {router.push('/register')}}>

                Зарегистрироваться
            </Button>
        </Box>
    );
}