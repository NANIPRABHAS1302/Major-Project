import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { useTheme } from '../../context/ThemeContext';
import './Charts.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const PriorityChart = ({ data }) => {
  const { isDark } = useTheme();
  const textColor = isDark ? '#94a3b8' : '#475569';

  const chartData = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [{
      data: [data.high || 0, data.medium || 0, data.low || 0],
      backgroundColor: ['#ef4444', '#f59e0b', '#22c55e'],
      borderWidth: 0,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: textColor, padding: 16 } },
    },
  };

  return (
    <div className="chart-container">
      <h3 className="chart-title">Tasks by Priority</h3>
      <div className="chart-wrapper">
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
};

const WeeklyChart = ({ data }) => {
  const { isDark } = useTheme();
  const textColor = isDark ? '#94a3b8' : '#475569';

  const chartData = {
    labels: data.map((d) => d.day),
    datasets: [{
      label: 'Completed Tasks',
      data: data.map((d) => d.completed),
      backgroundColor: 'rgba(99, 102, 241, 0.6)',
      borderColor: '#6366f1',
      borderWidth: 2,
      borderRadius: 8,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { ticks: { color: textColor }, grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' } },
      y: { beginAtZero: true, ticks: { color: textColor, stepSize: 1 }, grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' } },
    },
  };

  return (
    <div className="chart-container">
      <h3 className="chart-title">Weekly Productivity</h3>
      <div className="chart-wrapper bar">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export { PriorityChart, WeeklyChart };
