"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const type = "trustee"

  const handleEmailSignup = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password, type }),
    });

    const data = await res.json();

    if (res.ok) {
      await signIn("credentials", {
        redirect: false,
        email,
        username,
        password,
      });
      router.push("/");
    } else {
      setError(data.message || "Failed to sign up");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-sm w-full">
        <h1 className="text-2xl font-semibold text-center mb-6">Trustee Sign Up</h1>

        <input
          type="username"
          value={username}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Username"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
        />

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
        />

        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
        />

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <button
          onClick={handleEmailSignup}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all mb-4"
        >
          Sign Up
        </button>

        <div className="text-center text-gray-500 mb-4">or</div>
      </div>
    </div>
  );
}
