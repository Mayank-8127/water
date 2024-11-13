import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const TdsChart = ({ data }) => {
    // Calculate min and max values from your data
    const maxValue = Math.round(Math.max(...data.map(item => item.TDS)))+10;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis 
          dataKey="created_at"
          stroke="#94a3b8"  // Subtle gray for axis
          fontSize={12}
          tickLine={false}  // Remove tick lines for cleaner look
        />
        <YAxis 
          stroke="#94a3b8"
          fontSize={12}
          tickLine={false}
          axisLine={false}  // Remove axis line for minimal look
          domain={[
            0,  // min value with padding
            maxValue   // max value with padding
          ]}
        />
        <CartesianGrid 
          stroke="#e2e8f0"  // Very light gray for grid
          strokeDasharray="3 3"
          vertical={false}  // Only show horizontal grid lines
        />
        <Tooltip 
          contentStyle={{
            background: 'white',
            border: 'none',
            borderRadius: '6px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            padding: '8px'
          }}
          labelStyle={{ color: '#64748b' }}  // Slate gray for tooltip label
        />
        <Line 
          type="monotone"
          dataKey="TDS"
          stroke="#22c55e"  // Modern green color
          strokeWidth={2}   // Slightly thicker line
          dot={false}       // Remove dots for cleaner look
          activeDot={{      // Show dot only on hover
            r: 4,
            stroke: '#22c55e',
            strokeWidth: 2,
            fill: 'white'
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TdsChart;