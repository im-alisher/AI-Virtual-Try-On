import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';

interface Generation {
  id: string;
  personImageUrl: string;
  clothingImageUrl: string;
  clothingCategory: string;
  resultImageUrl?: string;
  status: string;
  createdAt: string;
}

export default function HistoryPage() {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await api.get<Generation[]>('/api/history');
      setGenerations(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load history');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await api.delete(`/api/history/${id}`);
      setGenerations((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Generation History</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {generations.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>No generations yet.</p>
          <Link to="/upload" className="text-indigo-600 hover:underline">Create your first one</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {generations.map((gen) => (
            <div key={gen.id} className="bg-white rounded-lg shadow overflow-hidden">
              {gen.resultImageUrl ? (
                <img src={gen.resultImageUrl} alt="Result" className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                  {gen.status}
                </div>
              )}
              <div className="p-4">
                <p className="text-sm text-gray-500 mb-2">
                  {new Date(gen.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-700 mb-3 capitalize">{gen.clothingCategory}</p>
                <div className="flex gap-2">
                  <Link
                    to={`/result/${gen.id}`}
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    View
                  </Link>
                  {gen.resultImageUrl && (
                    <a
                      href={gen.resultImageUrl}
                      download
                      className="text-sm text-gray-600 hover:underline"
                    >
                      Download
                    </a>
                  )}
                  <button
                    onClick={() => handleDelete(gen.id)}
                    className="text-sm text-red-600 hover:underline ml-auto"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
