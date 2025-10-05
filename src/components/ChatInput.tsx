import { useState, useRef, useEffect } from "react";
import { Mic, Paperclip, ChevronDown, Send, StopCircle, Image, FileText, Smile, Sparkles, Zap } from "lucide-react";
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
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [input]);

  // Generate contextual suggestions based on input
  useEffect(() => {
    if (input.length > 2 && !isGenerating) {
      // Mock suggestions - in real app, this would come from AI
      const mockSuggestions = [
        "Explain in more detail",
        "Give me examples",
        "What are the implications?",
        "Show me the code"
      ];
      setSuggestions(mockSuggestions.slice(0, 2));
    } else {
      setSuggestions([]);
    }
  }, [input, isGenerating]);

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput("");
      setSuggestions([]);
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

  const handleSuggestionClick = (suggestion: string) => {
    setInput(input + " " + suggestion);
    setSuggestions([]);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const autoModes = [
    { 
      id: "balanced", 
      label: "Balanced", 
      description: "Balanced response",
      icon: <Sparkles className="h-4 w-4" />
    },
    { 
      id: "creative", 
      label: "Creative", 
      description: "More creative responses",
      icon: <Zap className="h-4 w-4" />
    },
    { 
      id: "precise", 
      label: "Precise", 
      description: "More precise and factual",
      icon: <div className="h-4 w-4 bg-current rounded-full" />
    },
  ];

  return (
    <div className="border-t border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Suggestions bar */}
      {suggestions.length > 0 && (
        <div className="max-w-3xl mx-auto px-4 py-2">
          <div className="flex gap-2 flex-wrap">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-1.5 text-sm bg-muted/50 hover:bg-muted border border-border/50 rounded-full transition-all hover:scale-105"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="max-w-3xl mx-auto px-4 py-4">
        <div className="relative flex items-end gap-2">
          {/* Main input container with glassmorphism effect */}
          <div className={`relative flex-1 transition-all duration-200 ${
            isFocused 
              ? 'bg-background/80 border-primary/20 shadow-lg shadow-primary/5' 
              : 'bg-muted/30 border-border/30'
          } border rounded-2xl backdrop-blur-sm`}>
            
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={isGenerating ? "Generating response..." : placeholder}
              disabled={disabled || isGenerating}
              className="min-h-[60px] max-h-[200px] resize-none bg-transparent border-0 px-4 py-3 pr-24 text-[15px] placeholder:text-muted-foreground/60 focus-visible:ring-0 transition-all"
              rows={1}
            />
            
            {/* Left side controls - more compact and integrated */}
            <div className="absolute left-2 bottom-2 flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 rounded-full hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors"
                      disabled={disabled || isGenerating}
                    >
                      <Paperclip className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">Attach files</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 rounded-full hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors"
                      disabled={disabled || isGenerating}
                    >
                      <Image className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">Add image</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 rounded-full hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors"
                      disabled={disabled || isGenerating}
                    >
                      <FileText className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">Add document</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Right side controls */}
            <div className="absolute right-2 bottom-2 flex items-center gap-1">
              {/* Mode selector with icons */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-7 px-2 rounded-full hover:bg-accent/50 text-xs font-medium text-muted-foreground hover:text-foreground transition-all gap-1"
                    disabled={disabled || isGenerating}
                  >
                    {autoModes.find(mode => mode.id === autoMode)?.icon}
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2" align="end">
                  <div className="space-y-1">
                    {autoModes.map((mode) => (
                      <div
                        key={mode.id}
                        className={`flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-accent/50 transition-colors ${
                          autoMode === mode.id ? "bg-accent/30" : ""
                        }`}
                        onClick={() => setAutoMode(mode.id)}
                      >
                        <div className="text-muted-foreground">
                          {mode.icon}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{mode.label}</div>
                          <div className="text-xs text-muted-foreground">{mode.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              
              {/* Action buttons */}
              {isGenerating ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-full hover:bg-destructive/10 text-destructive hover:text-destructive transition-all"
                        onClick={onStopGeneration}
                      >
                        <StopCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">Stop generation</TooltipContent>
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
                          className={`h-8 w-8 rounded-full hover:bg-accent/50 transition-all ${
                            isRecording 
                              ? "text-red-500 hover:text-red-600 animate-pulse" 
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                          onClick={toggleRecording}
                          disabled={disabled}
                        >
                          <Mic className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs">
                        {isRecording ? "Stop recording" : "Voice input"}
                      </TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 rounded-full hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-all"
                          disabled={disabled}
                        >
                          <Smile className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs">Add emoji</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <Button
                    size="icon"
                    variant={input.trim() ? "default" : "ghost"}
                    className={`h-8 w-8 rounded-full transition-all duration-200 ${
                      input.trim() 
                        ? 'shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={handleSend}
                    disabled={disabled || input.trim() === ''}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Enhanced hint text with character count */}
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <div>
            {isGenerating ? (
              <span>Press <kbd className="px-1.5 py-0.5 bg-muted/50 rounded text-xs">Enter</kbd> to stop generation</span>
            ) : (
              <span>Press <kbd className="px-1.5 py-0.5 bg-muted/50 rounded text-xs">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 bg-muted/50 rounded text-xs">Shift+Enter</kbd> for new line</span>
            )}
          </div>
          {input.length > 0 && (
            <span className="text-muted-foreground/60">{input.length}/4000</span>
          )}
        </div>
        
        {/* Enhanced recording indicator */}
        {isRecording && (
          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-red-500 bg-red-500/5 py-2 rounded-lg border border-red-500/20">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
              <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <span>Recording... Press microphone to stop</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInput;
