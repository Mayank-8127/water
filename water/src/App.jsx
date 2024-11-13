import { useState, useEffect, useRef } from 'react'
import './App.css'
import TdsChart from './components/Tdschart';
import TempChart from './components/TempChart';
import WaterUsed from './components/WaterUsed';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
<div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Water Monitoring</h1>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500">TDS</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">{tds}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500">Temperature</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">{temp}°</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500">Water Used</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">{usage}</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>TDS Over Time</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <TdsChart data={data.slice(80, 100)} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Temperature Over Time</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <TempChart data={data.slice(80, 100)} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Water Usage Over Time</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <WaterUsed data={data.slice(80, 100)} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
</>

  )
}



export default App
