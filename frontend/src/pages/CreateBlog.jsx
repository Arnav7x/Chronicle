import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Tiptap hooks and components
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Navbar from "../components/Navbar";

// --- SVG Icons for Toolbar ---
const BoldIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M8 11h4.5a2.5 2.5 0 1 0 0-5H8v5zm10 4.5a4.5 4.5 0 0 1-4.5 4.5H6V4h6.5a4.5 4.5 0 0 1 0 9H8v1.5h8.5a1.5 1.5 0 0 0 1.5-1.5z" />
  </svg>
);
const ItalicIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M10 5v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V5z" />
  </svg>
);
const StrikeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M3 12h18v2H3zm11-2V7h5V4H5v3h5v3zm-5 5h5v3H9v-3z" />
  </svg>
);
const LinkIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M17 7h-4v2h4c1.65 0 3 1.35 3 3s-1.35 3-3 3h-4v2h4c2.76 0 5-2.24 5-5s-2.24-5-5-5zm-6 8H7c-1.65 0-3-1.35-3-3s1.35-3 3-3h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-2zM8 11h8v2H8v-2z" />
  </svg>
);
const H1Icon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M3 17h2v-5H3v5zM5 7V4H3v3h2zm4-3v13h2V4h-2zm4 13h2V4h-2v13zm4-13v13h2V4h-2z" />
  </svg>
);
const HighlightIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="m16.2 7.5-2.5 2.5 3.5 3.5 2.5-2.5-3.5-3.5M5 21v-4.5l8-8 4.5 4.5-8 8H5m11.5-13c.4 0 .8.2 1.1.4.3.3.4.7.4 1.1l-1.5 1.5-3.5-3.5 1.5-1.5Z" />
  </svg>
);
const AlignLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M3 21h12v-2H3v2zm0-4h18v-2H3v2zm0-4h12v-2H3v2zm0-4h18V7H3v2zm0-4h18V3H3v2z" />
  </svg>
);
const AlignCenterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M3 21h18v-2H3v2zm6-4h6v-2H9v2zm-6-4h18v-2H3v2zm6-4h6V7H9v2zm-6-4h18V3H3v2z" />
  </svg>
);
const AlignRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M9 21h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12v-2H9v2zM3 7h18V5H3v2zm6-4h12V1H9v2z" />
  </svg>
);
const UndoIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12.5 8H8v5l-6-6 6-6v5h4.5c3.04 0 5.5 2.46 5.5 5.5S15.54 19 12.5 19H4v-2h8.5c1.93 0 3.5-1.57 3.5-3.5S14.43 8 12.5 8z" />
  </svg>
);
const RedoIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.42 0-8 3.58-8 8s3.58 8 8 8c1.58 0 3.04-.46 4.28-1.25l-1.46-1.46C13.59 20.64 12.59 21 11.5 21c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.93 0 3.68.79 4.95 2.05L13 13h7V6l-1.6 1.6z" />
  </svg>
);
const ClearIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M19.36 2.72a.75.75 0 0 1 .14 1.05l-8.03 14a.75.75 0 0 1-1.2.14l-4.5-5.25a.75.75 0 1 1 1.13-.97L9.25 16.03l7.47-12.9a.75.75 0 0 1 1.05-.14l1.59 1.59z" />
  </svg>
);

const ToolbarButton = ({ icon, onClick, isActive, tooltip }) => (
  <div className="relative group">
    <button
      type="button"
      onClick={onClick}
      className={`p-2 rounded-md ${
        isActive
          ? "bg-blue-100 text-blue-600"
          : "text-gray-500 hover:bg-gray-200 hover:text-gray-800"
      }`}
    >
      {icon}
    </button>
    <div className="absolute z-10 bottom-full mb-2 hidden group-hover:block px-2 py-1 text-xs text-white bg-gray-900 rounded-md whitespace-nowrap">
      {tooltip}
    </div>
  </div>
);

