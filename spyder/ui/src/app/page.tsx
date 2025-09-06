"use client"

import { useState, useEffect } from "react"
import useWebSocket, { ReadyState } from "react-use-websocket"
import { useTheme } from "next-themes"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Thermometer } from "lucide-react"
import Numeric from "../components/custom/numeric"
import RedbackLogoDarkMode from "../../public/logo-darkmode.svg"
import RedbackLogoLightMode from "../../public/logo-lightmode.svg"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts"

const WS_URL = "ws://localhost:8080"

interface VehicleData {
  battery_temperature: number
  timestamp: number
}

interface Data {
  data: VehicleData[]
}

// let tempHistory = []

/**
 * Page component that displays DAQ technical assessment. Contains the LiveValue component as well as page header and labels.
 * Could this be split into more components?...
 *
 * @returns {JSX.Element} The rendered page component.
 */
export default function Page(): JSX.Element {
  const { theme } = useTheme()
  const [temperature, setTemperature] = useState<any>(0)
  const [connectionStatus, setConnectionStatus] = useState<string>("Disconnected")
  // const [temperatureHistory, setTemperatureHistory] = useState<
  // console.log("ReadState", ReadyState);
  const { lastJsonMessage, readyState }: { lastJsonMessage: VehicleData | null; readyState: ReadyState } = useWebSocket(
    WS_URL,
    {
      share: false,
      shouldReconnect: () => true,
    },
  )
  const [temperatureHistory, setTemperatureHistory] = useState<
    { timestamp: number; battery_temperature: number; }[]
  >([]);

  useEffect(() => {
    if (lastJsonMessage === null) {
      return
    }

    setTemperatureHistory((prev) => {
        const newData = [...prev, { timestamp: lastJsonMessage.timestamp, battery_temperature: lastJsonMessage.battery_temperature }];

        // Keep last 20 points
        if (newData.length > 20) newData.shift();
        console.log(newData)

        return newData;
    });
  });
  // console.log("ReadState2", readyState);

  /**
   * Effect hook to handle WebSocket connection state changes.
   */
  useEffect(() => {
    switch (readyState) {
      case ReadyState.OPEN:
        console.log("Connected to streaming service")
        setConnectionStatus("Connected")
        break
      case ReadyState.CLOSED:
        console.log("Disconnected from streaming service")
        setConnectionStatus("Disconnected")
        break
      case ReadyState.CONNECTING:
        setConnectionStatus("Connecting")
        break
      default:
        setConnectionStatus("Disconnected")
        break
    }
  });

  /**
   * Effect hook to handle incoming WebSocket messages.
   */
  useEffect(() => {
    console.log("Received: ", lastJsonMessage)
    if (lastJsonMessage === null) {
      return
    }
    setTemperature(lastJsonMessage.battery_temperature)

    // setTemperatureHistory((prev) => [
    //   ...prev.slice(-19),

    // ])
  }, [lastJsonMessage])

  /**
   * Effect hook to set the theme to dark mode.
   */
  // useEffect(() => {
  //   setTheme("dark")
  // }, [setTheme])
  const regex = new RegExp('^Error')
  const isValidTemperature = regex.test(temperature)



  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-5 h-20 flex items-center gap-5 border-b">
        <Image
          src={theme === "light" ? RedbackLogoDarkMode : RedbackLogoLightMode} 
          className="h-12 w-auto"
          alt="Redback Racing Logo"
        />
        <h1 className="text-foreground text-xl font-semibold">DAQ Technical Assessment</h1>
        <Badge variant={connectionStatus === "Connected" ? "success" : "destructive"} className="ml-auto">
          {connectionStatus}
        </Badge>
        <ModeToggle />
      </header>
      <main className="flex-grow flex items-start justify-start p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-light flex items-center gap-2">
              <Thermometer className="h-6 w-6" />
              Live Battery Temperature
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">            
            <Numeric temp={isValidTemperature ? '-' : temperature} />
          </CardContent>
        </Card>
      </main>
      <main className="flex-grow flex items-end justify-end p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-light flex items-center gap-2">
              Error Message Interface
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center text-5xl">
            <Numeric temp={isValidTemperature ? temperature : '-'} />
          </CardContent>
        </Card>
      </main>
      <main className="flex-grow flex items-end justify-start p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-light flex items-center gap-2">
              Temperature Graph
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <TempGraph data={temperatureHistory} />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

function TempGraph({ data }: Data) {
  return (
    <LineChart width={730} height={250} data={data}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="timestamp" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="Temperature" stroke="#8884d8" />
    </LineChart>
  )
}

