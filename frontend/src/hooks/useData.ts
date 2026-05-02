import { useEffect, useState } from "react";

export function useData() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      const t = await fetch("http://localhost:3000/tasks");
      const m = await fetch("http://localhost:3000/metrics");

      const tasksData = await t.json();
      const metricsData = await m.json();

      setTasks(tasksData);
      setMetrics(metricsData);
    }

    fetchData();
    const interval = setInterval(fetchData, 3000);

    return () => clearInterval(interval);
  }, []);

  return { tasks, metrics };
}