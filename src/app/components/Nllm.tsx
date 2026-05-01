"use client";

import { useState } from "react";

// Define the Query type based on the expected API response
interface QueryItem {
  id: string;
  input: string;
  output: string | null;
  createdAt: string;
}

export default function Nllm() {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "waiting" | "accepted">("idle");

  // History State
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [history, setHistory] = useState<QueryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const handleSubmit = async () => {
    console.log("Input Value ::::::::::::::10Nllm.tsx", input);

    try {
      const res = await fetch("/api/auth/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input }),
      });

      const data = await res.json();

      if (data.status === "waiting") {
        setStatus("waiting");
      } else if (data.status === "accepted") {
        setStatus("accepted");
        setInput("");
      } else {
        setStatus("idle");
      }
    } catch (error) {
      console.error("Error:", error);
      setStatus("idle");
    }
  };

  const fetchHistory = async (currentSkip: number = 0) => {
    setIsLoadingHistory(true);
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
      setIsLoadingHistory(false);
    }
  };

  const loadMoreHistory = () => {
    const nextSkip = skip + 5;
    setSkip(nextSkip);
    fetchHistory(nextSkip);
  };

  const toggleHistory = () => {
    if (!isHistoryOpen) {
      setSkip(0);
      setHasMore(true);
      fetchHistory(0);
    }
    setIsHistoryOpen(!isHistoryOpen);
  };

  return (
    <main className="min-h-screen bg-blue-900 flex flex-col items-center justify-center p-4 sm:p-6 text-slate-200 w-full relative overflow-hidden font-sans">

      {/* History Modal Overlay (Glassmorphism) */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ease-out p-4 sm:p-6
          ${isHistoryOpen ? "opacity-100 pointer-events-auto backdrop-blur-sm bg-black/40" : "opacity-0 pointer-events-none"}
        `}
      >
        {/* Modal Content */}
        <div
          className={`w-full max-w-3xl max-h-[85vh] flex flex-col bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl overflow-hidden transition-transform duration-300 transform 
            ${isHistoryOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"}
          `}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
            <h2 className="text-xl font-semibold text-white tracking-wide">Previous Queries</h2>
            <button
              onClick={toggleHistory}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
              aria-label="Close history"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          {/* Modal Body (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {isLoadingHistory ? (
              <div className="flex justify-center items-center h-32 space-x-2">
                <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            ) : history.length === 0 ? (
              <p className="text-center text-white/50 italic">No history found.</p>
            ) : (
              history.map((item) => (
                <div key={item.id} className="bg-black/20 rounded-xl p-5 border border-white/5 hover:bg-black/30 transition-colors group">
                  <div className="flex flex-col gap-3">
                    {/* Question */}
                    <div className="flex items-start gap-3">
                      <div className="mt-1 min-w-[24px] flex justify-center text-blue-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                      </div>
                      <p className="text-gray-200 font-medium leading-relaxed">{item.input}</p>
                    </div>
                    {/* Answer */}
                    {item.output && (
                      <div className="flex items-start gap-3 ml-2 pl-4 border-l-2 border-white/10 mt-2">
                        <div className="mt-1 min-w-[24px] flex justify-center text-green-400">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                        </div>
                        <p className="text-gray-300 leading-relaxed text-sm sm:text-base whitespace-pre-wrap">{item.output}</p>
                      </div>
                    )}
                    {/* Date */}
                    <div className="flex justify-end mt-1">
                      <span className="text-xs text-white/30">
                        {new Date(item.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Load More Button */}
            {hasMore && history.length > 0 && !isLoadingHistory && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={loadMoreHistory}
                  className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-sm font-medium text-white/80 transition-all shadow-md active:scale-95"
                >
                  Load 5 More
                </button>
              </div>
            )}
            {isLoadingHistory && history.length > 0 && (
              <div className="flex justify-center items-center py-4 space-x-2">
                <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="absolute bottom-[10%] w-full flex flex-col items-center px-4">
        {status === "waiting" && (
          <p className="text-yellow-600 text-center bg-yellow-50 p-3 rounded-lg border mb-4 shadow-sm">
            Waiting... another request is processing
          </p>
        )}
        {status === "accepted" && (
          <p className="text-green-600 text-center bg-green-50 p-3 rounded-lg border mb-4 shadow-sm">
            Request accepted!
          </p>
        )}

        <div className="w-full max-w-5xl mx-auto flex items-center gap-3 sm:gap-4">
          {/* History Button */}
          <button
            onClick={toggleHistory}
            className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white shadow-lg transition-all active:scale-95"
            aria-label="View history"
            title="View History"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </button>

          {/* Main Input Container */}
          <div className="flex-1 bg-white border border-gray-300 rounded-2xl flex items-center px-4 py-2 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <input
              type="text"
              placeholder="Ask any question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="flex-1 outline-none bg-transparent text-gray-700 placeholder-gray-400 py-3 text-sm sm:text-base"
            />
            <button
              onClick={handleSubmit}
              className="ml-2 sm:ml-4 w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
