import PropTypes from 'prop-types';
import { useEffect, useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import { firestore } from '../../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

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
import { AuthContext } from 'context/AuthContext';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = ({ handleLeftDrawerToggle }) => {
    const theme = useTheme();
    const { currentUser } = useContext(AuthContext);
    // lấy thông tin người dùng từ Current User
    const [isAdmin, setIsAdmin] = useState(false);
    const [haveRole, setHaveRole] = useState(false);
    const [dataForm, setDataForm] = useState([]);
    const findUser = async () => {
        try {
            const q = query(collection(firestore, 'users'), where('email', '==', currentUser.email));
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
    useEffect(() => {
        if (currentUser.email) {
            findUser();
        }
    }, [currentUser.email]);
    useEffect(() => {
        if (dataForm) {
            const role = dataForm.role;
            setIsAdmin(role === 'admin');
            setHaveRole('true');
        }
    }, [dataForm]);
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
