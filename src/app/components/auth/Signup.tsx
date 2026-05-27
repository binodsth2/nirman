"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Signup = () => {
  const [formdata, setFormdata] = useState({
    name: "",
    email: "",
    password: "",
    cnf: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formdata.name || !formdata.email || !formdata.password || !formdata.cnf) {
      setError("All fields are required");
      return;
    }
    if (formdata.password !== formdata.cnf) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formdata.name,
          email: formdata.email,
          password: formdata.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        setError(data.message || "Signup failed. Please try again.");
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
          <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Signup Here</p>
          <h2 className="text-4xl font-bold text-gray-800 mt-1">Create Account</h2>
        </div>

        {error && (
          <div className="mx-5 mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div className="w-full px-5 flex gap-4 flex-col">
            <div>
              <input
                onChange={(e) => setFormdata({ ...formdata, name: e.target.value })}
                value={formdata.name}
                className="w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 border border-gray-200 py-3 px-4 rounded-xl transition-all"
                type="text"
                name="name"
                placeholder="Full Name"
                required
              />
            </div>

            <div>
              <input
                onChange={(e) => setFormdata({ ...formdata, email: e.target.value })}
                value={formdata.email}
                className="w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 border border-gray-200 py-3 px-4 rounded-xl transition-all"
                type="email"
                name="email"
                placeholder="Email Address"
                required
              />
            </div>
            <div>
              <input
                onChange={(e) => setFormdata({ ...formdata, password: e.target.value })}
                value={formdata.password}
                className="w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 border border-gray-200 py-3 px-4 rounded-xl transition-all"
                type="password"
                name="password"
                placeholder="Password"
                required
              />
            </div>
            <div>
              <input
                onChange={(e) => setFormdata({ ...formdata, cnf: e.target.value })}
                value={formdata.cnf}
                className="w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 border border-gray-200 py-3 px-4 rounded-xl transition-all"
                type="password"
                name="cnf"
                placeholder="Confirm Password"
                required
              />
            </div>
          </div>

          <div className="w-full px-5 mt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white w-full py-3 px-4 rounded-xl font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg transition-all active:scale-[0.98] disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Signup"}
            </button>
            <p className="text-sm text-gray-500 mt-4 text-center">
              Already have an account? <Link href="/login" className="text-blue-600 hover:underline font-medium">Login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;