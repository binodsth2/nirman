"use client";

import { useState } from "react";
import { useEffect } from "react";
import UserProfile from "./UserProfile";
import ChatHistory from "./ChatHistory";

export default function ChatInterface() {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "waiting" | "accepted">("idle");

  // History State
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // User State
  const [user, setUser] = useState<{ id: string; name: string; email: string; imageUrl: string | null } | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleImageUpdate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUpdatingProfile(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", user.id);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
      setIsUpdatingProfile(false);
    } catch (error) {
      console.error("Failed to update image:", error);
      setIsUpdatingProfile(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/nllm/query", {
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

  return (
    <main className="min-h-screen bg-blue-900 flex flex-col items-center justify-center p-4 sm:p-6 text-slate-200 w-full relative overflow-hidden font-sans">
      {/* Profile Section */}
      <UserProfile
        user={user}
        isOpen={isProfileOpen}
        setIsOpen={setIsProfileOpen}
        onLogout={handleLogout}
        onImageUpdate={handleImageUpdate}
        isUpdatingProfile={isUpdatingProfile}
      />

      {/* History Section */}
      <ChatHistory
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />

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
            onClick={() => setIsHistoryOpen(true)}
            className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white shadow-lg transition-all active:scale-95"
            aria-label="View history"
            title="View History"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </button>

          {/* Main Input Container */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="flex-1 bg-white border border-gray-300 rounded-2xl flex items-center px-4 py-2 shadow-xl hover:shadow-2xl transition-shadow duration-300"
          >
            <input
              type="text"
              placeholder="Ask any question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 outline-none bg-transparent text-gray-700 placeholder-gray-400 py-3 text-sm sm:text-base"
            />
            <button
              type="submit"
              className="ml-2 sm:ml-4 w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="19" x2="12" y2="5"></line>
                <polyline points="5 12 12 5 19 12"></polyline>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
