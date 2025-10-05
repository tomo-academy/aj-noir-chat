import { Sparkles, Search, Plus, Edit, History, Settings, HelpCircle } from "lucide-react";
import { Button } from "./ui/button";

interface SidebarProps {
  onNewChat: () => void;
}

const Sidebar = ({ onNewChat }: SidebarProps) => {
  return (
    <aside className="w-16 bg-sidebar border-r border-border flex flex-col items-center py-4 gap-2">
      {/* Logo */}
      <div className="mb-4 flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
        <Sparkles className="w-6 h-6 text-primary-foreground" />
      </div>

      {/* New Chat */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onNewChat}
        className="w-10 h-10 hover:bg-accent"
        title="New chat"
      >
        <Plus className="w-5 h-5" />
      </Button>

      {/* Search */}
      <Button
        variant="ghost"
        size="icon"
        className="w-10 h-10 hover:bg-accent"
        title="Search"
      >
        <Search className="w-5 h-5" />
      </Button>

      {/* Edit */}
      <Button
        variant="ghost"
        size="icon"
        className="w-10 h-10 hover:bg-accent"
        title="Edit"
      >
        <Edit className="w-5 h-5" />
      </Button>

      {/* History */}
      <Button
        variant="ghost"
        size="icon"
        className="w-10 h-10 hover:bg-accent"
        title="History"
      >
        <History className="w-5 h-5" />
      </Button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Help */}
      <Button
        variant="ghost"
        size="icon"
        className="w-10 h-10 hover:bg-accent"
        title="Help"
      >
        <HelpCircle className="w-5 h-5" />
      </Button>

      {/* Settings */}
      <Button
        variant="ghost"
        size="icon"
        className="w-10 h-10 hover:bg-accent"
        title="Settings"
      >
        <Settings className="w-5 h-5" />
      </Button>
    </aside>
  );
};

export default Sidebar;
