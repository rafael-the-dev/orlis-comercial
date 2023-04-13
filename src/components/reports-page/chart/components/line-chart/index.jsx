import Chart from "react-apexcharts";

const LineChartContainer = ({ data, series, xaxis }) => {
    
    const options = {
        stroke: {
            curve: 'smooth',
        },
        xaxis
    };

    return (
        <Chart
            height="100%"
            options={options}
            series={series}
            width="100%"
        />
    );
};

export default LineChartContainer;