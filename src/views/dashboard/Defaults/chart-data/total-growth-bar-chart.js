// ===========================|| DASHBOARD - TOTAL GROWTH BAR CHART ||=========================== //

import { useEffect, useState } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { firestore } from '../../../../firebase';
import { FIRESTORE } from '../../../../constants';
import Chart from 'react-apexcharts';
const TotalChartdata = () => {
    const [products, setProducts] = useState([]);
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
        fetchChartData();
    }, []);
    const fetchChartData = async () => {
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

                if (data.type.value === 'nhaTro') {
                    res.series[0].data[monthIndex] += 1;
                } else if (data.type.value === 'phongTro') {
                    res.series[1].data[monthIndex] += 1;
                } else if (data.type.value === 'chungCuMini') {
                    res.series[2].data[monthIndex] += 1;
                }
            });

            setChartData(res);
        } catch (error) {
            console.error('Error fetching chart data:', error);
        }
    };

    return <Chart options={chartData.options} series={chartData.series} type="bar" height={480} />;
};

export default TotalChartdata;
