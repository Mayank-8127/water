import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const WaterUsed = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis 
          dataKey="created_at"
          stroke="#94a3b8"
          fontSize={12}
          tickLine={false}
        />
        <YAxis 
          stroke="#94a3b8"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <CartesianGrid 
          stroke="#e2e8f0"
          strokeDasharray="3 3"
          vertical={false}
        />
        <Tooltip 
          contentStyle={{
            background: 'white',
            border: 'none',
            borderRadius: '6px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            padding: '8px'
          }}
          labelStyle={{ color: '#64748b' }}
        />
        <Line 
          type="monotone"
          dataKey="Water Used"
          stroke="#3b82f6"  // Modern blue color for water usage
          strokeWidth={2}
          dot={false}
          activeDot={{
            r: 4,
            stroke: '#3b82f6',
            strokeWidth: 2,
            fill: 'white'
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default WaterUsed;