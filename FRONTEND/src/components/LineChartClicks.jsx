import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const LineChartClicks = ({ data }) => {
  const formatted = data.map((item) => ({
    name: item._id,
    clicks: item.clicks,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={formatted}
        margin={{ top: 5, right: 5, bottom: 5, left: 0 }}
      >
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
     <CartesianGrid strokeDasharray="3 3" stroke="#d8d9ddff" />
        <Line
          type="monotone"
          dataKey="clicks"
          stroke="#0088FE"
          // stroke="#FF8042"
          strokeWidth={3}
          dot={{ strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartClicks;
