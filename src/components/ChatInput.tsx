import { useState, useRef, useEffect, forwardRef } from "react";
import { Mic, Paperclip, Send, Image, X, File, Wind, Bot, Smile, StopCircle, Zap, Sparkles, Plus, MoreHorizontal, Download, Copy, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { AnimatePresence, motion } from "framer-motion";
import EmojiPicker from 'emoji-picker-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

interface ChatInputProps {
  onSendMessage: (message: string, attachments?: File[], mode?: string) => void;
  onStopGeneration?: () => void;
  disabled?: boolean;
  isGenerating?: boolean;
  placeholder?: string;
  aiMode?: "fun" | "regular" | "creative" | "precise";
  onModeChange?: (mode: "fun" | "regular" | "creative" | "precise") => void;
  onClearHistory?: () => void;
  onExportChat?: () => void;
  onCopyChat?: () => void;
  messageCount?: number;
}

const ChatInput = forwardRef<HTMLTextAreaElement, ChatInputProps>((
  {
    onSendMessage,
    onStopGeneration,
    disabled = false,
    isGenerating = false,
    placeholder = "Ask AJ STUDIOZ anything...",
    aiMode = "regular",
    onModeChange,
    onClearHistory,
    onExportChat,
    onCopyChat,
    messageCount = 0
  },
  ref
) => {
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showModeSelector, setShowModeSelector] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [input]);

  // Typing detection
  useEffect(() => {
    if (input.trim()) {
      setIsTyping(true);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 1000);
    } else {
      setIsTyping(false);
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [input]);

  const handleSend = () => {
    if ((input.trim() || attachments.length > 0) && !disabled) {
      onSendMessage(input.trim(), attachments, aiMode);
      setInput("");
      setAttachments([]);
      setShowEmojiPicker(false);
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

  const addEmoji = (emoji: any) => {
    setInput(prev => prev + emoji.emoji);
  };

  const modes = [
    { 
      id: "fun", 
      label: "Fun Mode", 
      icon: <Wind className="h-4 w-4" />, 
      desc: "Get witty and unconventional responses with humor and personality.",
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-500/10",
      borderColor: "border-pink-500/30"
    },
    { 
      id: "regular", 
      label: "Regular Mode", 
      icon: <Bot className="h-4 w-4" />, 
      desc: "Get straightforward and factual answers with balanced responses.",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30"
    },
    { 
      id: "creative", 
      label: "Creative Mode", 
      icon: <Sparkles className="h-4 w-4" />, 
      desc: "Get imaginative and innovative solutions with creative thinking.",
      color: "from-purple-500 to-violet-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30"
    },
    { 
      id: "precise", 
      label: "Precise Mode", 
      icon: <Zap className="h-4 w-4" />, 
      desc: "Get accurate and detailed responses with technical precision.",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30"
    }
  ];

  return (
    <div className="border-t border-gray-800/50 bg-gradient-to-t from-black/98 via-black/95 to-black/90 backdrop-blur-xl sticky bottom-0 z-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Status Bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-xs text-gray-400">AJ STUDIOZ Online</span>
            </div>
            {messageCount > 0 && (
              <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                {messageCount} messages
              </Badge>
            )}
            {isTyping && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1 text-xs text-gray-400"
              >
                <div className="flex gap-1">
                  <motion.div 
                    className="w-1 h-1 bg-blue-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                  />
                  <motion.div 
                    className="w-1 h-1 bg-blue-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                  />
                  <motion.div 
                    className="w-1 h-1 bg-blue-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                  />
                </div>
                <span>Typing...</span>
              </motion.div>
            )}
          </div>
          
          {/* Actions Menu */}
          <div className="flex items-center gap-2">
            <Popover open={showActionsMenu} onOpenChange={setShowActionsMenu}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2 bg-gray-900/95 backdrop-blur-sm border-gray-700" side="top" align="end">
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onClearHistory?.();
                      setShowActionsMenu(false);
                    }}
                    className="w-full justify-start gap-2 text-gray-300 hover:text-white hover:bg-gray-700/50"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Clear History
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onCopyChat?.();
                      setShowActionsMenu(false);
                    }}
                    className="w-full justify-start gap-2 text-gray-300 hover:text-white hover:bg-gray-700/50"
                  >
                    <Copy className="h-4 w-4" />
                    Copy Chat
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onExportChat?.();
                      setShowActionsMenu(false);
                    }}
                    className="w-full justify-start gap-2 text-gray-300 hover:text-white hover:bg-gray-700/50"
                  >
                    <Download className="h-4 w-4" />
                    Export Chat
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <AnimatePresence>
          {attachments.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mb-4"
            >
              <div className="flex gap-3 flex-wrap">
                {attachments.map((file, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="flex items-center gap-3 px-4 py-3 bg-gray-900/80 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors group backdrop-blur-sm"
                  >
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-blue-400">
                      <File className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-200 truncate max-w-[200px]">{file.name}</p>
                      <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeAttachment(index)}
                      className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div
          className={`relative transition-all duration-300 ${dragActive ? "ring-2 ring-blue-500/50 bg-blue-500/5" : ""} rounded-3xl`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {dragActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-2 border-dashed border-blue-500/50 rounded-3xl flex items-center justify-center z-10 backdrop-blur-sm"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  <File className="w-8 h-8 text-blue-400" />
                </div>
                <p className="text-blue-400 font-semibold text-lg">Drop files here</p>
                <p className="text-gray-400 text-sm">Upload images, documents, and more</p>
              </div>
            </motion.div>
          )}

          <div className="relative flex items-end gap-3 bg-gray-900/60 rounded-3xl border border-gray-700/50 hover:border-gray-600/50 focus-within:border-blue-500/50 transition-all duration-300 p-4 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Popover open={showAttachMenu} onOpenChange={setShowAttachMenu}>
                      <PopoverTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-10 w-10 flex-shrink-0 rounded-xl hover:bg-gray-700/50 text-gray-400 hover:text-white transition-all duration-200"
                          disabled={disabled || isGenerating}
                        >
                          <Paperclip className="h-5 w-5" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-3 bg-gray-900/95 backdrop-blur-sm border-gray-700" side="top" align="start">
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-gray-200 mb-2">Attach Files</h4>
                          <button
                            onClick={() => imageInputRef.current?.click()}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm rounded-xl hover:bg-gray-700/50 text-gray-300 hover:text-white transition-all duration-200 group"
                          >
                            <div className="p-2 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 text-green-400 group-hover:from-green-500/30 group-hover:to-emerald-500/30 transition-colors">
                              <Image className="h-4 w-4" />
                            </div>
                            <div className="text-left">
                              <div className="font-medium">Upload Images</div>
                              <div className="text-xs text-gray-400">JPG, PNG, GIF, WebP</div>
                            </div>
                          </button>
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm rounded-xl hover:bg-gray-700/50 text-gray-300 hover:text-white transition-all duration-200 group"
                          >
                            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-blue-400 group-hover:from-blue-500/30 group-hover:to-cyan-500/30 transition-colors">
                              <File className="h-4 w-4" />
                            </div>
                            <div className="text-left">
                              <div className="font-medium">Upload Documents</div>
                              <div className="text-xs text-gray-400">PDF, DOC, TXT, etc.</div>
                            </div>
                          </button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-gray-800 border-gray-700">Attach files</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-10 w-10 flex-shrink-0 rounded-xl hover:bg-gray-700/50 text-gray-400 hover:text-white transition-all duration-200"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      disabled={disabled || isGenerating}
                    >
                      <Smile className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-gray-800 border-gray-700">Add emoji</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <Textarea
              ref={(el) => {
                textareaRef.current = el;
                if (ref) {
                  if (typeof ref === 'function') {
                    ref(el);
                  } else {
                    ref.current = el;
                  }
                }
              }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isGenerating ? "AJ STUDIOZ is thinking..." : "Ask AJ STUDIOZ anything..."}
              disabled={disabled || isGenerating}
              className="flex-1 max-h-[160px] resize-none bg-transparent border-0 p-0 pr-16 text-base placeholder:text-gray-400 focus-visible:ring-0 text-white leading-relaxed"
              rows={1}
            />

            <div className="flex items-center gap-2 ml-3">
              {isGenerating ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        className="h-10 w-10 rounded-xl flex-shrink-0 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white transition-all duration-200 shadow-lg"
                        onClick={onStopGeneration}
                      >
                        <StopCircle className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="bg-gray-800 border-gray-700">Stop generation</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <>
                  {/* Voice Recording Button */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className={`h-10 w-10 rounded-xl flex-shrink-0 transition-all duration-200 ${
                            isRecording
                              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 animate-pulse'
                              : 'hover:bg-gray-700/50 text-gray-400 hover:text-white'
                          }`}
                          onClick={toggleRecording}
                          disabled={disabled}
                        >
                          <Mic className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-gray-800 border-gray-700">
                        {isRecording ? "Stop recording" : "Voice input"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* Send Button */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          className={`h-10 w-10 rounded-xl flex-shrink-0 transition-all duration-200 shadow-lg ${
                            input.trim() || attachments.length > 0
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white scale-105 hover:scale-110'
                              : 'bg-gray-700 text-gray-400 hover:bg-gray-600 cursor-not-allowed'
                          }`}
                          onClick={handleSend}
                          disabled={disabled || (!input.trim() && attachments.length === 0)}
                        >
                          <Send className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-gray-800 border-gray-700">
                        Send message (Enter)
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </>
              )}
            </div>

            <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileSelect} />
            <input ref={imageInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileSelect} />
          </div>
        </div>

        <AnimatePresence>
          {showEmojiPicker && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute bottom-full left-4 z-50 mb-2"
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-700 bg-gray-900/95 backdrop-blur-sm">
                <EmojiPicker onEmojiClick={addEmoji} theme="dark" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mode Selector */}
        <div className="mt-4 flex items-center justify-center">
          <div className="flex items-center gap-2 rounded-2xl bg-gray-900/60 border border-gray-700/50 p-1.5 backdrop-blur-sm">
            {modes.map((mode) => (
              <TooltipProvider key={mode.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button
                      onClick={() => onModeChange?.(mode.id as any)}
                      className={`px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium transition-all duration-200 ${
                        aiMode === mode.id
                          ? `${mode.bgColor} text-white border ${mode.borderColor} shadow-lg`
                          : "text-gray-400 hover:bg-gray-700/50 hover:text-white"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className={aiMode === mode.id ? "text-white" : "text-gray-500"}>
                        {mode.icon}
                      </span>
                      <span className="hidden sm:inline">{mode.label}</span>
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-gray-800 border-gray-700 max-w-xs">
                    <div className="text-center">
                      <div className="font-semibold text-white mb-1">{mode.label}</div>
                      <div className="text-xs text-gray-300">{mode.desc}</div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

ChatInput.displayName = "ChatInput";

export default ChatInput;
