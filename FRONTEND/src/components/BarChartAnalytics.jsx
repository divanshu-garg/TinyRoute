import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";

const BarChartAnalytics = ({ data }) => {
  // console.log("browsers data:", data);
  data = data.map((item) => ({
    name: item._id,
    clicks: item.clicks,
  }));

  const COLORS = ["#FFBB28", "#00C49F", "#0088FE", "#FF8042", "#8884d8", "#82ca9d"];

  const calculateChartWidth = () => {
    const barCount = data.length;
    const baseWidth = 150;
    const minWidth = 300;
    const maxWidth = 700;

    const calculatedWidth = barCount * baseWidth;
    return Math.min(Math.max(calculatedWidth, minWidth), maxWidth);
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: `${calculateChartWidth()}px`,
      }}
      className="h-95 py-0"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 0,
            left: 0,
            bottom: 5,
          }}
        >
          <XAxis dataKey="name" />
          <YAxis width="auto" />
          <Tooltip />
          <Bar
            dataKey="clicks"
            barSize={80}
            fill="#FFBB28"
            activeBar={<Rectangle fill="#0088FE" stroke="purple" />}
          >
            {data.map((item, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartAnalytics;
