import { useState } from "react";
import { Sparkles, Search, Plus, Edit, History, Settings, HelpCircle, ChevronLeft, ChevronRight, Trash2, MoreVertical } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface SidebarProps {
  onNewChat: () => void;
  onSelectChat?: (chatId: string) => void;
  onDeleteChat?: (chatId: string) => void;
  onRenameChat?: (chatId: string, newTitle: string) => void;
}

interface ChatItem {
  id: string;
  title: string;
  date: string;
}

const Sidebar = ({ onNewChat, onSelectChat, onDeleteChat, onRenameChat }: SidebarProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  
  // Mock chat history data
  const [chatHistory, setChatHistory] = useState<ChatItem[]>([
    { id: "1", title: "How to optimize React performance", date: "Today" },
    { id: "2", title: "Explain quantum computing basics", date: "Yesterday" },
    { id: "3", title: "Best practices for TypeScript", date: "Jun 12" },
    { id: "4", title: "Understanding neural networks", date: "Jun 10" },
    { id: "5", title: "Web development trends 2023", date: "Jun 8" },
  ]);

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
    <aside className={`bg-sidebar border-r border-border flex flex-col transition-all duration-300 ${isExpanded ? 'w-64' : 'w-16'}`}>
      {/* Logo and toggle */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {isExpanded ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold">Grok</span>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="h-6 w-6"
        >
          {isExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>

      {/* New Chat button */}
      <div className="p-2">
        <Button
          variant="default"
          onClick={onNewChat}
          className={`w-full justify-start ${isExpanded ? '' : 'px-2'}`}
        >
          <Plus className="h-4 w-4" />
          {isExpanded && <span className="ml-2">New chat</span>}
        </Button>
      </div>

      {/* Search and chat history */}
      {isExpanded && (
        <>
          <div className="px-3 py-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search chats"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted border-0"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase px-2 py-2">Recent</div>
            <div className="space-y-1">
              {filteredChats.map((chat) => (
                <div key={chat.id} className="group relative">
                  {editingChatId === chat.id ? (
                    <div className="flex items-center gap-1 p-2 rounded-lg bg-accent">
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="h-8 text-sm"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit();
                          if (e.key === 'Escape') {
                            setEditingChatId(null);
                            setEditTitle("");
                          }
                        }}
                      />
                      <Button size="icon" variant="ghost" className="h-6 w-6" onClick={handleSaveEdit}>
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div 
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-accent cursor-pointer group"
                      onClick={() => onSelectChat && onSelectChat(chat.id)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{chat.title}</div>
                        <div className="text-xs text-muted-foreground">{chat.date}</div>
                      </div>
                      <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-6 w-6"
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
                          className="h-6 w-6 text-destructive hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteChat(chat.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Bottom buttons */}
      <div className="mt-auto p-2 border-t border-border">
        {isExpanded ? (
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start">
              <History className="h-4 w-4 mr-2" />
              History
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <HelpCircle className="h-4 w-4 mr-2" />
              Help
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <Button variant="ghost" size="icon" title="History">
              <History className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Settings">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Help">
              <HelpCircle className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
