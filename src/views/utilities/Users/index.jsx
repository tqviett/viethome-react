import React, { useState, useEffect } from 'react';
import {
    Select,
    OutlinedInput,
    MenuItem,
    InputLabel,
    FormControl,
    CardHeader,
    Card,
    Stack,
    Typography,
    Avatar,
    Button,
    CardActions,
    CardContent,
    Divider
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
const user = {
    name: 'Sofia Rovers',
    avatar: '/assets/avatar.png',
    jobTitle: 'Senior Developer',
    country: 'USA',
    city: 'Los Angeles',
    timezone: 'GTM-7'
};
const states = [
    { value: 'alabama', label: 'Alabama' },
    { value: 'new-york', label: 'New York' },
    { value: 'san-francisco', label: 'San Francisco' },
    { value: 'los-angeles', label: 'Los Angeles' }
];
export default function Page() {
    return (
        <Stack spacing={3}>
            <div>
                <Typography variant="h4">Account</Typography>
            </div>
            <Grid container spacing={3}>
                <Grid lg={4} md={6} xs={12}>
                    <Card>
                        <CardContent>
                            <Stack spacing={2} sx={{ alignItems: 'center' }}>
                                <div>
                                    <Avatar src={user.avatar} sx={{ height: '80px', width: '80px' }} />
                                </div>
                                <Stack spacing={1} sx={{ textAlign: 'center' }}>
                                    <Typography variant="h5">{user.name}</Typography>
                                    <Typography color="text.secondary" variant="body2">
                                        {user.city} {user.country}
                                    </Typography>
                                    <Typography color="text.secondary" variant="body2">
                                        {user.timezone}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </CardContent>
                        <Divider />
                        <CardActions>
                            <Button fullWidth variant="text">
                                Tải ảnh mới
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid lg={8} md={6} xs={12}>
                    <Card>
                        <CardHeader subheader="The information can be edited" title="Profile" />
                        <Divider />
                        <CardContent>
                            <Grid container spacing={3}>
                                <Grid md={6} xs={12}>
                                    <FormControl fullWidth required>
                                        <InputLabel>First name</InputLabel>
                                        <OutlinedInput defaultValue="Sofia" label="First name" name="firstName" />
                                    </FormControl>
                                </Grid>
                                <Grid md={6} xs={12}>
                                    <FormControl fullWidth required>
                                        <InputLabel>Last name</InputLabel>
                                        <OutlinedInput defaultValue="Rivers" label="Last name" name="lastName" />
                                    </FormControl>
                                </Grid>
                                <Grid md={6} xs={12}>
                                    <FormControl fullWidth required>
                                        <InputLabel>Email address</InputLabel>
                                        <OutlinedInput defaultValue="sofia@devias.io" label="Email address" name="email" />
                                    </FormControl>
                                </Grid>
                                <Grid md={6} xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel>Phone number</InputLabel>
                                        <OutlinedInput label="Phone number" name="phone" type="tel" />
                                    </FormControl>
                                </Grid>
                                <Grid md={6} xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel>State</InputLabel>
                                        <Select defaultValue="New York" label="State" name="state" variant="outlined">
                                            {states.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid md={6} xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel>City</InputLabel>
                                        <OutlinedInput label="City" />
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </CardContent>
                        <Divider />
                        <CardActions sx={{ justifyContent: 'flex-end' }}>
                            <Button variant="contained">Save details</Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        </Stack>
    );
}
