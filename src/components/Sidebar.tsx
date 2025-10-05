import { useState, useEffect, useCallback, useMemo } from "react";
import { Sparkles, Search, Plus, Edit, History, Settings, HelpCircle, ChevronLeft, ChevronRight, Trash2, X, Archive, Clock, Star, FolderOpen, Zap, GripVertical } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion"; // Added for animations
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"; // Added for drag-and-drop reordering
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"; // Added for tooltips

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
  onReorderChats?: (newOrder: ChatItem[]) => void; // New prop for reordering
  currentChatId?: string;
}

const LOCAL_STORAGE_KEY = "grok-chat-history";

const Sidebar = ({
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onRenameChat,
  onPinChat,
  onArchiveChat,
  onReorderChats,
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

  // Load chat history from localStorage on mount
  useEffect(() => {
    const savedChatHistory = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedChatHistory) {
      try {
        const parsed = JSON.parse(savedChatHistory);
        setChatHistory(parsed);
      } catch (error) {
        console.error("Failed to parse chat history from localStorage", error);
      }
    } else {
      // Initialize with sample data if no saved data exists
      const sampleData: ChatItem[] = [
        { id: "1", title: "Explore the universe with Grok", date: "Today", timestamp: Date.now(), messagesCount: 8, isPinned: true },
        { id: "2", title: "AI's role in cosmic discovery", date: "Yesterday", timestamp: Date.now() - 86400000, messagesCount: 12, category: "Science" },
        { id: "3", title: "Galactic coding patterns", date: "Oct 3", timestamp: Date.now() - 172800000, messagesCount: 5, category: "Technology" },
        { id: "4", title: "Neural networks in space", date: "Oct 1", timestamp: Date.now() - 259200000, messagesCount: 15, isPinned: true },
        { id: "5", title: "Future of interstellar tech", date: "Sep 30", timestamp: Date.now() - 345600000, messagesCount: 7, category: "Technology" },
        { id: "6", title: "AI-driven space exploration", date: "Sep 28", timestamp: Date.now() - 432000000, messagesCount: 10, category: "Science" },
        { id: "7", title: "Blockchain in the stars", date: "Sep 25", timestamp: Date.now() - 518400000, messagesCount: 6, isArchived: true },
      ];
      setChatHistory(sampleData);
    }
  }, []);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(chatHistory));
  }, [chatHistory]);

  // Get unique categories from chat history
  const categories = useMemo(() => 
    Array.from(new Set(chatHistory.map(chat => chat.category).filter(Boolean) as string[])),
    [chatHistory]
  );

  const toggleSidebar = () => setIsExpanded(!isExpanded);

  const handleEditChat = (chat: ChatItem) => {
    setEditingChatId(chat.id);
    setEditTitle(chat.title);
  };

  const handleSaveEdit = useCallback(() => {
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
  }, [editingChatId, editTitle, onRenameChat]);

  const handleDeleteChat = useCallback((chatId: string) => {
    if (onDeleteChat) {
      onDeleteChat(chatId);
      setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
    }
  }, [onDeleteChat]);

  const handleTogglePin = useCallback((chatId: string, isPinned: boolean) => {
    if (onPinChat) {
      onPinChat(chatId, isPinned);
      setChatHistory(prev =>
        prev.map(chat =>
          chat.id === chatId ? { ...chat, isPinned } : chat
        )
      );
    }
  }, [onPinChat]);

  const handleToggleArchive = useCallback((chatId: string, isArchived: boolean) => {
    if (onArchiveChat) {
      onArchiveChat(chatId, isArchived);
      setChatHistory(prev =>
        prev.map(chat =>
          chat.id === chatId ? { ...chat, isArchived } : chat
        )
      );
    }
  }, [onArchiveChat]);

  const handleCreateNewChat = () => {
    onNewChat();
    // Auto-collapse sidebar on mobile after creating new chat
    if (window.innerWidth < 768) {
      setIsExpanded(false);
    }
  };

  // Filter chats based on search query, archived status, and active category
  const filteredChats = useMemo(() => chatHistory.filter(chat => {
    const matchesSearch = chat.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesArchived = showArchived ? chat.isArchived : !chat.isArchived;
    const matchesCategory = activeCategory ? chat.category === activeCategory : true;
    return matchesSearch && matchesArchived && matchesCategory;
  }), [chatHistory, searchQuery, showArchived, activeCategory]);

  // Sort chats: pinned first, then by timestamp (newest first)
  const sortedChats = useMemo(() => [...filteredChats].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.timestamp - a.timestamp;
  }), [filteredChats]);

  // Group chats by date (Today, Yesterday, This Week, Older)
  const groupedChats = useMemo(() => sortedChats.reduce((groups, chat) => {
    const now = Date.now();
    const chatDate = new Date(chat.timestamp);
    const today = new Date(now);
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    let group = "Older";
    if (chatDate.toDateString() === today.toDateString()) {
      group = "Today";
    } else if (chatDate.toDateString() === yesterday.toDateString()) {
      group = "Yesterday";
    } else if (chatDate >= oneWeekAgo) {
      group = "This Week";
    }

    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(chat);
    return groups;
  }, {} as Record<string, ChatItem[]>), [sortedChats]);

  // Handle drag end for reordering
  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const newChats = Array.from(sortedChats);
    const [reorderedItem] = newChats.splice(result.source.index, 1);
    newChats.splice(result.destination.index, 0, reorderedItem);
    setChatHistory(newChats);
    if (onReorderChats) onReorderChats(newChats);
  };

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ width: isExpanded ? 288 : 56 }}
        animate={{ width: isExpanded ? 288 : 56 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "bg-black border-r border-gray-900 flex flex-col transition-all duration-300 overflow-hidden h-full"
        )}
      >
        {/* Logo and toggle */}
        <div className="flex items-center justify-between p-3 border-b border-gray-900">
          {isExpanded ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-black border border-gray-800">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight flex items-center gap-1">
                Grok
                <span className="text-xs font-normal text-gray-500">beta</span>
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-black border border-gray-800">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-7 w-7 text-gray-500 hover:bg-gray-900 hover:text-white"
          >
            {isExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>

        {/* New Chat button */}
        <div className="p-2">
          <Button
            onClick={handleCreateNewChat}
            className={cn(
              "w-full justify-start gap-2 bg-gray-900 hover:bg-gray-800 text-white font-medium border border-gray-800",
              !isExpanded && "px-1.5"
            )}
          >
            <Plus className="h-4 w-4" />
            {isExpanded && <span>New Query</span>}
          </Button>
        </div>

        {/* Search and chat history */}
        {isExpanded && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <div className="px-3 pb-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600" />
                <Input
                  placeholder="Search queries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-black border-gray-800 h-9 text-gray-300 placeholder-gray-600 focus:ring-1 focus:ring-gray-700 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category filter with scroll animation */}
            {categories.length > 0 && (
              <div className="px-3 pb-2">
                <motion.div 
                  className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <button
                    onClick={() => setActiveCategory(null)}
                    className={cn(
                      "px-2 py-1 text-xs rounded-full whitespace-nowrap transition-colors",
                      activeCategory === null
                        ? "bg-gray-800 text-white"
                        : "bg-gray-900 text-gray-400 hover:bg-gray-800"
                    )}
                  >
                    All
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={cn(
                        "px-2 py-1 text-xs rounded-full whitespace-nowrap transition-colors",
                        activeCategory === category
                          ? "bg-gray-800 text-white"
                          : "bg-gray-900 text-gray-400 hover:bg-gray-800"
                      )}
                    >
                      {category}
                    </button>
                  ))}
                </motion.div>
              </div>
            )}

            {/* Toggle archived */}
            <div className="px-3 pb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowArchived(!showArchived)}
                className={cn(
                  "w-full justify-start gap-2 text-xs h-8",
                  showArchived
                    ? "text-gray-400 hover:text-gray-300 hover:bg-gray-900"
                    : "text-gray-500 hover:text-gray-400 hover:bg-gray-900"
                )}
              >
                <Archive className="h-3.5 w-3.5" />
                <span>{showArchived ? "Hide Archived" : "Show Archived"}</span>
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto px-2 pb-4 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
              <DragDropContext onDragEnd={onDragEnd}>
                {Object.entries(groupedChats).map(([groupName, chats]) => (
                  <div key={groupName} className="mb-4">
                    <div className="text-xs font-semibold text-gray-600 uppercase px-2 py-1 sticky top-0 bg-black z-10">
                      {groupName}
                    </div>
                    <Droppable droppableId={groupName}>
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-1">
                          {chats.map((chat, index) => (
                            <Draggable key={chat.id} draggableId={chat.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={cn(
                                    "group relative rounded-lg transition-all duration-200",
                                    currentChatId === chat.id
                                      ? "bg-gray-900 border border-gray-800"
                                      : "hover:bg-gray-900",
                                    snapshot.isDragging && "bg-gray-800 shadow-lg"
                                  )}
                                  onMouseEnter={() => setHoveredChatId(chat.id)}
                                  onMouseLeave={() => setHoveredChatId(null)}
                                >
                                  {editingChatId === chat.id ? (
                                    <div className="flex items-center gap-1 p-2">
                                      <Input
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        className="h-8 text-sm bg-black text-gray-300 border-gray-800 focus:ring-1 focus:ring-gray-700 focus:border-transparent"
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
                                        className="h-6 w-6 text-gray-400 hover:bg-gray-800"
                                        onClick={handleSaveEdit}
                                      >
                                        <Edit className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-6 w-6 text-gray-400 hover:bg-gray-800"
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
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <div {...provided.dragHandleProps} className="mr-1 text-gray-600 hover:text-gray-400">
                                              <GripVertical className="h-4 w-4" />
                                            </div>
                                          </TooltipTrigger>
                                          <TooltipContent>Drag to reorder</TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5">
                                          {chat.isPinned && (
                                            <Star className="h-3 w-3 text-gray-500 fill-gray-500" />
                                          )}
                                          {chat.isArchived && (
                                            <Archive className="h-3 w-3 text-gray-600" />
                                          )}
                                          <div className="font-medium text-sm text-gray-200 truncate">
                                            {chat.title}
                                          </div>
                                        </div>
                                        <div className="text-xs text-gray-600 flex items-center gap-1 mt-0.5">
                                          <Clock className="h-3 w-3" />
                                          <span>{chat.date}</span>
                                          <span>•</span>
                                          <span>{chat.messagesCount} messages</span>
                                          {chat.category && (
                                            <>
                                              <span>•</span>
                                              <span className="text-gray-500">{chat.category}</span>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                      {(hoveredChatId === chat.id || currentChatId === chat.id) && (
                                        <motion.div 
                                          className="flex opacity-100 transition-opacity"
                                          initial={{ scale: 0.95 }}
                                          animate={{ scale: 1 }}
                                          transition={{ duration: 0.2 }}
                                        >
                                          <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-6 w-6 text-gray-500 hover:bg-gray-800 hover:text-gray-300"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleTogglePin(chat.id, !chat.isPinned);
                                            }}
                                            title={chat.isPinned ? "Unpin" : "Pin"}
                                          >
                                            <Star className={cn("h-3 w-3", chat.isPinned && "fill-gray-500 text-gray-500")} />
                                          </Button>
                                          <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-6 w-6 text-gray-500 hover:bg-gray-800 hover:text-gray-300"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleEditChat(chat);
                                            }}
                                            title="Rename"
                                          >
                                            <Edit className="h-3 w-3" />
                                          </Button>
                                          <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-6 w-6 text-gray-500 hover:bg-gray-800 hover:text-gray-300"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleToggleArchive(chat.id, !chat.isArchived);
                                            }}
                                            title={chat.isArchived ? "Unarchive" : "Archive"}
                                          >
                                            <Archive className="h-3 w-3" />
                                          </Button>
                                          <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-6 w-6 text-gray-500 hover:bg-gray-800 hover:text-red-400"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleDeleteChat(chat.id);
                                            }}
                                            title="Delete"
                                          >
                                            <Trash2 className="h-3 w-3" />
                                          </Button>
                                        </motion.div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                ))}
              </DragDropContext>
              
              {sortedChats.length === 0 && (
                <div className="text-center py-8 text-sm text-gray-600">
                  {searchQuery ? "No queries match your search" : "No queries yet"}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Bottom buttons */}
        <div className="mt-auto p-2 border-t border-gray-900">
          {isExpanded ? (
            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start gap-2 text-gray-500 hover:bg-gray-900 hover:text-gray-300">
                <FolderOpen className="h-4 w-4" />
                <span>Query Archive</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2 text-gray-500 hover:bg-gray-900 hover:text-gray-300">
                <Settings className="h-4 w-4" />
                <span>Preferences</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2 text-gray-500 hover:bg-gray-900 hover:text-gray-300">
                <HelpCircle className="h-4 w-4" />
                <span>Support</span>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <Button variant="ghost" size="icon" title="Query Archive" className="text-gray-500 hover:bg-gray-900 hover:text-gray-300">
                <FolderOpen className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" title="Preferences" className="text-gray-500 hover:bg-gray-900 hover:text-gray-300">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" title="Support" className="text-gray-500 hover:bg-gray-900 hover:text-gray-300">
                <HelpCircle className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};

export default Sidebar;
