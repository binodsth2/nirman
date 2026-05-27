"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/");
        router.refresh(); // Refresh to update server-side components if any
      } else {
        setError(data.message || "Invalid Email or Password");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="bg-white w-full max-w-md flex justify-center flex-col py-10 rounded-2xl shadow-lg border border-gray-100">
        <div className="py-5 flex flex-col px-5 justify-center items-center">
          <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Login Here</p>
          <h2 className="text-4xl font-bold text-gray-800 mt-1">Login</h2>
        </div>

        {error && (
          <div className="mx-5 mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md text-center">
            {error}
          </div>
        )}

        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="w-full px-5 flex gap-4 flex-col">
            <div>
              <input
                className="w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 border border-gray-200 py-3 px-4 rounded-xl transition-all"
                type="email"
                name="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <input
                className="w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 border border-gray-200 py-3 px-4 rounded-xl transition-all"
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="w-full px-5 mt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white w-full py-3 px-4 rounded-xl font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg transition-all active:scale-[0.98] disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <p className="text-sm text-gray-500 mt-4 text-center">
              <Link href="#" className="text-blue-600 hover:underline font-medium">
                Forgot Password?
              </Link>
            </p>
            <p className="text-sm text-gray-500 mt-2 text-center">
              Don&apos;t have an account? <Link href="/signup" className="text-blue-600 hover:underline font-medium">Register</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;