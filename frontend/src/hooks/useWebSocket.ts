import { useEffect, useState } from "react";

export function useWebSocket() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      console.log("WS connected");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setEvents((prev) => [
        {
          ...data,
          time: new Date().toLocaleTimeString(),
        },
        ...prev.slice(0, 30),
      ]);
    };

    return () => ws.close();
  }, []);

  return events;
}