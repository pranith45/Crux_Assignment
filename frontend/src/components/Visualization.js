import React, { useState, useEffect, useRef } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';

const Visualization = ({ data }) => {
    const [visualizationType, setVisualizationType] = useState('line');
    const [chartData, setChartData] = useState({});
    const chartRef = useRef(null);
    useEffect(() => {
        // // Process 'data' and prepare chartData based on the visualization type
        // // Implement data processing based on user query results

        // setChartData(/* Processed chart data based on the visualization type */);
        if (data && data.length > 0) {
            const chartLabels = data.map(item => item.name);
            const chartValues = data.map(item => item.value);

            const new_Data = {
                labels: chartLabels,
                datasets: [
                    {
                        label: 'Values',
                        data: chartValues,
                        backgroundColor: 'black',
                    },
                ],
            };

            setChartData(new_Data);
        }
    }, [data]);
    useEffect(() => {
        // Destroy the previous chart instance when visualization type changes
        if (chartRef.current) {
            chartRef.current.destroy();
        }
    }, [visualizationType]);

    const handleVisualizationTypeChange = (type) => {
        setVisualizationType(type);
    };

    // Choose chart component based on visualization type
    const ChartComponent = {
        line: Line,
        bar: Bar,
        pie: Pie,
    }[visualizationType];
    // const ChartComponent = visualizationType === 'line' ? Line : visualizationType === 'bar' ? Bar : Pie;
    // console.log("chartData:", chartData);
    return (
        <div>
            <div>
                <button onClick={() => handleVisualizationTypeChange('line')}>Line Chart</button>
                <button onClick={() => handleVisualizationTypeChange('bar')}>Bar Chart</button>
                <button onClick={() => handleVisualizationTypeChange('pie')}>Pie Chart</button>
            </div>
            <div>
                {/* {data ? (
                    <ChartComponent data={chartData} options={{ responsive: true }} />
                ) : (
                    <p>No data available for visualization.</p>
                )} */}

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