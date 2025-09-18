import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function BlogCard({ blog }) {
  const [expanded, setExpanded] = useState(false);

  const previewText = blog.blog.length > 300 ? blog.blog.slice(0, 300) + "..." : blog.blog;

  // Copy blog content to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(blog.blog)
      .then(() => alert("Blog copied to clipboard!"))
      .catch(() => alert("Failed to copy."));
  };

  return (
    <div className="bg-white rounded-xl shadow p-5 border border-gray-100">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="text-lg font-semibold text-blue-700">{blog.topic}</h4>
          <p className="text-xs text-gray-500 mt-1">{new Date(blog.created_at).toLocaleString()}</p>
        </div>
        <button
          onClick={handleCopy}
          className="text-sm text-gray-400 hover:text-gray-600"
        >
          Copy
        </button>
      </div>

      <div className="mt-3 prose max-w-none text-gray-800">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {expanded ? blog.blog : previewText}
        </ReactMarkdown>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={() => setExpanded((s) => !s)}
          className="text-blue-600 hover:underline text-sm"
        >
          {expanded ? "Show Less ▲" : "Show More ▼"}
        </button>
      </div>
    </div>
  );
}

export default BlogCard;
