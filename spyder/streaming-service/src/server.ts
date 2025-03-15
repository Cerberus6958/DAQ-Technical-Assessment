import { timeStamp } from "console";
import net from "net";
import { WebSocket, WebSocketServer } from "ws";

interface VehicleData {
  battery_temperature: number | string;
  timestamp: number;
}

const TCP_PORT = 12000;
const WS_PORT = 8080;
const tcpServer = net.createServer();
const websocketServer = new WebSocketServer({ port: WS_PORT });
let unsafeTemperature: VehicleData[] = [];

tcpServer.on("connection", (socket) => {
  console.log("TCP client connected");

  socket.on("data", (msg) => {
    const message: string = msg.toString();

    const data: VehicleData = JSON.parse(message);
    if (!Number.isFinite(data.battery_temperature) || !Number.isFinite(data.timestamp)) {
      console.log('Error: Invalid temperature');
      return;
    }
    const batteryTemperature = Number(Number(data.battery_temperature).toFixed(3))
    data.battery_temperature = batteryTemperature;
    if (batteryTemperature < 20 || batteryTemperature > 80) {
      unsafeTemperature.push({
        battery_temperature: batteryTemperature,
        timestamp: data.timestamp
      });
    }
    const unsafeTemperatures = unsafeTemperature.filter((temperature) => data.timestamp - temperature.timestamp < 5000);
    if (unsafeTemperatures.length > 3) {
      console.log(data.timestamp);
      console.log('Error: Battery is outside the safe operating range');
      return;
    }
    
    console.log(`Received: ${JSON.stringify(data)}`);
    // Send JSON over WS to frontend clients
    websocketServer.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  });

  socket.on("end", () => {
    console.log("Closing connection with the TCP client");
  });

  socket.on("error", (err) => {
    console.log("TCP client error: ", err);
  });
});

websocketServer.on("listening", () =>
  console.log(`Websocket server started on port ${WS_PORT}`)
);

websocketServer.on("connection", async (ws: WebSocket) => {
  console.log("Frontend websocket client connected");
  ws.on("error", console.error);
});

tcpServer.listen(TCP_PORT, () => {
  console.log(`TCP server listening on port ${TCP_PORT}`);
});

// function validMsg(message: number) {
//   return 0;
// }
