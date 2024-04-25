import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, MenuItem, TextField, Typography } from '@mui/material';

// third-party
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

// project imports
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// chart data
import TotalChartdata from './chart-data/total-growth-bar-chart';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

//base
import { getDocs, collection } from 'firebase/firestore';
import { firestore } from '../../../firebase';
import { FIRESTORE } from '../../../constants';
const status = [
    {
        value: '',
        label: 'Cả năm'
    },
    {
        value: '1',
        label: 'Tháng 1'
    },
    {
        value: '2',
        label: 'Tháng 2'
    },
    {
        value: '3',
        label: 'Tháng 3'
    },
    {
        value: '4',
        label: 'Tháng 4'
    },
    {
        value: '5',
        label: 'Tháng 5'
    },
    {
        value: '6',
        label: 'Tháng 6'
    },
    {
        value: '7',
        label: 'Tháng 7'
    },
    {
        value: '8',
        label: 'Tháng 8'
    },
    {
        value: '9',
        label: 'Tháng 9'
    },
    {
        value: '10',
        label: 'Tháng 10'
    },
    {
        value: '11',
        label: 'Tháng 11'
    },
    {
        value: '12',
        label: 'Tháng 12'
    }
];

// ==============================|| DASHBOARD DEFAULT - TOTAL GROWTH BAR CHART ||============================== //

const TotalGrowthBarChart = ({ isLoading }) => {
    const [value, setValue] = useState('');
    const [year, setYear] = useState(dayjs(new Date()));
    const converTime = (time) => `${new Date(time).getFullYear()}`;
    const [chartData, setChartData] = useState({
        series: [
            {
                name: 'Nhà Trọ',
                data: [],
                color: '#5e35b1'
            },
            {
                name: 'Phòng Trọ',
                data: [],
                color: '#1e88e5'
            },
            {
                name: 'Chung Cư Mini',
                data: [],
                color: '#ffc107'
            }
        ],
        options: {
            chart: {
                id: 'bar-chart',
                // stacked: true,
                toolbar: {
                    show: true
                },
                zoom: {
                    enabled: true
                }
            },
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        legend: {
                            position: 'bottom',
                            offsetX: -10,
                            offsetY: 0
                        }
                    }
                }
            ],
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '50%'
                }
            },
            xaxis: {
                type: 'category',
                categories: [
                    'Tháng 1',
                    'Tháng 2',
                    'Tháng 3',
                    'Tháng 4',
                    'Tháng 5',
                    'Tháng 6',
                    'Tháng 7',
                    'Tháng 8',
                    'Tháng 9',
                    'Tháng 10',
                    'Tháng 11',
                    'Tháng 12'
                ]
            },
            legend: {
                show: true,
                fontSize: '14px',
                fontFamily: `'Roboto', sans-serif`,
                position: 'bottom',
                offsetX: 20,
                labels: {
                    useSeriesColors: false
                },
                markers: {
                    width: 16,
                    height: 16,
                    radius: 5
                },
                itemMargin: {
                    horizontal: 15,
                    vertical: 8
                }
            },
            fill: {
                type: 'solid'
            },
            dataLabels: {
                enabled: false
            },
            grid: {
                show: true
            }
        }
    });

    useEffect(() => {
        fetchChartData(value, year);
    }, [value, year]);
    const fetchChartData = async (selectedValue, selectedYear) => {
        try {
            const docRefs = await getDocs(collection(firestore, FIRESTORE.PRODUCTS));
            let res = JSON.parse(JSON.stringify(chartData));

            res.series.forEach((item) => {
                item.data = new Array(12).fill(0);
            });

            docRefs.forEach((product) => {
                const data = product.data();
                const createdAtTimestamp = data.created_at;
                const createdAt = new Date(parseInt(createdAtTimestamp));
                const monthIndex = createdAt.getMonth();
                const yearIndex = createdAt.getFullYear();
                if (selectedValue) {
                    if (monthIndex === selectedValue - 1 && yearIndex.toString() === converTime(selectedYear)) {
                        if (data.type.value === 'nhaTro') {
                            res.series[0].data[selectedValue - 1] += 1;
                        } else if (data.type.value === 'phongTro') {
                            res.series[1].data[selectedValue - 1] += 1;
                        } else if (data.type.value === 'chungCuMini') {
                            res.series[2].data[selectedValue - 1] += 1;
                        }
                    }
                } else {
                    if (yearIndex.toString() === converTime(selectedYear)) {
                        // Chuyển đổi yearIndex thành chuỗi trước khi so sánh
                        if (data.type.value === 'nhaTro') {
                            res.series[0].data[monthIndex] += 1;
                        } else if (data.type.value === 'phongTro') {
                            res.series[1].data[monthIndex] += 1;
                        } else if (data.type.value === 'chungCuMini') {
                            res.series[2].data[monthIndex] += 1;
                        }
                    }
                }
            });

            setChartData(res);
        } catch (error) {
            console.error('Error fetching chart data:', error);
        }
    };
    return (
        <>
            {isLoading ? (
                <SkeletonTotalGrowthBarChart />
            ) : (
                <MainCard>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12}>
                            <Grid container alignItems="center" justifyContent="space-between">
                                <Grid item>
                                    <Grid container direction="column" spacing={1}>
                                        {/* <Grid item>
                                            <Typography variant="subtitle2">Total Growth</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="h3">$2,324.00</Typography>
                                        </Grid> */}
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            views={['year']}
                                            label="Năm"
                                            value={year}
                                            onChange={(time) => {
                                                setYear(time);
                                                setValue('');
                                            }}
                                            renderInput={(params) => <TextField {...params} helperText={null} />}
                                            sx={{ width: 150, mr: 1 }}
                                        />
                                        <TextField
                                            label="Tháng"
                                            id="standard-select-currency"
                                            select
                                            value={value}
                                            onChange={(e) => setValue(e.target.value)}
                                            sx={{ width: 150 }}
                                        >
                                            {status.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </LocalizationProvider>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Chart options={chartData.options} series={chartData.series} type="bar" height={480} />
                        </Grid>
                    </Grid>
                </MainCard>
            )}
        </>
    );
};

TotalGrowthBarChart.propTypes = {
    isLoading: PropTypes.bool
};

export default TotalGrowthBarChart;
