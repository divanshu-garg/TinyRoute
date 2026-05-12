import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";

// A beautiful, dark-mode friendly charting palette
const CHART_COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#10b981",
  "#f59e0b",
  "#ec4899",
  "#14b8a6",
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface border border-border p-3 rounded-lg shadow-xl">
        <p className="text-text-muted text-xs mb-1 font-mono uppercase">
          {label}
        </p>
        <p className="text-text-primary font-semibold text-sm">
          {payload[0].value}{" "}
          <span className="text-text-faint font-normal">clicks</span>
        </p>
      </div>
    );
  }
  return null;
};

const BarChartAnalytics = ({ data }) => {
  const formattedData = data.map((item) => ({
    name: item._id,
    clicks: item.clicks,
  }));

  const calculateChartWidth = () => {
    const barCount = formattedData.length;
    const baseWidth = 100;
    const minWidth = 300;
    return Math.max(barCount * baseWidth, minWidth);
  };

  return (
    <div
      style={{ width: "100%", maxWidth: `${calculateChartWidth()}px` }}
      className="h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={formattedData}
          margin={{ top: 5, right: 0, left: -20, bottom: 5 }}
        >
          <XAxis
            dataKey="name"
            stroke="#8b9299"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis
            stroke="#8b9299"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#1a1f26" }} />
          <Bar dataKey="clicks" radius={[4, 4, 0, 0]} maxBarSize={60}>
            {formattedData.map((item, index) => (
              <Cell
                key={`cell-${index}`}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartAnalytics;
