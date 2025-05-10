import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const router = useRouter();

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
        <div style={{ padding: '20px' }}>
            <h1>Регистрация</h1>
            <form onSubmit={handleRegister}>
                <input
                    type="email"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                /><br />
                <input
                    type="password"
                    placeholder="Пароль"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                /><br />
                <button type="submit">Зарегистрироваться</button>
            </form>
            {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
        </div>
    );
}
