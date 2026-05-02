export default function Metrics({ metrics }: any) {
  if (!metrics) return null;

  const items = [
    { label: "Total", value: metrics.total },
    { label: "Queued", value: metrics.queued },
    { label: "Running", value: metrics.running },
    { label: "Completed", value: metrics.completed },
    { label: "DLQ", value: metrics.dead_letter },
  ];

  return (
    <div className="bg-[#1e293b] p-5 rounded-2xl shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Metrics</h2>

      <div className="space-y-2">
        {items.map((item) => (
          <div className="flex justify-between">
            <span className="text-gray-400">{item.label}</span>
            <span className="font-semibold">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}