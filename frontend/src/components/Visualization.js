import React, { useState, useEffect, useRef } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';

const Visualization = ({ data }) => {
    const [visualizationType, setVisualizationType] = useState('line');
    const [chartData, setChartData] = useState({
        data: {
            labels: ['catA', 'catB', 'catC'], // Initialize with default labels
            datasets: [
                {
                    label: 'Values',
                    data: [3, 17, 87], // Initialize with default data
                    backgroundColor: 'black',
                },
            ],
        },
        options: {
            scales: {
                x: {
                    type: 'category',
                    labels: ['catA', 'catB', 'catC'], // Initialize with default labels
                },
                y: {
                    type: 'linear',
                    beginAtZero: true,
                },
            },
        },
    });
    const chartRef = useRef(null);

    useEffect(() => {
        if (data && Array.isArray(data) && data.length > 0) {
            const chartLabels = data.map(item => item.name);
            const chartValues = data.map(item => item.value);

            setChartData({
                data: {
                    labels: chartLabels,
                    datasets: [
                        {
                            label: 'Values',
                            data: chartValues,
                            backgroundColor: 'black',
                        },
                    ],
                },
                options: {
                    scales: {
                        x: {
                            type: 'category',
                            labels: chartLabels,
                        },
                        y: {
                            type: 'linear',
                            beginAtZero: true,
                        },
                    },
                },
            });
        }
    }, [data]);

    useEffect(() => {
        // Destroy the previous chart instance when visualization type changes
        if (chartRef.current) {
            chartRef.current.chartInstance.destroy();
        }
    }, [visualizationType]);

    const handleVisualizationTypeChange = (type) => {
        setVisualizationType(type);
    };

    const ChartComponent = {
        line: Line,
        bar: Bar,
        pie: Pie,
    }[visualizationType];

    return (
        <div>
            <div>
                <button onClick={() => handleVisualizationTypeChange('line')}>Line Chart</button>
                <button onClick={() => handleVisualizationTypeChange('bar')}>Bar Chart</button>
                <button onClick={() => handleVisualizationTypeChange('pie')}>Pie Chart</button>
            </div>
            <div>
                {chartData ? (
                    <ChartComponent ref={chartRef} data={chartData} options={{ responsive: true }} />
                ) : (
                    <p>No data available for visualization.</p>
                )}
            </div>
        </div>
    );
};

export default Visualization;

