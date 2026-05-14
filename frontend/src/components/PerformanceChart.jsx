import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export const PerformanceChart = ({ data }) => {
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        label: "Response Time (ms)",
        data: data.map((d) => d.time),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
      {
        label: "Data Size (KB)",
        data: data.map((d) => d.size),
        backgroundColor: "rgba(153, 102, 255, 0.5)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "API Performance Comparison" },
    },
  };

  return <Bar data={chartData} options={options} />;
};
