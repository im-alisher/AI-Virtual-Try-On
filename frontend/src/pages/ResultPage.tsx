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
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">Your Try-On Result</h1>

      <div className="flex justify-center gap-2 mb-6">
        <button
          onClick={() => setView('slider')}
          className={`px-4 py-2 text-sm rounded-lg ${view === 'slider' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
        >
          Comparison Slider
        </button>
        <button
          onClick={() => setView('side-by-side')}
          className={`px-4 py-2 text-sm rounded-lg ${view === 'side-by-side' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
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
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          New Generation
        </Link>
        {status.resultImageUrl && (
          <a
            href={status.resultImageUrl}
            download
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Download
          </a>
        )}
      </div>
    </div>
  );
}
