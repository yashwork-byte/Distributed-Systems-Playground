export default function TaskTable({ tasks }: any) {
  return (
    <div className="bg-[#1e293b] p-5 rounded-2xl shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Tasks</h2>

      <table className="w-full text-sm">
        <thead className="text-gray-400 border-b border-gray-700">
          <tr>
            <th className="text-left py-2">ID</th>
            <th>Status</th>
            <th>Attempts</th>
          </tr>
        </thead>

        <tbody>
          {tasks.map((t: any) => (
            <tr
              key={t.id}
              className="border-b border-gray-800 hover:bg-[#334155]"
            >
              <td className="py-2">{t.id}</td>

              <td className="capitalize">
                <span
                  className={
                    t.status === "completed"
                      ? "text-green-400"
                      : t.status === "failed"
                      ? "text-red-400"
                      : t.status === "running"
                      ? "text-blue-400"
                      : "text-yellow-400"
                  }
                >
                  {t.status}
                </span>
              </td>

              <td>{t.attempts}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}