export default function CreateBlog() {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  const navigate = useNavigate();
  const [rerenderKey, setRerenderKey] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      Color,
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose max-w-none p-4 focus:outline-none min-h-[300px] sm:min-h-[400px]",
      },
    },
    onUpdate: ({ editor }) => {
      localStorage.setItem("autosave_content", editor.getHTML());
    },
  });

  // Restore saved content on mount
  useEffect(() => {
    const savedContent = localStorage.getItem("autosave_content");
    if (savedContent && editor && !editor.isDestroyed) {
      editor.commands.setContent(savedContent);
    }
    return () => {
      localStorage.removeItem("autosave_content");
    };
  }, [editor]);

  // Force re-render on editor changes
  useEffect(() => {
    if (!editor) return;
    const forceRerender = () => setRerenderKey((prev) => prev + 1);
    editor.on("transaction", forceRerender);
    return () => {
      editor.off("transaction", forceRerender);
    };
  }, [editor]);

  const addLink = () => {
    const url = window.prompt("URL");
    if (url) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = currentTag.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editor) return;

    const htmlContent = editor.getHTML();

    if (!title || htmlContent === "<p></p>") {
      toast.error("Title and content cannot be empty.");
      return;
    }

    try {
      await api.post("/blogs", {
        title,
        content: htmlContent,
        authorId: user._id,
        tags,
      });
      toast.success("Blog submitted for admin approval ✅");
      localStorage.removeItem("autosave_content");
      navigate("/");
    } catch (error) {
      toast.error("Error submitting blog");
    }
  };

  if (!editor) return null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 flex flex-col flex-grow p-4 sm:p-6 max-w-5xl mx-auto w-full"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800">
            Create a New Post
          </h2>

          <input
            placeholder="New Post Title Here..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-2xl sm:text-3xl font-bold p-3 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
            required
          />

          {/* Tags Input */}
          <div className="p-3 border border-gray-300 rounded-lg">
            <div className="flex flex-wrap items-center gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-1 rounded-full"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-blue-500 hover:text-blue-700"
                  >
                    &times;
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Add tags..."
                className="flex-grow p-1 focus:outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Editor + Toolbar */}
          <div className="border border-gray-300 rounded-lg shadow-sm flex flex-col flex-grow">
            <div className="flex flex-wrap items-center p-2 bg-gray-100 border-b border-gray-300 rounded-t-lg space-x-1">
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                isActive={editor.isActive("heading", { level: 1 })}
                icon={<H1Icon />}
                tooltip="Heading 1"
              />
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive("bold")}
                icon={<BoldIcon />}
                tooltip="Bold"
              />
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive("italic")}
                icon={<ItalicIcon />}
                tooltip="Italic"
              />
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleStrike().run()}
                isActive={editor.isActive("strike")}
                icon={<StrikeIcon />}
                tooltip="Strikethrough"
              />
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleHighlight().run()}
                isActive={editor.isActive("highlight")}
                icon={<HighlightIcon />}
                tooltip="Highlight"
              />
              <div className="relative group">
                <input
                  type="color"
                  onInput={(event) =>
                    editor.chain().focus().setColor(event.target.value).run()
                  }
                  value={editor.getAttributes("textStyle").color || "#000000"}
                  className="w-8 h-8 p-1 border-none rounded-md cursor-pointer"
                />
                <div className="absolute z-10 bottom-full mb-2 hidden group-hover:block px-2 py-1 text-xs text-white bg-gray-900 rounded-md">
                  Text Color
                </div>
              </div>
              <span className="w-px h-6 bg-gray-300 mx-2"></span>
              <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign("left").run()}
                isActive={editor.isActive({ textAlign: "left" })}
                icon={<AlignLeftIcon />}
                tooltip="Align Left"
              />
              <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign("center").run()}
                isActive={editor.isActive({ textAlign: "center" })}
                icon={<AlignCenterIcon />}
                tooltip="Align Center"
              />
              <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign("right").run()}
                isActive={editor.isActive({ textAlign: "right" })}
                icon={<AlignRightIcon />}
                tooltip="Align Right"
              />
              <span className="w-px h-6 bg-gray-300 mx-2"></span>
              <ToolbarButton
                onClick={addLink}
                isActive={editor.isActive("link")}
                icon={<LinkIcon />}
                tooltip="Add Link"
              />
              <span className="w-px h-6 bg-gray-300 mx-2"></span>
              <ToolbarButton
                onClick={() => editor.chain().focus().undo().run()}
                icon={<UndoIcon />}
                tooltip="Undo"
              />
              <ToolbarButton
                onClick={() => editor.chain().focus().redo().run()}
                icon={<RedoIcon />}
                tooltip="Redo"
              />
              <ToolbarButton
                onClick={() => editor.chain().focus().clearContent().run()}
                icon={<ClearIcon />}
                tooltip="Clear Content"
              />
            </div>
            {/* 👇 Removed scroll, editor expands naturally */}
            <div className="flex-grow">
              <EditorContent editor={editor} />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg"
          >
            Publish Post
          </button>
        </form>
      </div>
    </>
  );
}
