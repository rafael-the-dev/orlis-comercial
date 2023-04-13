import Chart from "react-apexcharts";

const BarChartContainer = ({ series, xaxis }) => {
    const options = {
        chart: {
            stacked: false,
        },
        xaxis
    };

    return (
        <Chart
            height="100%"
            options={options}
            series={series}
            type='bar'
            width="100%"
        />
    );
};

export default BarChartContainer;