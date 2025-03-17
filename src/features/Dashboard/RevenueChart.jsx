import { formatVND } from '@/utils/formatVND';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const RevenueChart = ({ totalRevenue }) => {
  // Format data for chart display
  const formattedData =
    totalRevenue?.monthlyTotals?.map(item => {
      // Format date as MM-YYYY
      const month = String(item._id.month).padStart(2, '0');
      const year = item._id.year;
      const formattedDate = `${month}-${year}`;

      return {
        name: formattedDate,
        revenue: item.totalAmount,
      };
    }) || [];

  // Custom tooltip to display formatted currency values
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: '#fff',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        >
          <p>
            <strong>{label}</strong>
          </p>
          <p style={{ color: '#000', fontWeight: 'normal' }}>
            Revenue: {formatVND(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer
      width={'100%'}
      height={360}
      style={{ marginInline: 'auto' }}
    >
      <BarChart data={formattedData} margin={{ top: 20, right: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          /* label={{
            value: 'Month-Year',
            position: 'insideBottom',
            offset: -10,
          }} */
        />
        <YAxis
          tickFormatter={formatVND}
          /* label={{
            value: 'Revenue (VND)',
            angle: -90,
            position: 'insideLeft',
          }} */
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend verticalAlign="top" height={36} />
        <Bar
          name="Monthly Revenue"
          dataKey="revenue"
          fill="black"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RevenueChart;
