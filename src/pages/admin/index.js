// admin panel enhanced with CRUD
import { useEffect, useState } from 'react';
import { useUser } from '../../lib/useUser';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';
import Navbar from "@/components/Navbar";
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from '@mui/material';

export default function AdminPage() {
    const { user, loading } = useUser();
    const [isAdmin, setIsAdmin] = useState(false);
    const [currentSection, setCurrentSection] = useState('Items');
    const [data, setData] = useState([]);
    const [message, setMessage] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [formState, setFormState] = useState({});
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) router.push('/login');
    }, [user, loading]);

    useEffect(() => {
        if (user) {
            const checkAdmin = async () => {
                const { data, error } = await supabase
                    .from('adminList')
                    .select('role')
                    .eq('user_id', user.id)
                    .single();

                if (data?.role === 'admin') setIsAdmin(true);
                else router.push('/');
            };
            checkAdmin();
        }
    }, [user]);

    useEffect(() => {
        if (isAdmin) fetchTable(currentSection);
    }, [isAdmin, currentSection]);

    const fetchTable = async (table) => {
        const { data, error } = await supabase.from(table).select('*');
        if (error) {
            console.error(error);
            setMessage('Ошибка при загрузке данных');
        } else {
            setData(data);
        }
    };

    const handleDelete = async (id) => {
        const { error } = await supabase.from(currentSection).delete().eq('id', id);
        if (error) setMessage('Ошибка при удалении');
        else setData(data.filter(item => item.id !== id));
    };

    const handleEdit = (row) => {
        setEditItem(row);
        setFormState(row);
        setOpenDialog(true);
    };

    const handleAddNew = () => {
        setEditItem(null);
        setFormState({});
        setOpenDialog(true);
    };

    const handleSave = async () => {
        let result;
        if (editItem) {
            result = await supabase.from(currentSection).update(formState).eq('id', editItem.id);
        } else {
            result = await supabase.from(currentSection).insert(formState);
        }

        if (result.error) {
            console.error(result.error);
            setMessage('Ошибка при сохранении');
        } else {
            setOpenDialog(false);
            fetchTable(currentSection);
            setMessage('Сохранено успешно');
        }
    };

    const handleChange = (e) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    if (loading || !isAdmin) return <p>Загрузка...</p>;

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Navbar />
            <Typography variant="h4" gutterBottom>Админ-панель</Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                {['Items', 'ItemsToReserve', 'adminList'].map(section => (
                    <Button
                        key={section}
                        variant={currentSection === section ? 'contained' : 'outlined'}
                        onClick={() => setCurrentSection(section)}
                    >{section}</Button>
                ))}
            </Box>

            <Button variant="contained" onClick={handleAddNew} sx={{ mb: 2 }}>Добавить</Button>
            {message && <Typography color="error" variant="body2">{message}</Typography>}

            <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            {data[0] && Object.keys(data[0]).map((key) => (
                                <TableCell key={key}>{key}</TableCell>
                            ))}
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row) => (
                            <TableRow key={row.id}>
                                {Object.keys(row).map((key) => (
                                    <TableCell key={key}>{String(row[key])}</TableCell>
                                ))}
                                <TableCell>
                                    <Button onClick={() => handleEdit(row)}>Редактировать</Button>
                                    <Button onClick={() => handleDelete(row.id)} color="error">Удалить</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{editItem ? 'Редактировать' : 'Добавить'} запись</DialogTitle>
                <DialogContent>
                    {Object.keys(data[0] || { field: '' }).map((key) => (
                        key === 'id' && editItem ? null : (
                            <TextField
                                key={key}
                                margin="dense"
                                name={key}
                                label={key}
                                fullWidth
                                value={formState[key] || ''}
                                onChange={handleChange}
                                variant="standard"
                            />
                        )
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Отмена</Button>
                    <Button onClick={handleSave} variant="contained">Сохранить</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}