import { useState, useEffect, useRef } from 'react'
import './App.css'
import TdsChart from './components/Tdschart';
import TempChart from './components/TempChart';
import WaterUsed from './components/WaterUsed';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

function App() {
  const [data, setData] = useState([]);

  const interval = useRef();
  
  function getHoursAndMinutes(isoString) {
    const date = new Date(isoString);
    
    // Add 5 hours and 30 minutes
    let hours = date.getUTCHours() + 5;
    let minutes = date.getUTCMinutes() + 30;
    
    // Handle minute overflow
    if (minutes >= 60) {
      minutes -= 60;
      hours += 1;
    }
    
    // Handle hour overflow
    if (hours >= 24) {
      hours -= 24;
    }
  
    // Format hours and minutes as two-digit strings
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    
    return `${formattedHours}:${formattedMinutes}`;
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
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Water Monitoring System</h1>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500">Average TDS Value</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${tds > 200 ? 'text-red-600' : 'text-gray-900'}`}>
                {tds}
              </p>
              
              {tds > 200 && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Critical TDS Level</AlertTitle>
                  <AlertDescription>
                    Change your water filter as soon as possible. High TDS levels can affect water quality.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500">Temperature</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">{temp}°C</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500">Total Water Used</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">{usage}L</p>
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
              <TdsChart data={data.slice(1, 100)} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Temperature Over Time</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <TempChart data={data.slice(1, 100)} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Total Water Usage Over Time</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <WaterUsed data={data.slice(1, 100)} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
</>

  )
}



export default App
