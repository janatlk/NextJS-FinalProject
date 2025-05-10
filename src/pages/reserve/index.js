
import Link from 'next/link';

const items = [
    { id: 1, name: 'Камера Sony A7', type: 'equipment' },
    { id: 2, name: 'Кабинет 204', type: 'room' },
];

export default function ReservePage() {
    return (
        <div style={{ padding: '20px' }}>
            <h1>Бронирование оборудования</h1>
            <ul>
                {items.map(item => (
                    <li key={item.id}>
                        <Link href={`/reserve/${item.id}`}>{item.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
