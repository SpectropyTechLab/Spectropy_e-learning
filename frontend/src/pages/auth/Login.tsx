import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate("/student/dashboard");
    } catch (err: any) {
      const msg =
        err.response?.data?.error || err.message || "Login failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-1/4 bg-blue-700 flex flex-col items-center justify-center text-white p-6">
        <div className="text-5xl font-bold mb-4 rotate-[-90deg] tracking-wide">
          Spectropy
        </div>
        <div className="text-sm opacity-80 mt-8">LOGO</div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="bg-white shadow-lg rounded-xl p-10 w-80 text-center">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Welcome</h1>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Email:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Enter email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Password:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Enter password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 mt-3 text-white rounded-lg transition ${
                loading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>

          <div className="flex justify-between mt-4 text-sm text-blue-600">
            <a href="/forgot-password" className="hover:underline">
              Forgot Password?
            </a>
            <a href="/register" className="hover:underline">
              Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
