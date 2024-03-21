import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { firestore } from '../../../firebase';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, ButtonBase, Button } from '@mui/material';

// project imports
import LogoSection from '../LogoSection';
import ProfileSection from './ProfileSection';
import NotificationSection from './NotificationSection';

//link router
import { Link } from 'react-router-dom';

// assets
import { IconMenu2 } from '@tabler/icons';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = ({ handleLeftDrawerToggle }) => {
    const theme = useTheme();
    // // lấy thông tin người dùng từ Current User
    // const currentUser = useSelector((state) => state.customization.currentUser);
    // const userEmail = currentUser ? currentUser : null;
    // console.log('userEmail', userEmail);
    const [isAdmin, setIsAdmin] = useState(false);
    const [haveRole, setHaveRole] = useState(false);
    useEffect(() => {
        const fetchUserRole = () => {
            const userDataString = localStorage.getItem('user');
            if (userDataString) {
                const userData = JSON.parse(userDataString);
                const role = userData.role;
                setIsAdmin(role === 'admin');
                setHaveRole('true');
            }
        };

        fetchUserRole();
    }, []);
    return (
        <>
            {/* logo & toggler button */}
            <Box
                sx={{
                    width: 228,
                    flexGrow: 2,
                    alignItems: 'center',
                    display: 'flex',
                    [theme.breakpoints.down('md')]: {
                        width: 'auto'
                    }
                }}
            >
                <Box component="span" sx={{ display: { xs: 'none', md: 'block' } }}>
                    <LogoSection />
                </Box>
                {isAdmin && (
                    <ButtonBase sx={{ borderRadius: '12px', overflow: 'hidden', marginLeft: 12 }}>
                        <Avatar
                            variant="rounded"
                            sx={{
                                ...theme.typography.commonAvatar,
                                ...theme.typography.mediumAvatar,
                                transition: 'all .2s ease-in-out',
                                background: theme.palette.secondary.light,
                                color: theme.palette.secondary.dark,
                                '&:hover': {
                                    background: theme.palette.secondary.dark,
                                    color: theme.palette.secondary.light
                                }
                            }}
                            onClick={handleLeftDrawerToggle}
                            color="inherit"
                        >
                            <IconMenu2 stroke={1.5} size="1.3rem" />
                        </Avatar>
                    </ButtonBase>
                )}
            </Box>
            {/* notification & profile */}
            {haveRole ? (
                <>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ flexGrow: 1 }} />
                    <NotificationSection />
                    <ProfileSection />
                </>
            ) : (
                <>
                    <Button disableElevation variant="contained" color="secondary" sx={{ mr: 1 }} component={Link} to="/login">
                        Đăng nhập
                    </Button>
                    <Button disableElevation variant="contained" color="secondary" component={Link} to="/register">
                        Đăng ký
                    </Button>
                </>
            )}
        </>
    );
};

Header.propTypes = {
    handleLeftDrawerToggle: PropTypes.func
};

export default Header;
