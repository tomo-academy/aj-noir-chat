import { useState, useRef, useEffect } from "react";
import { Mic, Paperclip, Send, Image, Code, Sparkles, Zap, Brain, X, File, Camera } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface ChatInputProps {
  onSendMessage: (message: string, attachments?: File[], mode?: string) => void;
  onStopGeneration?: () => void;
  disabled?: boolean;
  isGenerating?: boolean;
  placeholder?: string;
  aiMode?: "balanced" | "creative" | "precise";
  onModeChange?: (mode: "balanced" | "creative" | "precise") => void;
}

const ChatInput = ({ 
  onSendMessage, 
  onStopGeneration,
  disabled = false, 
  isGenerating = false,
  placeholder = "Ask AJ anything...",
  aiMode = "balanced",
  onModeChange
}: ChatInputProps) => {
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSend = () => {
    if ((input.trim() || attachments.length > 0) && !disabled) {
      onSendMessage(input.trim(), attachments, aiMode);
      setInput("");
      setAttachments([]);
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
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
    setShowAttachMenu(false);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    setAttachments(prev => [...prev, ...files]);
  };

  const modes = [
    { id: "balanced", label: "Balanced", icon: <Sparkles className="h-4 w-4" />, desc: "Well-rounded responses" },
    { id: "creative", label: "Creative", icon: <Zap className="h-4 w-4" />, desc: "Imaginative & innovative" },
    { id: "precise", label: "Precise", icon: <Brain className="h-4 w-4" />, desc: "Accurate & detailed" }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 z-50">
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 py-2 border-b border-gray-200 dark:border-gray-800">
          <div className="flex gap-2 flex-wrap">
            {attachments.map((file, index) => (
              <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                <File className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="text-xs text-gray-700 dark:text-gray-300 max-w-[150px] truncate">{file.name}</span>
                <button
                  onClick={() => removeAttachment(index)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4">
        {/* AI Mode Selector */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">AI Mode:</span>
            <div className="flex gap-1">
              {modes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => onModeChange?.(mode.id as any)}
                  className={`px-3 py-1.5 text-xs rounded-full flex items-center gap-1.5 transition-all ${
                    aiMode === mode.id
                      ? "bg-black dark:bg-white text-white dark:text-black"
                      : "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800"
                  }`}
                >
                  {mode.icon}
                  <span className="hidden sm:inline">{mode.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500">
            {modes.find(m => m.id === aiMode)?.desc}
          </div>
        </div>

        {/* Main Input */}
        <div
          className={`relative flex items-end gap-2 sm:gap-3 transition-all ${
            dragActive ? "ring-2 ring-blue-500 rounded-3xl" : ""
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="relative flex-1 bg-gray-100 dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm focus-within:border-gray-300 dark:focus-within:border-gray-700 transition-all">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isGenerating ? "AJ is thinking..." : placeholder}
              disabled={disabled || isGenerating}
              className="min-h-[52px] sm:min-h-[56px] max-h-[200px] resize-none bg-transparent border-0 px-4 sm:px-5 py-3.5 sm:py-4 pr-28 sm:pr-32 text-sm sm:text-base placeholder:text-gray-400 dark:placeholder:text-gray-500 focus-visible:ring-0 text-gray-900 dark:text-gray-100"
              rows={1}
            />
            
            {/* Left Controls */}
            <div className="absolute left-3 bottom-3 flex items-center gap-1">
              <Popover open={showAttachMenu} onOpenChange={setShowAttachMenu}>
                <PopoverTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 sm:h-9 sm:w-9 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
                    disabled={disabled || isGenerating}
                  >
                    <Paperclip className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800" side="top" align="start">
                  <div className="space-y-1">
                    <button
                      onClick={() => imageInputRef.current?.click()}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                    >
                      <Image className="h-4 w-4" />
                      <span>Upload Image</span>
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                    >
                      <File className="h-4 w-4" />
                      <span>Upload File</span>
                    </button>
                    <button
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                    >
                      <Code className="h-4 w-4" />
                      <span>Code Snippet</span>
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>

            {/* Character Count */}
            {input.length > 0 && (
              <div className="absolute right-20 sm:right-24 bottom-3 text-xs text-gray-400 dark:text-gray-500">
                {input.length}
              </div>
            )}
          </div>

          {/* Voice/Send Button */}
          <Button
            size="icon"
            className={`h-12 w-12 sm:h-13 sm:w-13 rounded-full flex-shrink-0 transition-all shadow-lg ${
              input.trim() || attachments.length > 0
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white' 
                : isRecording
                ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse'
                : 'bg-gray-900 dark:bg-gray-100 text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200'
            }`}
            onClick={input.trim() || attachments.length > 0 ? handleSend : toggleRecording}
            disabled={disabled && !isRecording}
          >
            {input.trim() || attachments.length > 0 ? (
              <Send className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
            ) : (
              <Mic className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
            )}
          </Button>
        </div>
        
        {/* Recording Indicator */}
        {isRecording && (
          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/10 py-2.5 rounded-2xl border border-red-200 dark:border-red-900/30">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
              <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <span className="font-medium">Recording... Click mic to stop</span>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-2 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
          <div className="hidden sm:flex items-center gap-3">
            <span>Press <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-900 rounded">Enter</kbd> to send</span>
            <span>•</span>
            <span><kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-900 rounded">Shift+Enter</kbd> for new line</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Powered by AJ AI</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
