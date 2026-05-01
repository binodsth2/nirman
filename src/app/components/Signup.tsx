"use client";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";

const Signup = () => {

  const [formdata, setFormdata] = useState({
    name: "",
    email: "",
    password: "",
    cnf: "",
  });

const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!formdata.name || !formdata.email || !formdata.password || !formdata.cnf) {
      setError("All fields are required");
      return;
    }
    if (formdata.password !== formdata.cnf) {
      setError("Passwords do not match");
      return;
    }
    try {
      const res = await axios.post('/api/auth/signup', formdata);
      if (res.status === 201){
        setError("User created successfully");
      }
    } catch {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.error || "Signup failed. Please try again.");
      }
      return;
    }

    setError(null);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formdata),
      });
      if (!res.ok) throw new Error('Signup failed');
      // Redirect or success message
      window.location.href = '/login';
    } catch (err) {
      setError('Signup failed. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white w-1/3 flex justify-center flex-col py-8 rounded-2xl shadow-md">
        <div className="py-4 flex flex-col px-4 justify-center items-center">
          <p className="text-gray-600 text-sm">Signup Here</p>
          <h2 className="text-4xl">Signup</h2>
        </div>

        {error && (
          <div className="w-full px-5">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">{error}</div>
          </div>
        )}

        <div className="w-full px-5 flex gap-4 flex-col"> 

          <div>
            <input
              onChange={(e) => setFormdata({...formdata, name: e.target.value})}
              value={formdata.name}
              className="w-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100 py-2 px-2 rounded-md"
              type="name"
              name="name"
              placeholder="Full Name"
            />
          </div>



          <div>
            <input
              onChange={(e) => setFormdata({...formdata, email: e.target.value})}
              value={formdata.email}
              className="w-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100 py-2 px-2 rounded-md"
              type="email"
              name="email"
              placeholder="Email"
            />
          </div>
          <div>
            <input
              onChange={(e) => setFormdata({...formdata, password: e.target.value})}
              value={formdata.password}
              className="w-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100 py-2 px-2 rounded-md"
              type="password"
              name="password"
              placeholder="Password"
            />
          </div>
          <div>
            <input
              onChange={(e) => setFormdata({...formdata, cnf: e.target.value})}
              value={formdata.cnf}
              className="w-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100 py-2 px-2 rounded-md"
              type="password"
              name="cnf"
              placeholder="Confirm Password"
            />
          </div>
        </div>

        <div className="w-full px-5 mt-4">
          <button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 px-2 rounded-md cursor-pointer transition-colors">
            Signup
          </button> 
        </div>
      </div>

      <p className="text-sm text-gray-600 mt-4 absolute bottom-4">
        Already have an account? <Link href="/login" className="text-blue-600 cursor-pointer">Login</Link>
      </p>
    </div>
  );
};
export default Signup;