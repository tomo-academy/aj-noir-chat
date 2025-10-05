import { useState } from "react";
import { Mic, Paperclip, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSendMessage, disabled }: ChatInputProps) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-border bg-background">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything"
            disabled={disabled}
            className="min-h-[60px] max-h-[200px] resize-none bg-muted border-0 rounded-3xl px-5 py-4 pr-32 text-[15px] placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
            rows={1}
          />
          
          {/* Bottom controls */}
          <div className="absolute bottom-3 left-5 flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-full hover:bg-accent"
              disabled
            >
              <Paperclip className="h-4 w-4" />
            </Button>
          </div>

          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <Button
              variant="ghost"
              className="h-8 px-3 rounded-full hover:bg-accent text-sm font-medium"
              disabled
            >
              Auto
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-10 w-10 rounded-full hover:bg-accent"
              disabled
            >
              <Mic className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
