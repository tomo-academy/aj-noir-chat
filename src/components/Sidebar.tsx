import { useState, useEffect, useCallback, useMemo } from "react";
import { Sparkles, Search, Plus, Edit, History, Settings, HelpCircle, ChevronLeft, ChevronRight, Trash2, X, Archive, Clock, Star, FolderOpen, Zap, GripVertical, Check, Filter, SortAsc, SortDesc, Grid3X3, List, MoreVertical, Bookmark, Tag, Calendar, TrendingUp, MessageSquare, Code, Brain, Lightbulb } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
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
  tags?: string[];
  lastMessage?: string;
  isFavorite?: boolean;
  model?: string;
  tokens?: number;
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
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [sortBy, setSortBy] = useState<"date" | "title" | "messages">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showStats, setShowStats] = useState(false);

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
        { 
          id: "1", 
          title: "Advanced React Patterns & Hooks", 
          date: "Today", 
          timestamp: Date.now(), 
          messagesCount: 8, 
          isPinned: true,
          category: "Development",
          tags: ["React", "JavaScript", "Hooks"],
          lastMessage: "Can you show me how to implement custom hooks for data fetching?",
          model: "GPT-4",
          tokens: 1250
        },
        { 
          id: "2", 
          title: "Machine Learning Fundamentals", 
          date: "Yesterday", 
          timestamp: Date.now() - 86400000, 
          messagesCount: 12, 
          category: "AI/ML",
          tags: ["Python", "TensorFlow", "Neural Networks"],
          lastMessage: "What's the difference between supervised and unsupervised learning?",
          model: "Claude-3",
          tokens: 2100
        },
        { 
          id: "3", 
          title: "Web3 & Blockchain Development", 
          date: "Oct 3", 
          timestamp: Date.now() - 172800000, 
          messagesCount: 5, 
          category: "Blockchain",
          tags: ["Solidity", "Ethereum", "Smart Contracts"],
          lastMessage: "How do I deploy a smart contract to the Ethereum mainnet?",
          model: "GPT-4",
          tokens: 890
        },
        { 
          id: "4", 
          title: "Creative Writing & Storytelling", 
          date: "Oct 1", 
          timestamp: Date.now() - 259200000, 
          messagesCount: 15, 
          isPinned: true,
          category: "Creative",
          tags: ["Writing", "Fiction", "Character Development"],
          lastMessage: "Help me develop a compelling antagonist for my sci-fi novel",
          model: "Claude-3",
          tokens: 3200
        },
        { 
          id: "5", 
          title: "Data Science & Analytics", 
          date: "Sep 30", 
          timestamp: Date.now() - 345600000, 
          messagesCount: 7, 
          category: "Data Science",
          tags: ["Python", "Pandas", "Visualization"],
          lastMessage: "What's the best way to handle missing data in pandas?",
          model: "GPT-4",
          tokens: 1450
        },
        { 
          id: "6", 
          title: "UI/UX Design Principles", 
          date: "Sep 28", 
          timestamp: Date.now() - 432000000, 
          messagesCount: 10, 
          category: "Design",
          tags: ["Figma", "User Experience", "Prototyping"],
          lastMessage: "How can I improve the accessibility of my mobile app?",
          model: "Claude-3",
          tokens: 1800
        },
        { 
          id: "7", 
          title: "DevOps & Cloud Architecture", 
          date: "Sep 25", 
          timestamp: Date.now() - 518400000, 
          messagesCount: 6, 
          isArchived: true,
          category: "DevOps",
          tags: ["AWS", "Docker", "Kubernetes"],
          lastMessage: "Setting up CI/CD pipeline with GitHub Actions",
          model: "GPT-4",
          tokens: 1100
        },
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

  const allTags = useMemo(() => 
    Array.from(new Set(chatHistory.flatMap(chat => chat.tags || []))),
    [chatHistory]
  );

  const stats = useMemo(() => ({
    totalChats: chatHistory.length,
    totalMessages: chatHistory.reduce((sum, chat) => sum + chat.messagesCount, 0),
    totalTokens: chatHistory.reduce((sum, chat) => sum + (chat.tokens || 0), 0),
    pinnedChats: chatHistory.filter(chat => chat.isPinned).length,
    archivedChats: chatHistory.filter(chat => chat.isArchived).length,
  }), [chatHistory]);

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
    const matchesSearch = chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (chat.lastMessage && chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesArchived = showArchived ? chat.isArchived : !chat.isArchived;
    const matchesCategory = activeCategory ? chat.category === activeCategory : true;
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => chat.tags?.includes(tag));
    return matchesSearch && matchesArchived && matchesCategory && matchesTags;
  }), [chatHistory, searchQuery, showArchived, activeCategory, selectedTags]);

  const sortedChats = useMemo(() => [...filteredChats].sort((a, b) => {
    // Always prioritize pinned chats
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    // Then sort by selected criteria
    let comparison = 0;
    switch (sortBy) {
      case "date":
        comparison = a.timestamp - b.timestamp;
        break;
      case "title":
        comparison = a.title.localeCompare(b.title);
        break;
      case "messages":
        comparison = a.messagesCount - b.messagesCount;
        break;
    }
    
    return sortOrder === "asc" ? comparison : -comparison;
  }), [filteredChats, sortBy, sortOrder]);

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
        <div className="flex items-center justify-between p-4 border-b border-gray-800/50 bg-gradient-to-r from-gray-900/30 to-gray-800/20 backdrop-blur-sm">
          {isExpanded ? (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg ring-2 ring-blue-500/20">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="font-bold text-xl text-white tracking-tight block">
                  AJ STUDIOZ
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-blue-400 font-medium bg-blue-500/10 px-2 py-0.5 rounded-full">
                    AI Assistant
                  </span>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20 text-xs">
                    Online
                  </Badge>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex items-center justify-center w-full">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          )}
          <div className="flex items-center gap-1">
            {isExpanded && (
              <Popover open={showStats} onOpenChange={setShowStats}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:bg-gray-700/50 hover:text-white rounded-lg transition-all duration-200"
                  >
                    <TrendingUp className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-3 bg-gray-900/95 backdrop-blur-sm border-gray-700" side="right" align="start">
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-200">Statistics</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-gray-800/50 rounded-lg p-2">
                        <div className="text-gray-400">Total Chats</div>
                        <div className="text-white font-semibold">{stats.totalChats}</div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-2">
                        <div className="text-gray-400">Messages</div>
                        <div className="text-white font-semibold">{stats.totalMessages}</div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-2">
                        <div className="text-gray-400">Tokens</div>
                        <div className="text-white font-semibold">{stats.totalTokens.toLocaleString()}</div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-2">
                        <div className="text-gray-400">Pinned</div>
                        <div className="text-white font-semibold">{stats.pinnedChats}</div>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-8 w-8 text-gray-400 hover:bg-gray-700/50 hover:text-white rounded-lg transition-all duration-200"
            >
              {isExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <Button
            onClick={handleCreateNewChat}
            className={cn(
              "w-full justify-start gap-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold border-0 shadow-lg h-11 rounded-xl transition-all duration-200 group",
              !isExpanded && "px-2 justify-center"
            )}
          >
            <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-200" />
            {isExpanded && <span className="text-base">New Conversation</span>}
          </Button>
        </div>

        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            {/* Search & Filters */}
            <div className="px-4 pb-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 pr-12 bg-gray-900/60 border-gray-700/50 h-10 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 rounded-xl backdrop-blur-sm transition-all duration-200 text-sm"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                  <Popover open={showFilters} onOpenChange={setShowFilters}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-md"
                      >
                        <Filter className="h-3 w-3" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-3 bg-gray-900/95 backdrop-blur-sm border-gray-700" side="bottom" align="start">
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-gray-200">Filters</h4>
                        
                        {/* Sort Options */}
                        <div className="space-y-2">
                          <label className="text-xs text-gray-400">Sort by</label>
                          <div className="flex gap-2">
                            {[
                              { id: "date", label: "Date", icon: Calendar },
                              { id: "title", label: "Title", icon: List },
                              { id: "messages", label: "Messages", icon: MessageSquare }
                            ].map((option) => (
                              <Button
                                key={option.id}
                                variant={sortBy === option.id ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setSortBy(option.id as any)}
                                className="flex-1 h-8 text-xs"
                              >
                                <option.icon className="h-3 w-3 mr-1" />
                                {option.label}
                              </Button>
                            ))}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                            className="w-full h-8 text-xs"
                          >
                            {sortOrder === "asc" ? <SortAsc className="h-3 w-3 mr-1" /> : <SortDesc className="h-3 w-3 mr-1" />}
                            {sortOrder === "asc" ? "Ascending" : "Descending"}
                          </Button>
                        </div>

                        <Separator className="bg-gray-700" />

                        {/* Tags Filter */}
                        {allTags.length > 0 && (
                          <div className="space-y-2">
                            <label className="text-xs text-gray-400">Filter by tags</label>
                            <div className="flex flex-wrap gap-1">
                              {allTags.slice(0, 8).map((tag) => (
                                <Button
                                  key={tag}
                                  variant={selectedTags.includes(tag) ? "default" : "ghost"}
                                  size="sm"
                                  onClick={() => {
                                    setSelectedTags(prev => 
                                      prev.includes(tag) 
                                        ? prev.filter(t => t !== tag)
                                        : [...prev, tag]
                                    );
                                  }}
                                  className="h-6 text-xs px-2"
                                >
                                  <Tag className="h-2 w-2 mr-1" />
                                  {tag}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            {/* Categories */}
            {categories.length > 0 && (
              <div className="px-4 pb-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Categories</h3>
                  <Badge variant="secondary" className="bg-gray-700/50 text-gray-300 text-xs">
                    {categories.length}
                  </Badge>
                </div>
                <motion.div 
                  className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <button
                    onClick={() => setActiveCategory(null)}
                    className={cn(
                      "px-3 py-2 text-sm rounded-xl whitespace-nowrap transition-all duration-200 font-medium",
                      activeCategory === null
                        ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border border-blue-500/30 shadow-lg"
                        : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white"
                    )}
                  >
                    All
                  </button>
                  {categories.map((category) => {
                    const categoryIcons: Record<string, any> = {
                      "Development": Code,
                      "AI/ML": Brain,
                      "Blockchain": Zap,
                      "Creative": Lightbulb,
                      "Data Science": TrendingUp,
                      "Design": Sparkles,
                      "DevOps": Settings
                    };
                    const Icon = categoryIcons[category] || MessageSquare;
                    
                    return (
                      <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={cn(
                          "px-3 py-2 text-sm rounded-xl whitespace-nowrap transition-all duration-200 font-medium flex items-center gap-2",
                          activeCategory === category
                            ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border border-blue-500/30 shadow-lg"
                            : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white"
                        )}
                      >
                        <Icon className="h-3 w-3" />
                        {category}
                      </button>
                    );
                  })}
                </motion.div>
              </div>
            )}

            {/* Archive Toggle */}
            <div className="px-4 pb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowArchived(!showArchived)}
                className={cn(
                  "w-full justify-start gap-3 text-sm h-10 rounded-xl transition-all duration-200",
                  showArchived
                    ? "bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 border border-yellow-500/20"
                    : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                )}
              >
                <Archive className="h-4 w-4" />
                <span>{showArchived ? "Hide Archived" : "Show Archived"}</span>
                {stats.archivedChats > 0 && (
                  <Badge variant="secondary" className="ml-auto bg-gray-700/50 text-gray-300 text-xs">
                    {stats.archivedChats}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
              <DragDropContext onDragEnd={onDragEnd}>
                {Object.entries(groupedChats).map(([groupName, chats]) => (
                  <div key={groupName} className="mb-6">
                    <div className="flex items-center justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-2 sticky top-0 bg-black/80 backdrop-blur-sm z-10 rounded-lg mb-2">
                      <span>{groupName}</span>
                      <Badge variant="secondary" className="bg-gray-700/50 text-gray-300 text-xs">
                        {chats.length}
                      </Badge>
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
                                <div className="flex items-center gap-2 mb-1">
                                  {chat.isPinned && (
                                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                                  )}
                                  {chat.isArchived && (
                                    <Archive className="h-3 w-3 text-gray-500" />
                                  )}
                                  <div className={`font-semibold text-sm truncate ${
                                    currentChatId === chat.id ? 'text-blue-300' : 'text-gray-200'
                                  }`}>
                                    {chat.title}
                                  </div>
                                </div>
                                
                                {/* Last Message Preview */}
                                {chat.lastMessage && (
                                  <div className="text-xs text-gray-400 truncate mb-1">
                                    {chat.lastMessage}
                                  </div>
                                )}
                                
                                <div className="flex items-center gap-2 flex-wrap">
                                  <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <Clock className="h-3 w-3" />
                                    <span>{chat.date}</span>
                                  </div>
                                  <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <MessageSquare className="h-3 w-3" />
                                    <span>{chat.messagesCount}</span>
                                  </div>
                                  {chat.tokens && (
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                      <Zap className="h-3 w-3" />
                                      <span>{chat.tokens.toLocaleString()}</span>
                                    </div>
                                  )}
                                  {chat.model && (
                                    <Badge variant="secondary" className="bg-gray-700/50 text-gray-300 text-xs px-1.5 py-0.5">
                                      {chat.model}
                                    </Badge>
                                  )}
                                </div>
                                
                                {/* Tags */}
                                {chat.tags && chat.tags.length > 0 && (
                                  <div className="flex gap-1 mt-1 flex-wrap">
                                    {chat.tags.slice(0, 2).map((tag) => (
                                      <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0.5 border-gray-600 text-gray-400">
                                        {tag}
                                      </Badge>
                                    ))}
                                    {chat.tags.length > 2 && (
                                      <Badge variant="outline" className="text-xs px-1.5 py-0.5 border-gray-600 text-gray-400">
                                        +{chat.tags.length - 2}
                                      </Badge>
                                    )}
                                  </div>
                                )}
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
        <div className="mt-auto p-4 border-t border-gray-800/50 bg-gradient-to-t from-gray-900/30 to-transparent backdrop-blur-sm">
          {isExpanded ? (
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 text-gray-400 hover:bg-gray-700/50 hover:text-white h-10 rounded-xl transition-all duration-200"
              >
                <FolderOpen className="h-4 w-4" />
                <span className="text-sm">Chat Archive</span>
                <Badge variant="secondary" className="ml-auto bg-gray-700/50 text-gray-300 text-xs">
                  {stats.archivedChats}
                </Badge>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 text-gray-400 hover:bg-gray-700/50 hover:text-white h-10 rounded-xl transition-all duration-200"
                onClick={() => {
                  if (onOpenSettings) {
                    onOpenSettings();
                  } else {
                    setShowSettings(true);
                  }
                }}
              >
                <Settings className="h-4 w-4" />
                <span className="text-sm">Settings</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 text-gray-400 hover:bg-gray-700/50 hover:text-white h-10 rounded-xl transition-all duration-200"
              >
                <HelpCircle className="h-4 w-4" />
                <span className="text-sm">Help & Support</span>
              </Button>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-10 w-10 text-gray-400 hover:bg-gray-700/50 hover:text-white rounded-xl transition-all duration-200"
                    >
                      <FolderOpen className="h-5 w-5" />
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
                      className="h-10 w-10 text-gray-400 hover:bg-gray-700/50 hover:text-white rounded-xl transition-all duration-200"
                      onClick={() => {
                        if (onOpenSettings) {
                          onOpenSettings();
                        } else {
                          setShowSettings(true);
                        }
                      }}
                    >
                      <Settings className="h-5 w-5" />
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
                      className="h-10 w-10 text-gray-400 hover:bg-gray-700/50 hover:text-white rounded-xl transition-all duration-200"
                    >
                      <HelpCircle className="h-5 w-5" />
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
