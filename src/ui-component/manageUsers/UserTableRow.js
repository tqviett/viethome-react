import { useState } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Label from '../../components/label';
import Iconify from '../../components/iconify';

// ----------------------------------------------------------------------

export default function UserTableRow({ id, name, avatar, email, role, phone, status, handleStatusChange }) {
    const [open, setOpen] = useState(null);

    const handleOpenMenu = (event) => {
        setOpen(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setOpen(null);
    };

    const handleChangeStatus = (newStatus) => {
        handleStatusChange(id, newStatus);
        handleCloseMenu();
    };
    return (
        <>
            <TableRow hover tabIndex={-1} role="checkbox">
                <TableCell></TableCell>
                <TableCell component="th" scope="row" padding="none">
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar alt={name} src={avatar} />
                        <Typography variant="body1" noWrap>
                            {name}
                        </Typography>
                    </Stack>
                </TableCell>

                <TableCell>{email}</TableCell>

                <TableCell>{phone}</TableCell>

                <TableCell>{role}</TableCell>

                <TableCell>
                    <Label color={status === 'pending' ? 'warning' : status === 'banned' ? 'error' : 'success'}>{status}</Label>
                </TableCell>

                <TableCell align="right">
                    <IconButton onClick={handleOpenMenu}>
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                </TableCell>
            </TableRow>

            <Popover
                open={!!open}
                anchorEl={open}
                onClose={handleCloseMenu}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                    sx: { width: 140 }
                }}
            >
                <MenuItem onClick={() => handleChangeStatus('active')} sx={{ color: 'success.main', textAlign: 'center' }}>
                    active
                </MenuItem>
                <MenuItem onClick={() => handleChangeStatus('pending')} sx={{ color: 'warning.main' }}>
                    pending
                </MenuItem>
                <MenuItem onClick={() => handleChangeStatus('banned')} sx={{ color: 'error.main' }}>
                    banned
                </MenuItem>
            </Popover>
        </>
    );
}

UserTableRow.propTypes = {
    avatar: PropTypes.any,
    email: PropTypes.any,
    handleClick: PropTypes.func,
    phone: PropTypes.any,
    name: PropTypes.any,
    role: PropTypes.any,
    status: PropTypes.string,
    id: PropTypes.string,
    handleStatusChange: PropTypes.func
};
