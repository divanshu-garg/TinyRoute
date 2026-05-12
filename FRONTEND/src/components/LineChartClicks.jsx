import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface border border-border p-3 rounded-lg shadow-xl">
        <p className="text-text-muted text-xs mb-1 font-mono">{label}</p>
        <p
          className="text-text-primary font-semibold text-sm"
          style={{ color: payload[0].color }}
        >
          {payload[0].value}{" "}
          <span className="text-text-faint font-normal">clicks</span>
        </p>
      </div>
    );
  }
  return null;
};

const LineChartClicks = ({ data, color = "#3b82f6" }) => {
  const formatted = data.map((item) => ({
    name: item._id,
    clicks: item.clicks,
  }));

  // Generating a unique ID for the gradient based on the color to prevent SVG collision
  const gradientId = `colorClicks-${color.replace("#", "")}`;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={formatted}
        margin={{ top: 5, right: 0, bottom: 0, left: -20 }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="name"
          stroke="#4a5260"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          dy={10}
        />
        <YAxis
          stroke="#4a5260"
          fontSize={11}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ stroke: "#252b33", strokeWidth: 1, strokeDasharray: "4 4" }}
        />
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#1a1f26"
          vertical={false}
        />
        <Area
          type="monotone"
          dataKey="clicks"
          stroke={color}
          strokeWidth={3}
          fillOpacity={1}
          fill={`url(#${gradientId})`}
          activeDot={{ r: 5, fill: "#0d0f11", stroke: color, strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default LineChartClicks;
