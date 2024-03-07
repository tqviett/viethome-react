import PropTypes from 'prop-types';
// @mui
import { Box, Card, Link, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
// utils
import { fCurrency } from 'utils/formatNumber';
// components
import Label from 'components/label';
import { ColorPreview } from 'components/color-utils';
import { useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------

const StyledChatAvartar = styled('avatar')({});

// ----------------------------------------------------------------------

ShopChatCard.propTypes = {
    user: PropTypes.object
};

export default function ShopChatCard({ user }) {
    const { name } = user;
    const navigate = useNavigate();
    return (
        <Card onClick={() => navigate(`/products/${id}`)}>
            <Stack spacing={2} sx={{ p: 3 }}>
                <Link color="inherit" underline="hover">
                    <Typography variant="subtitle1" noWrap>
                        {name}
                    </Typography>
                </Link>
            </Stack>
        </Card>
    );
}
