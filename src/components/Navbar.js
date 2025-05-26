'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';
import {supabase} from "../lib/supabaseClient";
import {useUser} from "../lib/useUser";

export default function Navbar() {
    const { user, loading } = useUser();
    const [menuOpen, setMenuOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const toggleMenu = () => setMenuOpen(!menuOpen);
    useEffect(() => {
        if (user) {
            const checkAdmin = async () => {
                const { data, error } = await supabase
                    .from('adminList')
                    .select('role')
                    .eq('user_id', user.id)
                    .single();

                if (data && data.role === 'admin') {
                    setIsAdmin(true);
                }
            };

            checkAdmin();
        }
    }, [user]);

    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>
                <Link href="/">eduSlot</Link>
            </div>

            <div className={styles.hamburger} onClick={toggleMenu}>
                ☰
            </div>

            <ul className={`${styles.navLinks} ${menuOpen ? styles.active : ''}`}>
                <li><Link href="/">Главная</Link></li>
                <li><Link href="/reserve">Ресурсы</Link></li>
                <li><Link href="/profile">Профиль</Link></li>
                {isAdmin && (
                    <li><Link href="/admin">База данных</Link></li>
                )}
            </ul>
        </nav>
    );
}
