import PropTypes from 'prop-types';
// @mui
import { Grid } from '@mui/material';
import ShopChatCard from './ChatCard';

// ----------------------------------------------------------------------

ChatList.propTypes = {
    users: PropTypes.array.isRequired
};

export default function ChatList({ users, ...other }) {
    return (
        <Grid container spacing={3} {...other}>
            {users.map((user) => (
                <Grid key={user.id} item xs={12} sm={6} md={3}>
                    <ShopChatCard user={user} />
                </Grid>
            ))}
        </Grid>
    );
}
