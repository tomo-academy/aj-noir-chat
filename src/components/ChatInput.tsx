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
  placeholder = "Ask Grok anything about the universe"
}: ChatInputProps) => {
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [autoMode, setAutoMode] = useState("balanced");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
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
    { id: "balanced", label: "Balanced", description: "Balanced cosmic insights" },
    { id: "creative", label: "Creative", description: "Explore imaginative ideas" },
    { id: "precise", label: "Precise", description: "Factual stellar responses" },
  ];

  return (
    <div className="border-t border-gray-800 bg-gray-900/95 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="relative flex items-end gap-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isGenerating ? "Generating cosmic response..." : placeholder}
            disabled={disabled || isGenerating}
            className="min-h-[60px] max-h-[200px] resize-none bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 pr-24 text-[15px] text-gray-200 placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-all shadow-sm"
            rows={1}
          />

          {/* Left side controls */}
          <div className="absolute left-3 bottom-3 flex items-center gap-1.5">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-full hover:bg-gray-800 text-gray-400 hover:text-gray-200 transition-colors hover:shadow-glow"
                    disabled={disabled || isGenerating}
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-gray-800 text-gray-200 border-gray-700">
                  Attach files
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-full hover:bg-gray-800 text-gray-400 hover:text-gray-200 transition-colors hover:shadow-glow"
                    disabled={disabled || isGenerating}
                  >
                    <Image className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-gray-800 text-gray-200 border-gray-700">
                  Add image
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-full hover:bg-gray-800 text-gray-400 hover:text-gray-200 transition-colors hover:shadow-glow"
                    disabled={disabled || isGenerating}
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-gray-800 text-gray-200 border-gray-700">
                  Add document
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Right side controls */}
          <div className="absolute right-3 bottom-3 flex items-center gap-1.5">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 px-3 rounded-full hover:bg-gray-800 text-xs font-medium text-gray-400 hover:text-gray-200 transition-colors gap-1 hover:shadow-glow"
                  disabled={disabled || isGenerating}
                >
                  {autoMode === "balanced" && "Balanced"}
                  {autoMode === "creative" && "Creative"}
                  {autoMode === "precise" && "Precise"}
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2 bg-gray-800 border-gray-700 text-gray-200">
                <div className="space-y-1">
                  {autoModes.map((mode) => (
                    <div
                      key={mode.id}
                      className={`flex flex-col gap-1 p-2 rounded-md cursor-pointer hover:bg-gray-700 ${
                        autoMode === mode.id ? "bg-gray-700" : ""
                      }`}
                      onClick={() => setAutoMode(mode.id)}
                    >
                      <div className="font-medium text-sm">{mode.label}</div>
                      <div className="text-xs text-gray-400">{mode.description}</div>
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
                      className="h-9 w-9 rounded-full hover:bg-red-500/20 text-red-500 hover:text-red-400 transition-colors hover:shadow-glow"
                      onClick={onStopGeneration}
                    >
                      <StopCircle className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-gray-800 text-gray-200 border-gray-700">
                    Stop generation
                  </TooltipContent>
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
                        className={`h-9 w-9 rounded-full hover:bg-gray-800 transition-colors hover:shadow-glow ${
                          isRecording
                            ? "text-red-500 hover:text-red-400"
                            : "text-gray-400 hover:text-gray-200"
                        }`}
                        onClick={toggleRecording}
                        disabled={disabled}
                      >
                        <Mic className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="bg-gray-800 text-gray-200 border-gray-700">
                      {isRecording ? "Stop recording" : "Voice input"}
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-9 w-9 rounded-full hover:bg-gray-800 text-gray-400 hover:text-gray-200 transition-colors hover:shadow-glow"
                        disabled={disabled}
                      >
                        <Smile className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="bg-gray-800 text-gray-200 border-gray-700">
                      Add emoji
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button
                  size="icon"
                  variant={input.trim() ? "default" : "ghost"}
                  className={`h-9 w-9 rounded-full transition-all ${
                    input.trim()
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-glow"
                      : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                  }`}
                  onClick={handleSend}
                  disabled={disabled || input.trim() === ""}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Hint text */}
        <div className="mt-2 text-xs text-center text-gray-400">
          {isGenerating ? (
            <span>
              Press <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-xs">Enter</kbd> to stop
              generation
            </span>
          ) : (
            <span>
              Press <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-xs">Enter</kbd> to query,{" "}
              <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-xs">Shift+Enter</kbd> for new line
            </span>
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
