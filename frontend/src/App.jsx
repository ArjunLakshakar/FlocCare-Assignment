import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Spinner from "./components/Spinner";
import BlogCard from "./components/BlogCard";


export default function App() {
  const [topic, setTopic] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(null); 
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState("");

  const API_BASE = "http://127.0.0.1:8000";

  // Fetch history
  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${API_BASE}/blogs/`);
      setBlogs(res.data);
    } catch (err) {
      console.error("Fetch blogs error:", err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Generate blog
  const generateBlog = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic.");
      return;
    }
    setError("");
    setGenerating(true);
    setGenerated(null);

    try {
      const payload = { topic }; 
      const res = await axios.post(`${API_BASE}/generate_blog/`, payload, { timeout: 120000 });

      await fetchBlogs();
      const returnedBlog = {
        topic,
        blog: res.data.blog || res.data,
        created_at: new Date().toISOString(),
        _id: res.data.id || undefined,
      };
      setGenerated(returnedBlog);

    } catch (err) {
      console.error("Generate error:", err);
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Server error while generating. Check backend logs."
      );
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    } catch {
      alert("Copy failed. Try manually selecting the text.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-blue-700">✨ AI Blog Generator</h1>
          <p className="text-gray-600 mt-2">Enter a topic and generate a well-formatted blog (saved to DB).</p>
        </header>

        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 mb-6 flex gap-3">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") generateBlog(); }}
            className="flex-1 p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Write a topic (e.g. Benefits of Remote Work)..."
          />
          <button
            onClick={generateBlog}
            disabled={generating}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-white ${
              generating ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {generating ? <Spinner size={16} /> : "Generate"}
            <span className="text-sm">{generating ? "Generating..." : ""}</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 text-red-600 bg-red-50 p-3 rounded-md border border-red-100">
            {error}
          </div>
        )}

        {/* Generated blog preview */}
        {generated && (
          <section className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-blue-700">{generated.topic}</h2>
                <p className="text-sm text-gray-500 mt-1">Generated: {new Date(generated.created_at).toLocaleString()}</p>
              </div>

              <div className="flex gap-2 items-start">
                <button
                  onClick={() => copyToClipboard(generated.blog)}
                  className="text-sm px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-50"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="mt-4 prose max-w-none text-gray-800">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{generated.blog}</ReactMarkdown>
            </div>
          </section>
        )}

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-blue-700">📚 Previous Blogs</h3>
          <div className="text-sm text-gray-500">{blogs.length} saved</div>
        </div>

        <div className="grid gap-4">
          {blogs.length === 0 && <div className="text-gray-500">No saved blogs yet.</div>}

          {blogs.map((b) => (
            <BlogCard key={b._id} blog={b} onViewFull={() => {}} />
          ))}
        </div>
      </div>
    </div>
  );
}
