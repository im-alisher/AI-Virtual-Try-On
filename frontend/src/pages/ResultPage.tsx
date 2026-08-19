import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../lib/api';
import ImageComparisonSlider from '../components/ImageComparisonSlider';
import ZoomableImage from '../components/ZoomableImage';

interface GenerationStatus {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  personImageUrl?: string;
  resultImageUrl?: string;
  error?: string;
}

export default function ResultPage() {
  const { id } = useParams<{ id: string }>();
  const [status, setStatus] = useState<GenerationStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'slider' | 'side-by-side'>('slider');

  const pollStatus = useCallback(async () => {
    if (!id) return true;
    try {
      const res = await api.get<GenerationStatus>(`/api/ai/status/${id}`);
      setStatus(res.data);
      return res.data.status === 'completed' || res.data.status === 'failed';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check status');
      return true;
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    let active = true;
    const poll = async () => {
      while (active) {
        const done = await pollStatus();
        if (done || !active) break;
        await new Promise((r) => setTimeout(r, 3000));
      }
    };
    poll();
    return () => { active = false; };
  }, [id, pollStatus]);

  if (error) {
    return (
      <div className="min-h-screen p-8 flex flex-col items-center justify-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Link to="/upload" className="text-indigo-600 hover:underline">Try again</Link>
      </div>
    );
  }

  if (!status || status.status === 'pending' || status.status === 'processing') {
    return (
      <div className="min-h-screen p-8 flex flex-col items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full mb-4" />
        <p className="text-gray-600">
          {status?.status === 'processing' ? 'Generating your try-on...' : 'Starting generation...'}
        </p>
      </div>
    );
  }

  if (status.status === 'failed') {
    return (
      <div className="min-h-screen p-8 flex flex-col items-center justify-center">
        <p className="text-red-600 mb-2">Generation failed</p>
        <p className="text-gray-500 text-sm mb-4">{status.error || 'Unknown error'}</p>
        <Link to="/upload" className="text-indigo-600 hover:underline">Try again</Link>
      </div>
    );
  }

  return (
    <main className="app-container py-12">
      <div className="mb-7 text-center"><div className="mb-3 inline-flex rounded-full bg-[#e8efd9] px-3 py-1 text-xs font-bold uppercase tracking-[.16em] text-[#527047]">Look complete ✦</div><h1 className="display-font text-4xl font-extrabold tracking-tight">Your try-on result</h1><p className="mt-2 text-[#737c75]">Drag the slider to reveal your transformation.</p></div>

      <div className="flex justify-center gap-2 mb-6">
        <button
          onClick={() => setView('slider')}
          className={`px-4 py-2 text-sm font-bold rounded-full ${view === 'slider' ? 'bg-[#173f2d] text-white' : 'bg-white border border-[#dedfd8] text-gray-700'}`}
        >
          Comparison Slider
        </button>
        <button
          onClick={() => setView('side-by-side')}
          className={`px-4 py-2 text-sm font-bold rounded-full ${view === 'side-by-side' ? 'bg-[#173f2d] text-white' : 'bg-white border border-[#dedfd8] text-gray-700'}`}
        >
          Side by Side
        </button>
      </div>

      <div className="flex justify-center mb-8">
        {view === 'slider' && status.personImageUrl && status.resultImageUrl ? (
          <ImageComparisonSlider beforeUrl={status.personImageUrl} afterUrl={status.resultImageUrl} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            {status.personImageUrl && (
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">Original</p>
                <ZoomableImage src={status.personImageUrl} alt="Original" />
              </div>
            )}
            {status.resultImageUrl && (
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">Result</p>
                <ZoomableImage src={status.resultImageUrl} alt="Result" />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-center gap-4">
        <Link
          to="/upload"
          className="btn-primary"
        >
          New Generation
        </Link>
        {status.resultImageUrl && (
          <a
            href={status.resultImageUrl}
            download
            className="btn-secondary"
          >
            Download
          </a>
        )}
      </div>
    </main>
  );
}
