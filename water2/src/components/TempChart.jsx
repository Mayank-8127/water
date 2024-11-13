import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const TempChart = ({ data }) => {
  const maxValue = Math.round(Math.max(...data.map(item => item.Temperature)))+10;
  const minValue = Math.round(Math.min(...data.map(item => item.Temperature)))-10;


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
          domain={[
            minValue,  // min value with padding
            maxValue   // max value with padding
          ]}
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
          dataKey="Temperature"
          stroke="#ef4444"  // Modern red color for temperature
          strokeWidth={2}
          dot={false}
          activeDot={{
            r: 4,
            stroke: '#ef4444',
            strokeWidth: 2,
            fill: 'white'
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TempChart;