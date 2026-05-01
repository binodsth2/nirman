"use client";
import Link from "next/link";

const Login = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white w-1/3 flex justify-center flex-col py-10 rounded-2xl shadow-md">
        <div className="py-5 flex flex-col px-5 justify-center items-center">
          <p className="text-gray-600 text-sm">Login Here</p>
          <h2 className="text-4xl">Login</h2>
        </div>

        <div className="w-full px-5 flex gap-4 flex-col">
          <div>
            <input className="w-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100 py-2 px-2 rounded-md" type="email" name="email" placeholder="Email" />
          </div>
          <div>
            <input
              className="w-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100 py-2 px-2 rounded-md" type="password" name="password" placeholder="Password" />
          </div>

        </div>

        <div className="w-full px-5 mt-4">
          <button className="bg-blue-600 text-white w-full py-2 px-2 rounded-md cursor-pointer">
            Login
          </button>
          {/* Forgot Password under button */}
          <p className="text-sm text-gray-600 mt-3">
            <Link href="#" className="text-blue-600 cursor-pointer justify-center flex">
              Forgot Password?
            </Link>
          </p>
        </div>

      </div>
      <p>
        Don't have an account? <Link href="/signup" className="text-blue-600 cursor-pointer">Signup</Link>
      </p>
    </div>
  )
}

export default Login;