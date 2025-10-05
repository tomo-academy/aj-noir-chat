import { useState, useEffect } from "react";
import { Sparkles, Search, Plus, Edit, History, Settings, HelpCircle, ChevronLeft, ChevronRight, Trash2, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

interface ChatItem {
  id: string;
  title: string;
  date: string;
  messagesCount: number;
}

interface SidebarProps {
  onNewChat: () => void;
  onSelectChat?: (chatId: string) => void;
  onDeleteChat?: (chatId: string) => void;
  onRenameChat?: (chatId: string, newTitle: string) => void;
  currentChatId?: string;
}

const Sidebar = ({
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onRenameChat,
  currentChatId
}: SidebarProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatItem[]>([]);
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null);

  // Initialize with mock data
  useEffect(() => {
    setChatHistory([
      { id: "1", title: "Explore the universe with Grok", date: "Today", messagesCount: 8 },
      { id: "2", title: "AI's role in cosmic discovery", date: "Yesterday", messagesCount: 12 },
      { id: "3", title: "Galactic coding patterns", date: "Oct 3", messagesCount: 5 },
      { id: "4", title: "Neural networks in space", date: "Oct 1", messagesCount: 15 },
      { id: "5", title: "Future of interstellar tech", date: "Sep 30", messagesCount: 7 },
      { id: "6", title: "AI-driven space exploration", date: "Sep 28", messagesCount: 10 },
      { id: "7", title: "Blockchain in the stars", date: "Sep 25", messagesCount: 6 },
    ]);
  }, []);

  const toggleSidebar = () => setIsExpanded(!isExpanded);

  const handleEditChat = (chat: ChatItem) => {
    setEditingChatId(chat.id);
    setEditTitle(chat.title);
  };

  const handleSaveEdit = () => {
    if (editingChatId && editTitle.trim() && onRenameChat) {
      onRenameChat(editingChatId, editTitle.trim());
      setChatHistory(prev =>
        prev.map(chat =>
          chat.id === editingChatId ? { ...chat, title: editTitle.trim() } : chat
        )
      );
      setEditingChatId(null);
      setEditTitle("");
    }
  };

  const handleDeleteChat = (chatId: string) => {
    if (onDeleteChat) {
      onDeleteChat(chatId);
      setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
    }
  };

  const filteredChats = chatHistory.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside
      className={cn(
        "bg-gray-900 border-r border-gray-800 flex flex-col transition-all duration-300 overflow-hidden",
        isExpanded ? "w-72" : "w-14"
      )}
    >
      {/* Logo and toggle */}
      <div className="flex items-center justify-between p-3 border-b border-gray-800">
        {isExpanded ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-white tracking-tight">Grok</span>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-7 w-7 text-gray-300 hover:bg-gray-800"
        >
          {isExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>

      {/* New Chat button */}
      <div className="p-2">
        <Button
          onClick={onNewChat}
          className={cn(
            "w-full justify-start gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium",
            !isExpanded && "px-1.5"
          )}
        >
          <Plus className="h-4 w-4" />
          {isExpanded && <span>Start New Query</span>}
        </Button>
      </div>

      {/* Search and chat history */}
      {isExpanded && (
        <>
          <div className="px-3 pb-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search queries"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-0 h-9 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2 pb-4">
            <div className="text-xs font-semibold text-gray-400 uppercase px-2 py-2">
              {searchQuery ? "Search Results" : "Query History"}
            </div>
            <div className="space-y-1">
              {filteredChats.length > 0 ? (
                filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    className={cn(
                      "group relative rounded-lg transition-colors",
                      currentChatId === chat.id ? "bg-gray-800" : "hover:bg-gray-800/70"
                    )}
                    onMouseEnter={() => setHoveredChatId(chat.id)}
                    onMouseLeave={() => setHoveredChatId(null)}
                  >
                    {editingChatId === chat.id ? (
                      <div className="flex items-center gap-1 p-2">
                        <Input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="h-8 text-sm bg-gray-700 text-gray-200 border-gray-600 focus:ring-blue-500"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveEdit();
                            if (e.key === "Escape") {
                              setEditingChatId(null);
                              setEditTitle("");
                            }
                          }}
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-gray-300 hover:bg-gray-700"
                          onClick={handleSaveEdit}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-gray-300 hover:bg-gray-700"
                          onClick={() => {
                            setEditingChatId(null);
                            setEditTitle("");
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div
                        className="flex items-center justify-between p-2 cursor-pointer"
                        onClick={() => onSelectChat && onSelectChat(chat.id)}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-gray-200 truncate">{chat.title}</div>
                          <div className="text-xs text-gray-400 flex items-center gap-1">
                            <span>{chat.date}</span>
                            <span>•</span>
                            <span>{chat.messagesCount} responses</span>
                          </div>
                        </div>
                        {(hoveredChatId === chat.id || currentChatId === chat.id) && (
                          <div className="flex opacity-100 transition-opacity">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6 text-gray-300 hover:bg-gray-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditChat(chat);
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6 text-red-500 hover:bg-gray-700 hover:text-red-400"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteChat(chat.id);
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-sm text-gray-400">
                  No queries found
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Bottom buttons */}
      <div className="mt-auto p-2 border-t border-gray-800">
        {isExpanded ? (
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start gap-2 text-gray-300 hover:bg-gray-800">
              <History className="h-4 w-4" />
              <span>Query Archive</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2 text-gray-300 hover:bg-gray-800">
              <Settings className="h-4 w-4" />
              <span>Preferences</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2 text-gray-300 hover:bg-gray-800">
              <HelpCircle className="h-4 w-4" />
              <span>Support</span>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <Button variant="ghost" size="icon" title="Query Archive" className="text-gray-300 hover:bg-gray-800">
              <History className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Preferences" className="text-gray-300 hover:bg-gray-800">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Support" className="text-gray-300 hover:bg-gray-800">
              <HelpCircle className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
