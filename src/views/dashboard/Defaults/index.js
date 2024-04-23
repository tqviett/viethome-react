import { Helmet } from 'react-helmet-async';

import { useEffect, useState } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project imports
import NhaTro from './NhaTro';
import ChungCuMN from './ChungCuMN';
import PopularCard from './PopularCard';
import TotalOrderLineChartCard from './PhongTro';
import TotalGrowthBarChart from './TotalGrowthBarChart';
import { gridSpacing } from 'store/constant';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        <>
            <Helmet>
                <title>THỐNG KÊ | VIET-HOME </title>
            </Helmet>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Grid container spacing={gridSpacing}>
                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <NhaTro isLoading={isLoading} />
                        </Grid>
                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <TotalOrderLineChartCard isLoading={isLoading} />
                        </Grid>
                        <Grid item lg={4} md={12} sm={12} xs={12}>
                            <ChungCuMN isLoading={isLoading} />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12} md={12}>
                            <TotalGrowthBarChart isLoading={isLoading} />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

export default Dashboard;
