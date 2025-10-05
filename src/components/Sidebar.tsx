import { useState, useEffect, useCallback, useMemo } from "react";
import { Sparkles, Search, Plus, Edit, History, Settings, HelpCircle, ChevronLeft, ChevronRight, Trash2, X, Archive, Clock, Star, FolderOpen, Zap, GripVertical, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import SettingsModal from "./SettingsModal";

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
  onReorderChats?: (newOrder: ChatItem[]) => void;
  currentChatId?: string;
  expanded?: boolean;
  onToggleExpanded?: () => void;
  onOpenSettings?: () => void;
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
  currentChatId,
  expanded = true,
  onToggleExpanded,
  onOpenSettings
}: SidebarProps) => {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatItem[]>([]);
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

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

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(chatHistory));
  }, [chatHistory]);

  const categories = useMemo(() => 
    Array.from(new Set(chatHistory.map(chat => chat.category).filter(Boolean) as string[])),
    [chatHistory]
  );

  useEffect(() => {
    setIsExpanded(expanded);
  }, [expanded]);

  const toggleSidebar = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    if (onToggleExpanded) {
      onToggleExpanded();
    }
  };

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
    if (window.innerWidth < 768) {
      setIsExpanded(false);
    }
  };

  const filteredChats = useMemo(() => chatHistory.filter(chat => {
    const matchesSearch = chat.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesArchived = showArchived ? chat.isArchived : !chat.isArchived;
    const matchesCategory = activeCategory ? chat.category === activeCategory : true;
    return matchesSearch && matchesArchived && matchesCategory;
  }), [chatHistory, searchQuery, showArchived, activeCategory]);

  const sortedChats = useMemo(() => [...filteredChats].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.timestamp - a.timestamp;
  }), [filteredChats]);

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
        initial={{ width: isExpanded ? 320 : 60 }}
        animate={{ width: isExpanded ? 320 : 60 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "bg-black/95 backdrop-blur-sm border-r border-gray-800 flex flex-col transition-all duration-300 overflow-hidden h-full",
          "lg:relative lg:translate-x-0",
          isExpanded ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-800 bg-gray-900/20">
          {isExpanded ? (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg ring-2 ring-blue-500/20">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg sm:text-xl text-white tracking-tight block">
                  AJ STUDIOZ
                </span>
                <span className="text-xs text-blue-400 font-medium bg-blue-500/10 px-2 py-0.5 rounded-full">
                  AI Assistant
                </span>
              </div>
            </motion.div>
          ) : (
            <div className="flex items-center justify-center w-full">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8 text-gray-400 hover:bg-gray-700/50 hover:text-white rounded-lg transition-all duration-200 touch-manipulation"
          >
            {isExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>

        {/* New Chat Button */}
        <div className="p-3 sm:p-4">
          <Button
            onClick={handleCreateNewChat}
            className={cn(
              "w-full justify-start gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold border-0 shadow-lg h-10 sm:h-11 rounded-xl transition-all duration-200 touch-manipulation",
              !isExpanded && "px-2 justify-center"
            )}
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            {isExpanded && <span className="text-sm sm:text-base">New Conversation</span>}
          </Button>
        </div>

        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            {/* Search */}
            <div className="px-3 sm:px-4 pb-3 sm:pb-4">
              <div className="relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 sm:pl-11 pr-3 sm:pr-4 bg-gray-900/50 border-gray-700 h-9 sm:h-10 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 rounded-xl backdrop-blur-sm transition-all duration-200 text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Categories */}
            {categories.length > 0 && (
              <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 sm:mb-3">Categories</h3>
                <motion.div 
                  className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-hide"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <button
                    onClick={() => setActiveCategory(null)}
                    className={cn(
                      "px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-xl whitespace-nowrap transition-all duration-200 font-medium touch-manipulation",
                      activeCategory === null
                        ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white"
                    )}
                  >
                    All
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={cn(
                        "px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-xl whitespace-nowrap transition-all duration-200 font-medium touch-manipulation",
                        activeCategory === category
                          ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                          : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white"
                      )}
                    >
                      {category}
                    </button>
                  ))}
                </motion.div>
              </div>
            )}

            {/* Archive Toggle */}
            <div className="px-3 sm:px-4 pb-3 sm:pb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowArchived(!showArchived)}
                className={cn(
                  "w-full justify-start gap-2 sm:gap-3 text-xs sm:text-sm h-9 sm:h-10 rounded-xl transition-all duration-200 touch-manipulation",
                  showArchived
                    ? "bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20"
                    : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                )}
              >
                <Archive className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>{showArchived ? "Hide Archived" : "Show Archived"}</span>
              </Button>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto px-3 sm:px-4 pb-3 sm:pb-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
              <DragDropContext onDragEnd={onDragEnd}>
                {Object.entries(groupedChats).map(([groupName, chats]) => (
                  <div key={groupName} className="mb-6">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-2 sticky top-0 bg-black/80 backdrop-blur-sm z-10 rounded-lg mb-2">
                      {groupName}
                    </div>
                    <Droppable droppableId={groupName}>
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-1">
                          {chats.map((chat, index) => (
                            <Draggable key={chat.id} draggableId={chat.id} index={index}>
                      {(provided, snapshot) => (
                        <motion.div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={cn(
                            "group relative rounded-xl transition-all duration-200 border backdrop-blur-sm touch-manipulation",
                            currentChatId === chat.id
                              ? "bg-blue-500/10 border-blue-500/30 shadow-lg shadow-blue-500/10"
                              : "bg-gray-900/30 border-gray-800 hover:bg-gray-800/50 hover:border-gray-700",
                            snapshot.isDragging && "bg-gray-700/50 shadow-2xl scale-105 rotate-1"
                          )}
                          onMouseEnter={() => setHoveredChatId(chat.id)}
                          onMouseLeave={() => setHoveredChatId(null)}
                          whileHover={{ y: -2 }}
                          transition={{ duration: 0.2 }}
                        >
                          {editingChatId === chat.id ? (
                            <div className="flex items-center gap-2 p-3">
                              <Input
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="h-9 text-sm bg-gray-800/50 text-gray-200 border-gray-600 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 rounded-lg"
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
                                className="h-7 w-7 text-green-400 hover:bg-green-500/20 rounded-lg"
                                onClick={handleSaveEdit}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 text-gray-400 hover:bg-gray-700/50 rounded-lg"
                                onClick={() => {
                                  setEditingChatId(null);
                                  setEditTitle("");
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div
                              className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 cursor-pointer"
                              onClick={() => onSelectChat && onSelectChat(chat.id)}
                            >
                              {/* Drag Handle */}
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div {...provided.dragHandleProps} className="text-gray-500 hover:text-gray-300 transition-colors touch-manipulation">
                                      <GripVertical className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-gray-800 border-gray-700">Drag to reorder</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              
                              {/* Chat Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                                  {chat.isPinned && (
                                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                                  )}
                                  {chat.isArchived && (
                                    <Archive className="h-3 w-3 text-gray-500" />
                                  )}
                                  <div className={`font-semibold text-xs sm:text-sm truncate ${
                                    currentChatId === chat.id ? 'text-blue-300' : 'text-gray-200'
                                  }`}>
                                    {chat.title}
                                  </div>
                                </div>
                                <div className="text-xs text-gray-500 flex items-center gap-1 sm:gap-1.5 flex-wrap">
                                  <Clock className="h-3 w-3" />
                                  <span>{chat.date}</span>
                                  <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                                  <span>{chat.messagesCount} msgs</span>
                                  {chat.category && (
                                    <>
                                      <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                                      <span className="text-blue-400 text-xs px-1.5 py-0.5 bg-blue-500/10 rounded-md">
                                        {chat.category}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                              {/* Action Buttons */}
                              {(hoveredChatId === chat.id || currentChatId === chat.id) && (
                                <motion.div 
                                  className="flex items-center gap-0.5 sm:gap-1 bg-gray-800/80 backdrop-blur-sm rounded-lg p-0.5 sm:p-1 border border-gray-700"
                                  initial={{ opacity: 0, scale: 0.9, x: 10 }}
                                  animate={{ opacity: 1, scale: 1, x: 0 }}
                                  transition={{ duration: 0.15 }}
                                >
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          size="icon"
                                          variant="ghost"
                                          className={`h-6 w-6 sm:h-7 sm:w-7 rounded-md transition-all duration-200 touch-manipulation ${
                                            chat.isPinned 
                                              ? "text-yellow-400 bg-yellow-500/20 hover:bg-yellow-500/30" 
                                              : "text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/20"
                                          }`}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleTogglePin(chat.id, !chat.isPinned);
                                          }}
                                        >
                                          <Star className={cn("h-3 w-3 sm:h-3.5 sm:w-3.5", chat.isPinned && "fill-current")} />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent className="bg-gray-800 border-gray-700">
                                        {chat.isPinned ? "Unpin chat" : "Pin chat"}
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                  
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          size="icon"
                                          variant="ghost"
                                          className="h-6 w-6 sm:h-7 sm:w-7 text-gray-400 hover:text-blue-400 hover:bg-blue-500/20 rounded-md transition-all duration-200 touch-manipulation"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditChat(chat);
                                          }}
                                        >
                                          <Edit className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent className="bg-gray-800 border-gray-700">Rename chat</TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                  
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          size="icon"
                                          variant="ghost"
                                          className={`h-6 w-6 sm:h-7 sm:w-7 rounded-md transition-all duration-200 touch-manipulation ${
                                            chat.isArchived 
                                              ? "text-orange-400 bg-orange-500/20 hover:bg-orange-500/30" 
                                              : "text-gray-400 hover:text-orange-400 hover:bg-orange-500/20"
                                          }`}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleToggleArchive(chat.id, !chat.isArchived);
                                          }}
                                        >
                                          <Archive className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent className="bg-gray-800 border-gray-700">
                                        {chat.isArchived ? "Unarchive chat" : "Archive chat"}
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                  
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          size="icon"
                                          variant="ghost"
                                          className="h-6 w-6 sm:h-7 sm:w-7 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded-md transition-all duration-200 touch-manipulation"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteChat(chat.id);
                                          }}
                                        >
                                          <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent className="bg-gray-800 border-gray-700">Delete chat</TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </motion.div>
                              )}
                                    </div>
                                  )}
                                </motion.div>
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

        {/* Footer */}
        <div className="mt-auto p-3 sm:p-4 border-t border-gray-800 bg-gray-900/20">
          {isExpanded ? (
            <motion.div 
              className="space-y-1.5 sm:space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2 sm:gap-3 text-gray-400 hover:bg-gray-700/50 hover:text-white h-9 sm:h-10 rounded-xl transition-all duration-200 touch-manipulation"
              >
                <FolderOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="text-sm sm:text-base">Chat Archive</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2 sm:gap-3 text-gray-400 hover:bg-gray-700/50 hover:text-white h-9 sm:h-10 rounded-xl transition-all duration-200 touch-manipulation"
                onClick={() => {
                  if (onOpenSettings) {
                    onOpenSettings();
                  } else {
                    setShowSettings(true);
                  }
                }}
              >
                <Settings className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="text-sm sm:text-base">Settings</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2 sm:gap-3 text-gray-400 hover:bg-gray-700/50 hover:text-white h-9 sm:h-10 rounded-xl transition-all duration-200 touch-manipulation"
              >
                <HelpCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="text-sm sm:text-base">Help & Support</span>
              </Button>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-1.5 sm:gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-9 w-9 sm:h-10 sm:w-10 text-gray-400 hover:bg-gray-700/50 hover:text-white rounded-xl transition-all duration-200 touch-manipulation"
                    >
                      <FolderOpen className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-gray-800 border-gray-700">Chat Archive</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-9 w-9 sm:h-10 sm:w-10 text-gray-400 hover:bg-gray-700/50 hover:text-white rounded-xl transition-all duration-200 touch-manipulation"
                      onClick={() => {
                        if (onOpenSettings) {
                          onOpenSettings();
                        } else {
                          setShowSettings(true);
                        }
                      }}
                    >
                      <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-gray-800 border-gray-700">Settings</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-9 w-9 sm:h-10 sm:w-10 text-gray-400 hover:bg-gray-700/50 hover:text-white rounded-xl transition-all duration-200 touch-manipulation"
                    >
                      <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-gray-800 border-gray-700">Help & Support</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
      </motion.aside>
      
      {/* Settings Modal */}
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </AnimatePresence>
  );
};

export default Sidebar;
