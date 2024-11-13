import { useState, useEffect, useRef } from 'react'
import './App.css'
import TdsChart from './components/Tdschart';
import TempChart from './components/TempChart';
import WaterUsed from './components/WaterUsed';

function App() {
  const [data, setData] = useState([]);

  const interval = useRef();
  
  function getHoursAndMinutes(isoString) {
    const date = new Date(isoString);
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  async function getdata(){
    let response = await fetch("https://api.thingspeak.com/channels/2716484/feeds.json");
    let Data = await response.json();
    Data = Data.feeds;
    for(let i = 0; i < Data.length; i++){
      delete Object.assign(Data[i], {["TDS"]: Data[i]["field1"] })["field1"];
      delete Object.assign(Data[i], {["Temperature"]: Data[i]["field2"] })["field2"];
      delete Object.assign(Data[i], {["Water Used"]: Data[i]["field3"] })["field3"];
      if(Data[i]["TDS"] < 0){
        Data[i]["TDS"] = 0;
      }
      Data[i]["created_at"] = getHoursAndMinutes(Data[i]["created_at"]);
    }
    setData(Data);
  }

  useEffect(() => {
    getdata();
  }, []);

  useEffect(() => {
    interval.current = setInterval(() => {
      getdata();
    },60000)

    return () => {
      clearInterval(interval.current);
    }
  },[data])

  let tds, temp, usage, t;

  try {
    t = 0;
    let j = data.length;
    for(let i = j - 20; i < j; i++){
      t += Number(data[i].TDS);
    }
    tds = t/20;
    tds = Math.round(tds);
  } catch (error) {
    tds = 'null';
  }

  try {
    temp = data[data.length - 1].Temperature;
  } catch (error) {
    temp = 'null';
  }

  try {
    usage = data[data.length - 1]["Water Used"];
  } catch (error) {
    usage = 'null'
  }


  return (
<>
    <div className="container">
        <div className="data-info">
            <div>Tds: {tds}</div>
            <div>Temp: {temp}</div>
            <div>Water used: {usage}</div>
        </div>
        <div className="chart-container">
            <TdsChart data={data.slice(80, 100)} />
        </div>
        <div className="chart-container">
            <TempChart data={data.slice(80, 100)} />
        </div>
        <div className="chart-container">
            <WaterUsed data={data.slice(80, 100)} />
        </div>
    </div>
</>

  )
}



export default App
