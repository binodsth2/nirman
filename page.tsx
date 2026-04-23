"use client";

import { useState } from "react";

export default function GeneratePage() {
    const [query, setQuery] = useState<{ id: string; input: string } | null>(null);
    const [output, setOutput] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

    const handleCheck = async () => {
        setLoading(true);
        setMessage(null);
        try {
            const res = await fetch("/api/nllm/generate");
            const data = await res.json();

            if (data.status === "found") {
                setQuery(data.data);
                setMessage({ text: "Query found! Please provide an answer.", type: "success" });
            } else {
                setQuery(null);
                setMessage({ text: "No pending queries found. Keep relaxing!", type: "info" });
            }
        } catch (error) {
            setMessage({ text: "Error checking for queries.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!query || !output.trim()) return;

        setLoading(true);
        setMessage(null);
        try {
            const res = await fetch("/api/nllm/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: query.id, output }),
            });

            const data = await res.json();
            if (data.status === "success") {
                setMessage({ text: "Response sent successfully!", type: "success" });
                setQuery(null);
                setOutput("");
            } else {
                setMessage({ text: "Failed to send response.", type: "error" });
            }
        } catch (error) {
            setMessage({ text: "Error sending response.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-blue-900 flex flex-col items-center justify-center p-6 text-slate-200 w-full relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#081F5C] rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#081F5C] rounded-full blur-[100px] pointer-events-none"></div>

            <div className="w-full max-w-3xl backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 shadow-2xl overflow-hidden p-8 transition-all z-10">
                <div className="flex flex-col md:flex-row items-center justify-between border-b border-white/10 pb-6 mb-6 gap-4">
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-white">
                            DATABASE FUNCTIONALITY
                        </h1>
                    </div>
                    <button
                        onClick={handleCheck}
                        disabled={loading}
                        className="group relative px-6 py-3 font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-500 flex items-center gap-2 cursor-pointer]"
                    >
                        {loading ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        ) : (
                            <svg className="w-5 h-5 transition-transform group-hover:-rotate-12 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        )}
                        Check Network
                    </button>
                </div>

                {message && (
                    <div className={`mb-6 p-4 rounded-xl text-sm font-medium border flex items-center gap-3 animate-in fade-in slide-in-from-top-4 ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                        message.type === 'error' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                            'bg-blue-500/10 border-blue-500/20 text-blue-400'
                        }`}>
                        <span className="text-lg">
                            {message.type === 'success' ? '✓' : message.type === 'error' ? '!' : 'ℹ'}
                        </span>
                        {message.text}
                    </div>
                )}

                {query ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="p-6 rounded-2xl bg-black/30 border border-white/5 relative group hover:border-white/10 transition-colors">
                            <div className="absolute top-0 right-0 px-3 py-1 bg-white/10 rounded-bl-2xl rounded-tr-2xl text-[10px] font-mono text-slate-400">
                                ID: {query.id}
                            </div>
                            <p className="text-xs text-blue-400 font-semibold tracking-wider uppercase mb-2 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                User Query
                            </p>
                            <p className="text-xl text-white font-medium leading-relaxed pl-1">
                                "{query.input}"
                            </p>
                        </div>

                        <div className="space-y-3">
                            <label htmlFor="answer" className="text-xs text-emerald-400 font-semibold tracking-wider uppercase ml-1 flex items-center gap-2 block">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                Your Answer
                            </label>
                            <textarea
                                id="answer"
                                value={output}
                                onChange={(e) => setOutput(e.target.value)}
                                placeholder="Type your brilliant response here..."
                                className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all h-40 resize-none shadow-inner"
                            />
                            <div className="flex justify-end pt-2">
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading || !output.trim()}
                                    className="px-8 py-3 rounded-full font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:shadow-[0_0_30px_rgba(52,211,153,0.5)] flex items-center gap-2"
                                >
                                    {loading ? "Sending..." : (
                                        <>
                                            Transmit Answer
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="py-24 flex flex-col items-center justify-center opacity-60">
                        <svg className="w-20 h-20 text-slate-600 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-xl font-medium text-slate-300 tracking-wide">Queue is empty</p>
                        <p className="text-sm text-slate-500 mt-2">Press 'Check Network' to scan for incoming user queries.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
