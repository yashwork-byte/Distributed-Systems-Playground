import Metrics from "./components/Metrics";
import Timeline from "./components/Timeline";
import TaskTable from "./components/TaskTable";

import { useWebSocket } from "./hooks/useWebSocket";
import { useData } from "./hooks/useData";

export default function App() {
  const events = useWebSocket();
  const { tasks, metrics } = useData();

  return (
    <div className="bg-[#0f172a] min-h-screen text-white p-6">
      <h1 className="text-3xl font-bold mb-6">
        Distributed System Dashboard
      </h1>

      {/* GRID */}
      <div className="grid grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="col-span-1 space-y-6">
          <Metrics metrics={metrics} />
        </div>

        {/* RIGHT */}
        <div className="col-span-2 space-y-6">
          <Timeline events={events} />
          <TaskTable tasks={tasks} />
        </div>

      </div>
    </div>
  );
}