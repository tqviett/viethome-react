import { useState, useRef, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Avatar,
    Box,
    Card,
    CardContent,
    Chip,
    ClickAwayListener,
    Divider,
    Grid,
    InputAdornment,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    OutlinedInput,
    Paper,
    Popper,
    Stack,
    Switch,
    Typography
} from '@mui/material';
// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import User1 from 'assets/images/users/user-round.svg';
import { SET_CURRENT_USER } from 'store/actions';
// assets
import { IconLogout, IconSearch, IconSettings, IconUser, IconBuildingStore, IconHeart } from '@tabler/icons';

// ==============================|| PROFILE MENU ||============================== //

const ProfileSection = () => {
    const theme = useTheme();
    const customization = useSelector((state) => state.customization);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [sdm, setSdm] = useState(true);
    const [value, setValue] = useState('');
    const [notification, setNotification] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [open, setOpen] = useState(false);
    /**
     * anchorRef is used on different componets and specifying one type leads to other components throwing an error
     * */
    const anchorRef = useRef(null);
    const handleLogout = async () => {
        localStorage.setItem('user', '');
        localStorage.setItem('accessToken', '');
        dispatch({ type: SET_CURRENT_USER, user: null });
        navigate('/login');
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const handleListItemClick = (event, index, route = '') => {
        setSelectedIndex(index);
        handleClose(event);

        if (route && route !== '') {
            navigate(route);
        }
    };
    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const prevOpen = useRef(open);
    const [userName, setUserName] = useState('');
    const [role, setRole] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    useEffect(() => {
        const fetchUserName = () => {
            const userDataString = localStorage.getItem('user');
            if (userDataString) {
                const userData = JSON.parse(userDataString);
                setUserName(userData.name);
                const roles = userData.role;
                setIsAdmin(roles === 'admin');
                if (roles == 'user') {
                    setRole('Người dùng');
                } else if (roles == 'admin') {
                    setRole('Quản trị viên');
                }
            }
        };

        fetchUserName();
    }, []);

    return (
        <>
            <Chip
                sx={{
                    height: '48px',
                    alignItems: 'center',
                    borderRadius: '27px',
                    transition: 'all .2s ease-in-out',
                    borderColor: theme.palette.primary.light,
                    backgroundColor: theme.palette.primary.light,
                    '&[aria-controls="menu-list-grow"], &:hover': {
                        borderColor: theme.palette.primary.main,
                        background: `${theme.palette.primary.main}!important`,
                        color: theme.palette.primary.light,
                        '& svg': {
                            stroke: theme.palette.primary.light
                        }
                    },
                    '& .MuiChip-label': {
                        lineHeight: 0
                    }
                }}
                icon={
                    <Avatar
                        src={User1}
                        sx={{
                            ...theme.typography.mediumAvatar,
                            margin: '8px -16px 8px 8px !important',
                            cursor: 'pointer'
                        }}
                        ref={anchorRef}
                        aria-controls={open ? 'menu-list-grow' : undefined}
                        aria-haspopup="true"
                        color="inherit"
                    />
                }
                variant="outlined"
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
                color="primary"
            />
            <Popper
                placement="bottom-end"
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [0, 14]
                            }
                        }
                    ]
                }}
            >
                {({ TransitionProps }) => (
                    <Transitions in={open} {...TransitionProps}>
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                                    <Box sx={{ p: 2 }}>
                                        <Stack>
                                            <Stack direction="row" spacing={0.5} alignItems="center">
                                                <Typography variant="h4">Xin chào,</Typography>
                                                <Typography component="span" variant="h4" sx={{ fontWeight: 400 }}>
                                                    {userName}
                                                </Typography>
                                            </Stack>
                                            <Typography variant="subtitle2">{role}</Typography>
                                        </Stack>
                                    </Box>
                                    <Box sx={{ p: 2 }}>
                                        <Divider />
                                        <List
                                            component="nav"
                                            sx={{
                                                width: '100%',
                                                maxWidth: 250,
                                                minWidth: 200,
                                                backgroundColor: theme.palette.background.paper,
                                                borderRadius: '10px',
                                                [theme.breakpoints.down('md')]: {
                                                    minWidth: 'auto'
                                                },
                                                '& .MuiListItemButton-root': {
                                                    mt: 0.5
                                                }
                                            }}
                                        >
                                            {!isAdmin && (
                                                <>
                                                    <ListItemButton
                                                        sx={{ borderRadius: `${customization.borderRadius}px` }}
                                                        selected={selectedIndex === 0}
                                                        onClick={(event) => handleListItemClick(event, 0, '/user')}
                                                    >
                                                        <ListItemIcon>
                                                            <IconUser stroke={1.5} size="1.3rem" />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={
                                                                <Grid container spacing={1} justifyContent="space-between">
                                                                    <Grid item>
                                                                        <Typography variant="body2">Thông tin cá nhân</Typography>
                                                                    </Grid>
                                                                </Grid>
                                                            }
                                                        />
                                                    </ListItemButton>
                                                    <ListItemButton
                                                        sx={{ borderRadius: `${customization.borderRadius}px` }}
                                                        selected={selectedIndex === 1}
                                                        onClick={(event) => handleListItemClick(event, 1, '/my-products')}
                                                    >
                                                        <ListItemIcon>
                                                            <IconBuildingStore stroke={1.5} size="1.3rem" />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={<Typography variant="body2">Nhà đang giao bán</Typography>}
                                                        />
                                                    </ListItemButton>
                                                    <ListItemButton
                                                        sx={{ borderRadius: `${customization.borderRadius}px` }}
                                                        selected={selectedIndex === 1}
                                                        onClick={(event) => handleListItemClick(event, 2, '/favorites')}
                                                    >
                                                        <ListItemIcon>
                                                            <IconHeart stroke={1.5} size="1.3rem" />
                                                        </ListItemIcon>
                                                        <ListItemText primary={<Typography variant="body2">Tin đã lưu</Typography>} />
                                                    </ListItemButton>
                                                </>
                                            )}
                                            <ListItemButton
                                                sx={{ borderRadius: `${customization.borderRadius}px` }}
                                                selected={selectedIndex === 4}
                                                onClick={handleLogout}
                                            >
                                                <ListItemIcon>
                                                    <IconLogout stroke={1.5} size="1.3rem" />
                                                </ListItemIcon>
                                                <ListItemText primary={<Typography variant="body2">Đăng xuất</Typography>} />
                                            </ListItemButton>
                                        </List>
                                    </Box>
                                </MainCard>
                            </ClickAwayListener>
                        </Paper>
                    </Transitions>
                )}
            </Popper>
        </>
    );
};

export default ProfileSection;
