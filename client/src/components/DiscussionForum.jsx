import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api";
import { MessageSquare, Send, User, ChevronDown, ChevronUp, ThumbsUp } from "lucide-react";

export default function DiscussionForum({ courseId }) {
  const { user } = useContext(AuthContext);
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newThread, setNewThread] = useState({ title: "", content: "" });
  const [replyText, setReplyText] = useState({});
  const [expandedThread, setExpandedThread] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDiscussions();
  }, [courseId]);

  const fetchDiscussions = async () => {
    try {
      const res = await API.get(`/api/discussions/${courseId}`);
      setDiscussions(res.data);
    } catch (error) {
      console.error("Failed to load discussions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateThread = async (e) => {
    e.preventDefault();
    if (!newThread.title.trim() || !newThread.content.trim()) return;
    
    setSubmitting(true);
    try {
      await API.post(`/api/discussions/${courseId}`, newThread);
      setNewThread({ title: "", content: "" });
      fetchDiscussions();
    } catch (error) {
      alert("Failed to create thread. Are you logged in?");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (discussionId) => {
    const content = replyText[discussionId];
    if (!content?.trim()) return;

    try {
      await API.post(`/api/discussions/${courseId}/${discussionId}/reply`, { content });
      setReplyText({ ...replyText, [discussionId]: "" });
      fetchDiscussions();
    } catch (error) {
      alert("Failed to post reply.");
    }
  };

  const handleUpvote = async (discussionId) => {
    try {
      const res = await API.post(`/api/discussions/${discussionId}/upvote`);
      const discussion = discussions.find(d => d._id === discussionId);
      discussion.upvotes = Array(res.data.upvotes).fill(null);
      setDiscussions([...discussions]);
    } catch (error) {
      console.error("Failed to upvote:", error);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading discussions...</div>;

  return (
    <div className="max-w-4xl mx-auto py-6">
      {/* Create New Thread */}
      <div className="bg-white rounded-xl border border-[#DFE1E4] p-6 mb-8 shadow-sm">
        <h3 className="text-lg font-bold text-[#1D1F23] mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[#461EA4]" /> Start a Discussion
        </h3>
        <form onSubmit={handleCreateThread} className="space-y-4">
          <input
            type="text"
            placeholder="Thread Title (e.g., Question about Day 1 Video)"
            value={newThread.title}
            onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
            className="w-full h-12 px-4 bg-[#F6F7F9] border border-[#DFE1E4] rounded-lg outline-none focus:border-[#461EA4]"
            required
          />
          <textarea
            placeholder="What's on your mind? Ask a question or share an insight..."
            value={newThread.content}
            onChange={(e) => setNewThread({ ...newThread, content: e.target.value })}
            className="w-full h-32 px-4 py-3 bg-[#F6F7F9] border border-[#DFE1E4] rounded-lg outline-none focus:border-[#461EA4] resize-none"
            required
          />
          <button 
            type="submit" 
            disabled={submitting}
            className="px-6 py-2.5 bg-[#461EA4] text-white font-semibold rounded-lg hover:bg-[#3a188a] transition-colors flex items-center gap-2 disabled:bg-gray-400"
          >
            <Send className="w-4 h-4" /> {submitting ? 'Posting...' : 'Post Thread'}
          </button>
        </form>
      </div>

      {/* Discussion List */}
      <div className="space-y-4">
        {discussions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-[#DFE1E4]">
            <MessageSquare className="w-12 h-12 text-[#9CA3AF] mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No discussions yet. Be the first to start one!</p>
          </div>
        ) : (
          discussions.map((thread) => (
            <div key={thread._id} className="bg-white rounded-xl border border-[#DFE1E4] overflow-hidden shadow-sm">
              {/* Thread Header */}
              <div 
                className="p-5 cursor-pointer hover:bg-[#F9FAFB] transition-colors"
                onClick={() => setExpandedThread(expandedThread === thread._id ? null : thread._id)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#461EA4]/10 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-[#461EA4]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-[#1D1F23] text-lg mb-1">{thread.title}</h4>
                    <p className="text-sm text-[#595C61] line-clamp-2">{thread.content}</p>
                    <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                      <span className="font-semibold text-[#461EA4]">{thread.user?.name || "Anonymous"}</span>
                      <span>•</span>
                      <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" /> {thread.replies.length} replies
                      </span>
                      <span>•</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleUpvote(thread._id); }}
                        className="flex items-center gap-1 hover:text-[#461EA4] transition-colors"
                      >
                        <ThumbsUp className="w-3 h-3" /> {thread.upvotes?.length || 0}
                      </button>
                    </div>
                  </div>
                  {expandedThread === thread._id ? (
                    <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                  )}
                </div>
              </div>

              {/* Expanded Replies Section */}
              {expandedThread === thread._id && (
                <div className="border-t border-[#DFE1E4] bg-[#F6F7F9] p-5">
                  {/* Original Post Full Content */}
                  <p className="text-[#374151] mb-6 pl-14 whitespace-pre-line">{thread.content}</p>

                  {/* Replies */}
                  {thread.replies.length > 0 && (
                    <div className="space-y-4 mb-6 pl-14">
                      {thread.replies.map((reply, idx) => (
                        <div key={idx} className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                            <User className="w-4 h-4 text-gray-500" />
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-[#DFE1E4] flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-bold text-[#1D1F23]">{reply.user?.name || "User"}</span>
                              <span className="text-[10px] text-gray-400">{new Date(reply.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-sm text-[#374151] whitespace-pre-line">{reply.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Input */}
                  <div className="pl-14 flex gap-2">
                    <input
                      type="text"
                      placeholder="Write a reply..."
                      value={replyText[thread._id] || ""}
                      onChange={(e) => setReplyText({ ...replyText, [thread._id]: e.target.value })}
                      className="flex-1 h-10 px-4 bg-white border border-[#DFE1E4] rounded-lg outline-none focus:border-[#461EA4] text-sm"
                    />
                    <button
                      onClick={() => handleReply(thread._id)}
                      className="h-10 px-4 bg-[#461EA4] text-white rounded-lg hover:bg-[#3a188a] transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}