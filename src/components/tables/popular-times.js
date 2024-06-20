// components/PopularTimesColumnChart.js
import React from 'react'
import Chart from 'react-apexcharts'
import { parseData } from '../../utils/parse-data'

const PopularTimesColumnChart = ({ data }) => {
    const parsedData = parseData(data)

    const chartOptions = {
        chart: {
            type: 'bar',
            height: 350,
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                colors: {
                    backgroundBarColors: ['#cc7843'],
                },
            },
        },
        xaxis: {
            categories: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        },
        series: parsedData,
    };

    return (
        <div className="max-w-sm w-full bg-white rounded-lg shadow p-4 md:p-6">
            <Chart options={chartOptions} series={chartOptions.series} type="bar" height={350} />
        </div>
    );
};

export default PopularTimesColumnChart;
