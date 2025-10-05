import { useState, useRef, useEffect } from "react";
import { Mic, Paperclip, Send, Image, X, File, Wind, Bot } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface ChatInputProps {
  onSendMessage: (message: string, attachments?: File[], mode?: string) => void;
  onStopGeneration?: () => void;
  disabled?: boolean;
  isGenerating?: boolean;
  placeholder?: string;
  aiMode?: "fun" | "regular";
  onModeChange?: (mode: "fun" | "regular") => void;
}

const ChatInput = ({
  onSendMessage,
  onStopGeneration,
  disabled = false,
  isGenerating = false,
  placeholder = "Ask Grok anything...",
  aiMode = "regular",
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
    // Add voice recording logic here
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
    { id: "fun", label: "Fun Mode", icon: <Wind className="h-4 w-4" />, desc: "Get witty and unconventional responses." },
    { id: "regular", label: "Regular Mode", icon: <Bot className="h-4 w-4" />, desc: "Get straightforward and factual answers." }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black z-50">
      <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4">

        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <div className="px-2 py-2 mb-2">
            <div className="flex gap-2 flex-wrap">
              {attachments.map((file, index) => (
                <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 rounded-lg border border-gray-800">
                  <File className="h-4 w-4 text-gray-400" />
                  <span className="text-xs text-gray-300 max-w-[150px] truncate">{file.name}</span>
                  <button
                    onClick={() => removeAttachment(index)}
                    className="text-gray-500 hover:text-gray-300"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Input Area */}
        <div
          className={`relative transition-all ${dragActive ? "ring-2 ring-blue-500 rounded-2xl" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="relative flex items-end gap-2 sm:gap-3 bg-gray-900 rounded-2xl border border-gray-800 focus-within:border-gray-700 transition-all p-2">
            
            {/* Left Controls - Attachment */}
            <Popover open={showAttachMenu} onOpenChange={setShowAttachMenu}>
              <PopoverTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 flex-shrink-0 rounded-full hover:bg-gray-800 text-gray-400"
                  disabled={disabled || isGenerating}
                >
                  <Paperclip className="h-4.5 w-4.5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2 bg-gray-900 border-gray-800" side="top" align="start">
                <div className="space-y-1">
                  <button
                    onClick={() => imageInputRef.current?.click()}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-gray-800 text-gray-300"
                  >
                    <Image className="h-4 w-4" />
                    <span>Upload Image</span>
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-gray-800 text-gray-300"
                  >
                    <File className="h-4 w-4" />
                    <span>Upload File</span>
                  </button>
                </div>
              </PopoverContent>
            </Popover>

            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isGenerating ? "Grok is thinking..." : placeholder}
              disabled={disabled || isGenerating}
              className="flex-1 max-h-[200px] resize-none bg-transparent border-0 p-0 pr-20 text-base placeholder:text-gray-500 focus-visible:ring-0 text-gray-100"
              rows={1}
            />

            {/* Right Controls - Send/Mic Button */}
            <div className="absolute right-2 bottom-2 flex items-center gap-2">
              <Button
                size="icon"
                className={`h-9 w-9 rounded-full flex-shrink-0 transition-all shadow-lg ${
                  input.trim() || attachments.length > 0
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : isRecording
                    ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse'
                    : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
                }`}
                onClick={input.trim() || attachments.length > 0 ? handleSend : toggleRecording}
                disabled={disabled && !isRecording}
              >
                {input.trim() || attachments.length > 0 ? (
                  <Send className="h-4.5 w-4.5" />
                ) : (
                  <Mic className="h-4.5 w-4.5" />
                )}
              </Button>
            </div>

            <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileSelect} />
            <input ref={imageInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileSelect} />
          </div>
        </div>

        {/* AI Mode Selector and Footer */}
        <div className="mt-2 flex items-center justify-center text-xs text-gray-500">
           <div className="flex items-center gap-1 rounded-full bg-gray-900 border border-gray-800 p-1">
             {modes.map((mode) => (
               <button
                 key={mode.id}
                 onClick={() => onModeChange?.(mode.id as any)}
                 className={`px-3 py-1 rounded-full flex items-center gap-1.5 transition-all ${
                   aiMode === mode.id
                     ? "bg-gray-700 text-white"
                     : "text-gray-400 hover:bg-gray-800"
                 }`}
               >
                 {mode.icon}
                 <span className="hidden sm:inline">{mode.label}</span>
               </button>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
