import { useState, useEffect, useCallback } from "react";
import { 
  Sparkles, 
  Search, 
  Plus, 
  Edit, 
  Settings, 
  HelpCircle, 
  ChevronLeft, 
  ChevronRight, 
  Trash2, 
  X, 
  Archive, 
  Clock, 
  Star, 
  FolderOpen,
  Trash
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

interface ChatItem {
  id: string;
  title: string;
  date: string;
  timestamp: number;
  messagesCount: number;
  isPinned?: boolean;
  isArchived?: boolean;
  category?: string;
}

interface SidebarProps {
  onNewChat: () => void;
  onSelectChat?: (chatId: string) => void;
  onDeleteChat?: (chatId: string) => void;
  onRenameChat?: (chatId: string, newTitle: string) => void;
  onPinChat?: (chatId: string, isPinned: boolean) => void;
  onArchiveChat?: (chatId: string, isArchived: boolean) => void;
  onClearConversations?: () => void;
  currentChatId?: string;
}

const LOCAL_STORAGE_KEY = "grok-chat-history-premium";

const Sidebar = ({
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onRenameChat,
  onPinChat,
  onArchiveChat,
  onClearConversations,
  currentChatId
}: SidebarProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatItem[]>([]);
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    const savedChatHistory = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedChatHistory) {
      try {
        const parsed = JSON.parse(savedChatHistory);
        setChatHistory(parsed);
      } catch (error) {
        console.error("Failed to parse chat history from localStorage", error);
        initializeSampleData();
      }
    } else {
      initializeSampleData();
    }
  }, []);
  
  const initializeSampleData = () => {
    const sampleData: ChatItem[] = [
        { id: "1", title: "Exploring the Cosmos", date: "Today", timestamp: Date.now(), messagesCount: 5, isPinned: true, category: "Science" },
        { id: "2", title: "The Future of AI", date: "Yesterday", timestamp: Date.now() - 86400000, messagesCount: 12, category: "Technology" },
        { id: "3", title: "Blockchain Innovations", date: "Oct 3", timestamp: Date.now() - 172800000, messagesCount: 8, category: "Finance" },
        { id: "4", title: "Quantum Computing Explained", date: "Oct 1", timestamp: Date.now() - 259200000, messagesCount: 15, isPinned: true, category: "Science" },
        { id: "5", title: "The Art of Storytelling", date: "Sep 30", timestamp: Date.now() - 345600000, messagesCount: 7, category: "Creative" },
        { id: "6", title: "Archived Conversation", date: "Sep 25", timestamp: Date.now() - 518400000, messagesCount: 6, isArchived: true, category: "General" },
      ];
    setChatHistory(sampleData);
  }

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(chatHistory));
  }, [chatHistory]);

  const categories = Array.from(
    new Set(chatHistory.map(chat => chat.category).filter(Boolean) as string[])
  );

  const toggleSidebar = () => setIsExpanded(!isExpanded);

  const handleEditChat = (chat: ChatItem) => {
    setEditingChatId(chat.id);
    setEditTitle(chat.title);
  };

  const handleSaveEdit = useCallback(() => {
    if (editingChatId && editTitle.trim()) {
      onRenameChat?.(editingChatId, editTitle.trim());
      setChatHistory(prev =>
        prev.map(chat =>
          chat.id === editingChatId ? { ...chat, title: editTitle.trim() } : chat
        )
      );
      setEditingChatId(null);
      setEditTitle("");
    }
  }, [editingChatId, editTitle, onRenameChat]);

  const handleDeleteChat = useCallback((chatId: string) => {
    onDeleteChat?.(chatId);
    setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
  }, [onDeleteChat]);

  const handleTogglePin = useCallback((chatId: string, isPinned: boolean) => {
    onPinChat?.(chatId, isPinned);
    setChatHistory(prev =>
      prev.map(chat =>
        chat.id === chatId ? { ...chat, isPinned } : chat
      )
    );
  }, [onPinChat]);

  const handleToggleArchive = useCallback((chatId: string, isArchived: boolean) => {
    onArchiveChat?.(chatId, isArchived);
    setChatHistory(prev =>
      prev.map(chat =>
        chat.id === chatId ? { ...chat, isArchived } : chat
      )
    );
  }, [onArchiveChat]);
  
  const handleClearConversations = () => {
    onClearConversations?.();
    setChatHistory([]);
  };

  const handleCreateNewChat = () => {
    onNewChat();
    if (window.innerWidth < 768) {
      setIsExpanded(false);
    }
  };

  const filteredChats = chatHistory.filter(chat => {
    const matchesSearch = chat.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesArchived = showArchived ? chat.isArchived : !chat.isArchived;
    const matchesCategory = activeCategory ? chat.category === activeCategory : true;
    return matchesSearch && matchesArchived && matchesCategory;
  });

  const sortedChats = [...filteredChats].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.timestamp - a.timestamp;
  });
  
  const groupedChats = sortedChats.reduce((groups, chat) => {
    const now = new Date();
    const chatDate = new Date(chat.timestamp);
    const diffTime = now.getTime() - chatDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let group = "Older";
    if (diffDays <= 1) group = "Today";
    else if (diffDays <= 2) group = "Yesterday";
    else if (diffDays <= 7) group = "Previous 7 Days";
    
    if (!groups[group]) groups[group] = [];
    groups[group].push(chat);
    return groups;
  }, {} as Record<string, ChatItem[]>);

  return (
    <aside
      className={cn(
        "bg-black text-white flex flex-col transition-all duration-300 ease-in-out",
        isExpanded ? "w-80" : "w-16"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-900">
        {isExpanded && (
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-400" />
            <span className="font-bold text-xl">Grok</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8 text-gray-400 hover:bg-gray-800 hover:text-white"
        >
          {isExpanded ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </Button>
      </div>

      <div className="p-2">
        <Button
          onClick={handleCreateNewChat}
          className={cn(
            "w-full justify-start gap-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3",
            !isExpanded && "px-2"
          )}
        >
          <Plus className="h-5 w-5" />
          {isExpanded && <span>New Chat</span>}
        </Button>
      </div>

      {isExpanded && (
        <div className="px-3 pb-2">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-800 h-10 text-white placeholder-gray-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-2 pb-4 scrollbar-thin scrollbar-thumb-gray-800">
        {Object.entries(groupedChats).map(([groupName, chats]) => (
          <div key={groupName} className="mb-3">
            {isExpanded && (
                <div className="text-xs font-bold text-gray-500 uppercase px-2 py-1 tracking-wider">
                  {groupName}
                </div>
            )}
            <div className="space-y-1">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className={cn(
                    "group relative rounded-md transition-all",
                    currentChatId === chat.id
                      ? "bg-gray-800"
                      : "hover:bg-gray-900",
                    !isExpanded && "flex justify-center"
                  )}
                  onMouseEnter={() => setHoveredChatId(chat.id)}
                  onMouseLeave={() => setHoveredChatId(null)}
                >
                  <div
                      className="flex items-center justify-between p-2 cursor-pointer"
                      onClick={() => onSelectChat?.(chat.id)}
                  >
                      <div className="flex items-center gap-2 min-w-0">
                        {chat.isPinned && <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 flex-shrink-0" />}
                        {isExpanded && (
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">{chat.title}</p>
                          </div>
                        )}
                      </div>
                      {(isExpanded && (hoveredChatId === chat.id || currentChatId === chat.id)) && (
                        <div className="flex opacity-100 transition-opacity">
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-gray-400 hover:text-white" onClick={(e) => { e.stopPropagation(); handleEditChat(chat); }} title="Rename"><Edit className="h-4 w-4" /></Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-gray-400 hover:text-white" onClick={(e) => { e.stopPropagation(); handleDeleteChat(chat.id); }} title="Delete"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-auto p-2 border-t border-gray-900">
        <Button variant="ghost" className="w-full justify-start gap-3 text-gray-400 hover:bg-gray-800 hover:text-white" onClick={handleClearConversations}>
          <Trash className="h-5 w-5" />
          {isExpanded && <span>Clear Conversations</span>}
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-3 text-gray-400 hover:bg-gray-800 hover:text-white">
          <Settings className="h-5 w-5" />
          {isExpanded && <span>Settings</span>}
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-3 text-gray-400 hover:bg-gray-800 hover:text-white">
          <HelpCircle className="h-5 w-5" />
          {isExpanded && <span>Help</span>}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;```
