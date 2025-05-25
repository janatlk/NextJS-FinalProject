'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => setMenuOpen(!menuOpen);

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
                <li><Link href="/resources">Ресурсы</Link></li>
                <li><Link href="/bookings">Бронирования</Link></li>
                <li><Link href="/profile">Профиль</Link></li>
            </ul>
        </nav>
    );
}
