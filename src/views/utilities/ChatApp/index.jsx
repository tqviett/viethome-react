import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Stack, Typography, Grid } from '@mui/material';
// import component chat
import Sidebar from './sidebar';
import Chat from './chat';

// ----------------------------------------------------------------------

export default function ChatsPage() {
    return (
        <Container className="home">
            <Grid className="container">
                <Sidebar />
                <Chat />
            </Grid>
        </Container>
    );
}
