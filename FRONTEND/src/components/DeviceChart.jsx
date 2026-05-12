import {
  Cell,
  Legend,
  Pie,
  PieChart,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CHART_COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ec4899"];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface border border-border p-2.5 rounded-lg shadow-xl flex items-center gap-2">
        <div
          className="size-2 rounded-full"
          style={{ backgroundColor: payload[0].payload.fill }}
        />
        <span className="text-text-primary text-sm font-medium">
          {payload[0].name}:
        </span>
        <span className="text-text-muted text-sm">{payload[0].value}</span>
      </div>
    );
  }
  return null;
};

const DeviceChart = ({ data }) => {
  const formattedData = data.map((item) => ({
    name: item._id,
    value: item.count,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={formattedData}
          innerRadius="60%"
          outerRadius="80%"
          paddingAngle={2}
          dataKey="value"
          stroke="none"
        >
          {formattedData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={CHART_COLORS[index % CHART_COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign="bottom"
          height={36}
          iconType="circle"
          wrapperStyle={{ color: "#8b9299", fontSize: "12px" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default DeviceChart;
