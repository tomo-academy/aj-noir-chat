import { useState, useRef, useEffect } from "react";
import { Mic, Paperclip, ChevronDown, Send, StopCircle, Image, FileText, Smile } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onStopGeneration?: () => void;
  disabled?: boolean;
  isGenerating?: boolean;
  placeholder?: string;
}

const ChatInput = ({ 
  onSendMessage, 
  onStopGeneration,
  disabled = false, 
  isGenerating = false,
  placeholder = "Ask anything"
}: ChatInputProps) => {
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [autoMode, setAutoMode] = useState("balanced");
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

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real app, this would start/stop voice recording
  };

  const autoModes = [
    { id: "balanced", label: "Balanced", description: "Balanced response" },
    { id: "creative", label: "Creative", description: "More creative responses" },
    { id: "precise", label: "Precise", description: "More precise and factual" },
  ];

  return (
    <div className="border-t border-border bg-background/95 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-4 py-4">
        <div className="relative flex items-end gap-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isGenerating ? "Generating response..." : placeholder}
            disabled={disabled || isGenerating}
            className="min-h-[60px] max-h-[200px] resize-none bg-muted/50 border border-border rounded-2xl px-4 py-3 pr-24 text-[15px] placeholder:text-muted-foreground/70 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all"
            rows={1}
          />
          
          {/* Left side controls */}
          <div className="absolute left-3 bottom-3 flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                    disabled={disabled || isGenerating}
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Attach files</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                    disabled={disabled || isGenerating}
                  >
                    <Image className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Add image</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                    disabled={disabled || isGenerating}
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Add document</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Right side controls */}
          <div className="absolute right-3 bottom-3 flex items-center gap-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 px-2.5 rounded-full hover:bg-accent text-xs font-medium text-muted-foreground hover:text-foreground transition-colors gap-1"
                  disabled={disabled || isGenerating}
                >
                  {autoMode === "balanced" && "Balanced"}
                  {autoMode === "creative" && "Creative"}
                  {autoMode === "precise" && "Precise"}
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2">
                <div className="space-y-1">
                  {autoModes.map((mode) => (
                    <div
                      key={mode.id}
                      className={`flex flex-col gap-1 p-2 rounded-md cursor-pointer hover:bg-accent ${
                        autoMode === mode.id ? "bg-accent" : ""
                      }`}
                      onClick={() => setAutoMode(mode.id)}
                    >
                      <div className="font-medium text-sm">{mode.label}</div>
                      <div className="text-xs text-muted-foreground">{mode.description}</div>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            
            {isGenerating ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-9 w-9 rounded-full hover:bg-destructive/10 text-destructive hover:text-destructive transition-colors"
                      onClick={onStopGeneration}
                    >
                      <StopCircle className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Stop generation</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className={`h-9 w-9 rounded-full hover:bg-accent transition-colors ${
                          isRecording 
                            ? "text-red-500 hover:text-red-600" 
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                        onClick={toggleRecording}
                        disabled={disabled}
                      >
                        <Mic className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      {isRecording ? "Stop recording" : "Voice input"}
                    </TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-9 w-9 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                        disabled={disabled}
                      >
                        <Smile className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Add emoji</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <Button
                  size="icon"
                  variant={input.trim() ? "default" : "ghost"}
                  className={`h-9 w-9 rounded-full transition-all ${
                    input.trim() ? 'shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  }`}
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
        
        {/* Recording indicator */}
        {isRecording && (
          <div className="mt-2 flex items-center justify-center gap-2 text-xs text-red-500">
            <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
            <span>Recording... Press the microphone button to stop</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInput;
