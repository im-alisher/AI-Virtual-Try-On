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
  const isSignedIn = Boolean(localStorage.getItem('token'));
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    if (!isSignedIn) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<Generation[]>('/api/history');
      setGenerations(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load history');
    } finally {
      setLoading(false);
    }
  }, [isSignedIn]);

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

  if (!isSignedIn) {
    return (
      <main className="app-container py-12">
        <div className="surface mx-auto max-w-2xl px-6 py-20 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#e8efe3] text-[#31543c]"><svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M6 10V8a6 6 0 0 1 12 0v2"/><rect x="4" y="10" width="16" height="11" rx="3"/></svg></span>
          <p className="mt-6 text-xs font-bold uppercase tracking-[.16em] text-[#6b856f]">Private wardrobe</p>
          <h1 className="display-font mt-2 text-3xl font-extrabold">Sign in to see your looks</h1>
          <p className="mx-auto mt-3 max-w-md leading-7 text-[#737c75]">Your saved try-ons are connected to your account, so they stay private and available across sessions.</p>
          <div className="mt-7 flex justify-center gap-3"><Link to="/login" className="btn-primary">Sign in</Link><Link to="/signup" className="btn-secondary">Create account</Link></div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="app-container py-12">
        <div className="surface mx-auto max-w-2xl px-6 py-16 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-red-50 text-xl font-bold text-red-600">!</span>
          <h1 className="display-font mt-4 text-2xl font-extrabold">We could not load your looks</h1>
          <p className="mt-2 text-[#737c75]">Please make sure the server is running, then try again.</p>
          <button onClick={fetchHistory} className="btn-secondary mt-6">Try again</button>
        </div>
      </main>
    );
  }

  return (
    <main className="app-container py-12">
      <div className="mb-9 flex flex-wrap items-end justify-between gap-4"><div><p className="mb-2 text-xs font-bold uppercase tracking-[.16em] text-[#6b856f]">Your wardrobe</p><h1 className="display-font text-4xl font-extrabold tracking-tight">My looks</h1><p className="mt-2 text-[#737c75]">Revisit, download, or remove your previous try-ons.</p></div><Link to="/upload" className="btn-primary">Create new look →</Link></div>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {generations.length === 0 ? (
        <div className="surface py-20 text-center text-gray-500">
          <p className="display-font text-xl font-bold text-[#26342b]">Your wardrobe is waiting</p>
          <Link to="/upload" className="mt-4 inline-block font-bold text-[#4e7358] hover:underline">Create your first look →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {generations.map((gen) => (
            <div key={gen.id} className="surface overflow-hidden !rounded-[20px] transition-transform hover:-translate-y-1">
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
                  className="text-sm font-bold text-[#355e42] hover:underline"
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
    </main>
  );
}
