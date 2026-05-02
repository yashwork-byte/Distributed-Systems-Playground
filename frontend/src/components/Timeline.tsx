const getColor = (type: string) => {
  if (type.includes("FAILED")) return "text-red-400";
  if (type.includes("COMPLETED")) return "text-green-400";
  if (type.includes("RETRY")) return "text-yellow-400";
  return "text-blue-400";
};

export default function Timeline({ events }: any) {
  return (
    <div className="bg-[#1e293b] p-5 rounded-2xl shadow-lg h-[300px] overflow-auto">
      <h2 className="text-lg font-semibold mb-4">Live Timeline</h2>

      <div className="space-y-2 text-sm">
        {events.map((e: any, i: number) => (
          <div key={i} className="flex gap-2">
            <span className="text-gray-500">[{e.time}]</span>
            <span className={getColor(e.type)}>
              {e.type}
            </span>
            <span className="text-gray-300">
              → Task {e.taskId}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}