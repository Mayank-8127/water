import {LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend, Tooltip} from 'recharts';

const WaterUsed = ({data}) => {
    return(
        <ResponsiveContainer width="100%" height="100%">
            <LineChart width={500} height={300} data={data}>
                <XAxis stroke='#ddd' dataKey={"created_at"}/>
                <YAxis stroke='#ddd' />
                <CartesianGrid stroke='#666' strokeDasharray={"2 2"}/>
                <Legend/>
                <Tooltip/>
                <Line type={'monotone'} dataKey={"Water Used"} stroke='#08f' />
            </LineChart>
        </ResponsiveContainer>

    );
}

export default WaterUsed;