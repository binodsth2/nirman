"use client";

import { useState, useEffect, useCallback } from "react";

interface QueryItem {
  id: string;
  input: string;
  output: string | null;
  createdAt: string;
}

interface ChatHistoryProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatHistory({ isOpen, onClose }: ChatHistoryProps) {
  const [history, setHistory] = useState<QueryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchHistory = useCallback(async (currentSkip: number = 0) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/nllm/history?skip=${currentSkip}&take=5`);
      const data = await res.json();
      if (data.status === "success") {
        const newHistory = data.data;
        if (currentSkip === 0) {
          setHistory(newHistory);
        } else {
          setHistory((prev) => [...prev, ...newHistory]);
        }

        if (newHistory.length < 5) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSkip(0);
      setHasMore(true);
      fetchHistory(0);
    }
  }, [isOpen, fetchHistory]);

  const loadMore = () => {
    const nextSkip = skip + 5;
    setSkip(nextSkip);
    fetchHistory(nextSkip);
  };

  return (
    <div
      className={`fixed inset-0 z-[100] transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto backdrop-blur-sm bg-black/40" : "opacity-0 pointer-events-none"
        }`}
    >
      <div
        className={`fixed inset-y-0 left-0 w-full max-w-[320px] bg-slate-950 border-r border-white/10 shadow-2xl transition-transform duration-300 ease-in-out transform ${isOpen ? "translate-x-0" : "-translate-x-full"
          } flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
            History
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {isLoading && history.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/30 text-sm italic">No history found</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="group relative bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl p-4 transition-all duration-200 cursor-default"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-medium text-blue-400 uppercase tracking-wider">Query</span>
                    <span className="text-[10px] text-white/20">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-200 line-clamp-2 leading-relaxed">
                    {item.input}
                  </p>

                  {item.output && (
                    <div className="mt-2 pt-2 border-t border-white/5">
                      <span className="text-[10px] font-medium text-green-400 uppercase tracking-wider block mb-1">Response</span>
                      <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                        {item.output}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          {/* Load More */}
          {hasMore && history.length > 0 && (
            <div className="pt-4">
              <button
                onClick={loadMore}
                disabled={isLoading}
                className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs font-semibold text-white/60 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {isLoading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
