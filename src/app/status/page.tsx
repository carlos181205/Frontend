"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, ExternalLink, Activity } from "lucide-react";

export default function StatusPage() {
  const [health, setHealth] = useState<{ status: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/health")
      .then(res => res.json())
      .then(data => setHealth(data))
      .catch(() => setHealth({ status: "offline" }))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-10">
      <div className="text-center">
        <Activity className="mx-auto h-12 w-12 text-indigo-500" />
        <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">Estado del Sistema</h1>
        <p className="mt-2 text-gray-500 dark:text-zinc-400">
          Monitoreo de servicios y documentación técnica.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden dark:bg-zinc-900 border dark:border-zinc-800">
        <ul className="divide-y divide-gray-200 dark:divide-zinc-800">
          <li className="px-6 py-5 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900 dark:text-white">API REST (FastAPI)</span>
              <span className="text-xs text-gray-500">http://localhost:8000/api/v1</span>
            </div>
            {loading ? (
              <span className="animate-pulse h-4 w-12 bg-gray-200 rounded dark:bg-zinc-700"></span>
            ) : health?.status === "ok" ? (
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-5 w-5 mr-1" />
                <span className="text-sm font-medium">En línea</span>
              </div>
            ) : (
              <div className="flex items-center text-red-600">
                <XCircle className="h-5 w-5 mr-1" />
                <span className="text-sm font-medium">Fuera de línea</span>
              </div>
            )}
          </li>
          
          <li className="px-6 py-5 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900 dark:text-white">Documentación Swagger</span>
              <span className="text-xs text-gray-500">OpenAPI Specification</span>
            </div>
            <a 
              href="http://localhost:8000/api/v1/docs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-500 text-sm font-medium"
            >
              Abrir Docs
              <ExternalLink className="ml-1 h-4 w-4" />
            </a>
          </li>
        </ul>
      </div>

      <div className="text-center text-xs text-gray-400">
        Versión del Sistema: 1.0.0 (SENA ADSO 2026)
      </div>
    </div>
  );
}
