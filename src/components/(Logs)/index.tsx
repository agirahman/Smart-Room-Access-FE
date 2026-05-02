// src/app/dashboard/logs/page.tsx
import { getLogs } from "@/libs/action/data";

export default async function LogsPage() {
  const apiResponse = await getLogs(); // Memanggil data langsung dari backend
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Akses Log Terbaru</h1>
      <div className="rounded-lg shadow">
        {apiResponse.logs.map((log) => (
          <div key={log.id} className="p-4 border-b last:border-0">
            <p className="font-medium">{log.user_name} - {log.room}</p>
            <span className={log.status === 'allowed' ? 'text-green-500' : 'text-red-500'}>
              {log.status.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
