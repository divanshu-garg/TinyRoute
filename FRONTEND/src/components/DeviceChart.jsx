import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";

const DeviceChart = ({ data }) => {
  data = data.map((item) => ({
    name: item._id,
    value: item.count,
  }));

  const COLORS = ["#FFBB28", "#00C49F", "#0088FE", "#FF8042"];
  console.log("data:", data);

  return (
    <PieChart
      style={{
        width: "100%",
        maxWidth: "500px",
        maxHeight: "80vh",
        aspectRatio: 1,
      }}
      responsive
    >
      <Pie
        data={data}
        labelLine={false}
        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
        fill="#8884d8"
        dataKey="value"
        isAnimationActive={true}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${entry.name}`} fill={COLORS[index]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default DeviceChart;
