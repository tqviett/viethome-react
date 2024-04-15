import { useState, useRef, useEffect, useContext } from 'react';

import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { doc, updateDoc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { firestore } from '../../../../firebase';

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
// assets
import { IconLogout, IconSearch, IconSettings, IconUser, IconBuildingStore, IconHeart, IconMessage } from '@tabler/icons';
import { AuthContext } from 'context/AuthContext';

// ==============================|| PROFILE MENU ||============================== //

const ProfileSection = () => {
    const theme = useTheme();
    const customization = useSelector((state) => state.customization);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [dataForm, setDataForm] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [open, setOpen] = useState(false);

    //get user in local storage
    const user = localStorage.getItem('user');
    const userInfo = user ? JSON.parse(user) : null;

    /**
     * anchorRef is used on different componets and specifying one type leads to other components throwing an error
     * */
    const anchorRef = useRef(null);
    const handleLogout = async () => {
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken', '');
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
    const [role, setRole] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    useEffect(() => {
        if (userInfo) {
            const roles = userInfo.role;
            setIsAdmin(roles === 'admin');
            if (roles == 'user') {
                setRole('Người dùng');
            } else if (roles == 'admin') {
                setRole('Quản trị viên');
            }
        }
    }, [userInfo]);

    useEffect(() => {
        if (userInfo.email) {
            findUser();
        }
    }, [userInfo.email]);

    const findUser = async () => {
        try {
            const q = query(collection(firestore, 'users'), where('email', '==', userInfo.email));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                const dataProduct = doc.data();
                setDataForm({
                    ...dataProduct,
                    avatar: dataProduct.avatar
                });
            });
        } catch (error) {
            console.error('Error finding user:', error);
        }
    };

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
                        src={dataForm.avatar}
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
                                                    {dataForm.name}
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
                                            <ListItemButton
                                                sx={{ borderRadius: `${customization.borderRadius}px` }}
                                                selected={selectedIndex === 0}
                                                onClick={(event) => handleListItemClick(event, 0, '/profile')}
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
                                            {!isAdmin && (
                                                <>
                                                    <ListItemButton
                                                        sx={{ borderRadius: `${customization.borderRadius}px` }}
                                                        selected={selectedIndex === 1}
                                                        onClick={(event) => handleListItemClick(event, 1, `/user/my-products`)}
                                                    >
                                                        <ListItemIcon>
                                                            <IconBuildingStore stroke={1.5} size="1.3rem" />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={<Typography variant="body2">Nhà đang giao bán</Typography>}
                                                        />
                                                    </ListItemButton>
                                                </>
                                            )}
                                            <ListItemButton
                                                sx={{ borderRadius: `${customization.borderRadius}px` }}
                                                selected={selectedIndex === 2}
                                                onClick={(event) => handleListItemClick(event, 2, '/messages')}
                                            >
                                                <ListItemIcon>
                                                    <IconMessage stroke={1.5} size="1.3rem" />
                                                </ListItemIcon>
                                                <ListItemText primary={<Typography variant="body2">Tin nhắn</Typography>} />
                                            </ListItemButton>
                                            <ListItemButton
                                                sx={{ borderRadius: `${customization.borderRadius}px` }}
                                                selected={selectedIndex === 3}
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
