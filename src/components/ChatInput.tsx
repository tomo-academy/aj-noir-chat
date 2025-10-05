import { useState, useRef, useEffect, forwardRef } from "react";
import { Mic, Paperclip, Send, Image, X, File, Wind, Bot, Smile, StopCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { AnimatePresence, motion } from "framer-motion";
import EmojiPicker from 'emoji-picker-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface ChatInputProps {
  onSendMessage: (message: string, attachments?: File[], mode?: string) => void;
  onStopGeneration?: () => void;
  disabled?: boolean;
  isGenerating?: boolean;
  placeholder?: string;
  aiMode?: "fun" | "regular";
  onModeChange?: (mode: "fun" | "regular") => void;
}

const ChatInput = forwardRef<HTMLTextAreaElement, ChatInputProps>((
  {
    onSendMessage,
    onStopGeneration,
    disabled = false,
    isGenerating = false,
    placeholder = "Ask Grok anything...",
    aiMode = "regular",
    onModeChange
  },
  ref
) => {
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

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
    { id: "fun", label: "Fun Mode", icon: <Wind className="h-4 w-4" />, desc: "Get witty and unconventional responses." },
    { id: "regular", label: "Regular Mode", icon: <Bot className="h-4 w-4" />, desc: "Get straightforward and factual answers." }
  ];

  return (
    <div className="border-t border-gray-800 bg-black/95 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-4 py-4">
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
                    className="flex items-center gap-3 px-4 py-3 bg-gray-900/80 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors group"
                  >
                    <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
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
          className={`relative transition-all duration-300 ${dragActive ? "ring-2 ring-blue-500/50 bg-blue-500/5" : ""} rounded-2xl`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {dragActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-blue-500/10 border-2 border-dashed border-blue-500/50 rounded-2xl flex items-center justify-center z-10"
            >
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <File className="w-6 h-6 text-blue-400" />
                </div>
                <p className="text-blue-400 font-medium">Drop files here</p>
                <p className="text-gray-400 text-sm">Upload images, documents, and more</p>
              </div>
            </motion.div>
          )}

          <div className="relative flex items-end gap-3 bg-gray-900/50 rounded-2xl border border-gray-800 hover:border-gray-700 focus-within:border-blue-500/50 transition-all duration-200 p-3 backdrop-blur-sm">
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
                      <PopoverContent className="w-56 p-2 bg-gray-900/95 backdrop-blur-sm border-gray-700" side="top" align="start">
                        <div className="space-y-1">
                          <button
                            onClick={() => imageInputRef.current?.click()}
                            className="w-full flex items-center gap-3 px-3 py-3 text-sm rounded-xl hover:bg-gray-700/50 text-gray-300 hover:text-white transition-all duration-200 group"
                          >
                            <div className="p-1.5 rounded-lg bg-green-500/20 text-green-400 group-hover:bg-green-500/30 transition-colors">
                              <Image className="h-4 w-4" />
                            </div>
                            <span>Upload Images</span>
                          </button>
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full flex items-center gap-3 px-3 py-3 text-sm rounded-xl hover:bg-gray-700/50 text-gray-300 hover:text-white transition-all duration-200 group"
                          >
                            <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 group-hover:bg-blue-500/30 transition-colors">
                              <File className="h-4 w-4" />
                            </div>
                            <span>Upload Documents</span>
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
              placeholder={isGenerating ? "Grok is thinking..." : "Ask Grok anything..."}
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
                        className="h-10 w-10 rounded-xl flex-shrink-0 bg-red-500/90 hover:bg-red-500 text-white transition-all duration-200 shadow-lg"
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
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white scale-105'
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

        <div className="mt-4 flex items-center justify-center">
          <div className="flex items-center gap-2 rounded-2xl bg-gray-900/50 border border-gray-800 p-1.5 backdrop-blur-sm">
            {modes.map((mode) => (
              <TooltipProvider key={mode.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button
                      onClick={() => onModeChange?.(mode.id as any)}
                      className={`px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium transition-all duration-200 ${
                        aiMode === mode.id
                          ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border border-blue-500/30"
                          : "text-gray-400 hover:bg-gray-700/50 hover:text-white"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className={aiMode === mode.id ? "text-blue-400" : "text-gray-500"}>
                        {mode.icon}
                      </span>
                      <span className="hidden sm:inline">{mode.label}</span>
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-gray-800 border-gray-700">
                    {mode.desc}
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
