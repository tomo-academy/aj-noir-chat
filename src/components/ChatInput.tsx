import { useState, useRef, useEffect } from "react";
import { Mic, Paperclip, ChevronDown, Send, StopCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onStopGeneration?: () => void;
  disabled?: boolean;
  isGenerating?: boolean;
}

const ChatInput = ({ 
  onSendMessage, 
  onStopGeneration,
  disabled = false, 
  isGenerating = false 
}: ChatInputProps) => {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isGenerating && onStopGeneration) {
        onStopGeneration();
      } else {
        handleSend();
      }
    }
  };

  return (
    <div className="border-t border-border bg-background/95 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-4 py-4">
        <div className="relative flex items-end gap-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isGenerating ? "Generating response..." : "Ask anything"}
            disabled={disabled || isGenerating}
            className="min-h-[60px] max-h-[200px] resize-none bg-muted/50 border border-border rounded-2xl px-4 py-3 pr-24 text-[15px] placeholder:text-muted-foreground/70 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all"
            rows={1}
          />
          
          {/* Left side controls */}
          <div className="absolute left-3 bottom-3 flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              disabled={disabled || isGenerating}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
          </div>

          {/* Right side controls */}
          <div className="absolute right-3 bottom-3 flex items-center gap-1">
            <Button
              variant="ghost"
              className="h-8 px-2.5 rounded-full hover:bg-accent text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              disabled={disabled || isGenerating}
            >
              Auto
              <ChevronDown className="h-3 w-3 ml-0.5" />
            </Button>
            
            {isGenerating ? (
              <Button
                size="icon"
                variant="ghost"
                className="h-9 w-9 rounded-full hover:bg-destructive/10 text-destructive hover:text-destructive transition-colors"
                onClick={onStopGeneration}
              >
                <StopCircle className="h-5 w-5" />
              </Button>
            ) : (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                  disabled={disabled || input.trim() === ''}
                >
                  <Mic className="h-5 w-5" />
                </Button>
                <Button
                  size="icon"
                  variant={input.trim() ? "default" : "ghost"}
                  className={`h-9 w-9 rounded-full transition-all ${input.trim() ? 'shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                  onClick={handleSend}
                  disabled={disabled || input.trim() === ''}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>
        </div>
        
        {/* Hint text */}
        <div className="mt-2 text-xs text-center text-muted-foreground">
          {isGenerating ? (
            <span>Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Enter</kbd> to stop generation</span>
          ) : (
            <span>Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Shift+Enter</kbd> for new line</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
