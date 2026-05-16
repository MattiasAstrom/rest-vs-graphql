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

export const PerformanceChart = ({ data = [] }) => {
  if (!data.length) return <p>Loading...</p>;

  const chartData = {
    labels: data.map((d) => d.group),
    datasets: [
      {
        label: "REST Response Time (ms)",
        data: data.map((d) => d.restTime),
        backgroundColor: "#4A90E2",
      },
      {
        label: "GraphQL Response Time (ms)",
        data: data.map((d) => d.gqlTime),
        backgroundColor: "#7ED957",
      },
      {
        label: "REST Data Size (KB)",
        data: data.map((d) => d.restSize),
        backgroundColor: "#1F4E79",
      },
      {
        label: "GraphQL Data Size (KB)",
        data: data.map((d) => d.gqlSize),
        backgroundColor: "#2E7D32",
      },
    ],
  };

  return (
    <Bar
      data={chartData}
      options={{
        responsive: true,
        plugins: {
          legend: { position: "top" },
          title: {
            display: true,
            text: "REST vs GraphQL Performance",
          },
        },
      }}
    />
  );
};
