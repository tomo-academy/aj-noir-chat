import { memo, useState } from "react";
import { User, Sparkles, Copy, Check, ThumbsUp, ThumbsDown, RefreshCw, Share2, Bookmark, MoreHorizontal, Edit3, Flag, Heart, Zap } from "lucide-react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "./ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import LazyImage from './LazyImage';
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  messageId?: string;
  onCopy?: () => void;
  onRefresh?: () => void;
  onThumbsUp?: () => void;
  onThumbsDown?: () => void;
  onShare?: (content: string) => void;
  onBookmark?: () => void;
}

const ChatMessage = memo(({ 
  role, 
  content, 
  messageId,
  onCopy,
  onRefresh,
  onThumbsUp,
  onThumbsDown,
  onShare,
  onBookmark
}: ChatMessageProps) => {
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    if (onCopy) onCopy();
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCodeCopied(code);
    setTimeout(() => setCodeCopied(null), 2000);
  };

  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      await onRefresh();
      setIsRefreshing(false);
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    if (onBookmark) onBookmark();
  };

  const handleShare = () => {
    if (onShare) onShare(content);
  };

  const components = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      
      return !inline && language ? (
        <div className="relative group my-6 rounded-2xl overflow-hidden border border-code-border bg-code-bg/80 backdrop-blur-sm shadow-2xl">
          {/* Enhanced Code Header */}
          <div className="flex items-center justify-between bg-code-header/90 px-4 py-3 border-b border-code-border backdrop-blur-md">
            <div className="flex items-center gap-3">
              {/* macOS-style traffic lights with enhanced styling */}
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive/80 ring-1 ring-destructive/30 shadow-sm"></div>
                <div className="w-3 h-3 rounded-full bg-warning/80 ring-1 ring-warning/30 shadow-sm"></div>
                <div className="w-3 h-3 rounded-full bg-success/80 ring-1 ring-success/30 shadow-sm"></div>
              </div>
              <div className="h-4 w-px bg-border-strong/50"></div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-accent/30 flex items-center justify-center">
                  <span className="text-2xs font-mono font-bold text-foreground-muted uppercase">
                    {language.charAt(0)}
                  </span>
                </div>
                <span className="text-sm font-semibold text-foreground-dim capitalize tracking-wide">
                  {language}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="h-8 px-3 text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-accent-hover/50 rounded-xl border border-transparent hover:border-border-strong/30 text-foreground-muted hover:text-foreground"
                onClick={() => handleCopyCode(String(children).replace(/\n$/, ''))}
              >
                {codeCopied === String(children).replace(/\n$/, '') ? (
                  <motion.div 
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-1"
                  >
                    <Check className="h-3 w-3 text-success" />
                    <span className="text-success font-medium">Copied!</span>
                  </motion.div>
                ) : (
                  <div className="flex items-center gap-1">
                    <Copy className="h-3 w-3" />
                    <span className="font-medium">Copy</span>
                  </div>
                )}
              </Button>
            </div>
          </div>
          {/* Enhanced Code Content */}
          <div className="relative bg-gradient-to-br from-code-bg to-code-bg/95">
            {/* Subtle grid pattern overlay */}
            <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.3)_1px,_transparent_0)] bg-[size:20px_20px]"></div>
            <SyntaxHighlighter
              language={language}
              style={{
                ...vscDarkPlus,
                'pre[class*="language-"]': {
                  ...vscDarkPlus['pre[class*="language-"]'],
                  background: 'transparent',
                },
                'code[class*="language-"]': {
                  ...vscDarkPlus['code[class*="language-"]'],
                  background: 'transparent',
                },
              }}
              customStyle={{
                margin: 0,
                borderRadius: '0',
                padding: '1.5rem',
                fontSize: '0.875rem',
                background: 'transparent',
                lineHeight: '1.7',
                fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace',
                fontWeight: '500',
              }}
              showLineNumbers
              lineNumberStyle={{
                minWidth: '3.5em',
                paddingRight: '1.5em',
                color: 'hsl(var(--foreground-muted))',
                fontSize: '0.75rem',
                fontWeight: '400',
                userSelect: 'none',
                borderRight: '1px solid hsl(var(--border))',
                marginRight: '1em',
              }}
              wrapLines
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
            {/* Bottom gradient fade */}
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-code-bg/50 to-transparent pointer-events-none"></div>
          </div>
        </div>
      ) : (
        <code className="bg-accent/30 text-primary border border-border-strong/40 px-2 py-1 rounded-lg text-sm font-mono font-medium shadow-sm" {...props}>
          {children}
        </code>
      );
    },
    pre({ children }: any) {
      return <div className="overflow-x-auto">{children}</div>;
    },
    table({ children }: any) {
      return (
        <div className="overflow-x-auto my-6 rounded-xl border border-border shadow-lg">
          <table className="min-w-full border-collapse bg-background-alt/50 backdrop-blur-sm">
            {children}
          </table>
        </div>
      );
    },
    th({ children }: any) {
      return (
        <th className="border-b border-border-strong bg-background-elevated/80 px-6 py-4 text-left font-bold text-foreground text-sm uppercase tracking-wide">
          {children}
        </th>
      );
    },
    td({ children }: any) {
      return (
        <td className="border-b border-border px-6 py-4 text-foreground-dim">
          {children}
        </td>
      );
    },
    blockquote({ children }: any) {
      return (
        <blockquote className="border-l-4 border-primary/60 bg-accent/20 pl-6 py-5 italic my-6 text-foreground-dim rounded-r-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent"></div>
          <div className="relative flex items-start gap-3">
            <div className="w-1 h-6 bg-primary rounded-full mt-1 flex-shrink-0 shadow-sm"></div>
            <div className="font-medium">{children}</div>
          </div>
        </blockquote>
      );
    },
    a({ children, href }: any) {
      return (
        <a 
          href={href} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:text-foreground underline decoration-primary/60 hover:decoration-primary transition-all duration-200 font-medium hover:bg-accent/20 px-1 -mx-1 py-0.5 rounded"
        >
          {children}
        </a>
      );
    },
    img({ src, alt }: any) {
      return (
        <LazyImage src={src} alt={alt} className="max-w-full rounded-lg my-4" />
      );
    },
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`w-full py-6 px-4 relative group transition-all duration-200 ${
        isUser 
          ? 'hover:bg-background-alt/30' 
          : 'bg-background-alt/50 border-b border-border/30 hover:bg-background-alt/70'
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-6">
          <div className="flex-shrink-0">
            {isUser ? (
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-2xl bg-gradient-to-br from-foreground/10 to-foreground/20 border border-border-strong/50 flex items-center justify-center shadow-lg backdrop-blur-sm"
              >
                <User className="w-5 h-5 text-foreground-dim" />
              </motion.div>
            ) : (
              <motion.div 
                whileHover={{ scale: 1.05, rotate: -5 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/95 to-foreground border border-border-strong/30 flex items-center justify-center shadow-xl backdrop-blur-sm relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-foreground/5 to-foreground/10" />
                <Zap className="w-5 h-5 text-background relative z-10" />
              </motion.div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="relative">
              {/* Username/Role label */}
              <div className="mb-3 flex items-center gap-2">
                <span className={`text-sm font-bold tracking-wide ${
                  isUser ? 'text-foreground-dim' : 'text-primary'
                }`}>
                  {isUser ? 'You' : 'AJ STUDIOZ'}
                </span>
                {!isUser && (
                  <span className="text-2xs text-foreground-muted bg-accent/30 border border-border/50 px-2 py-1 rounded-lg font-medium uppercase tracking-wider">
                    AI Assistant
                  </span>
                )}
                <div className={`w-2 h-2 rounded-full ${
                  isUser ? 'bg-foreground-muted/50' : 'bg-success/80 animate-pulse-slow'
                }`} />
              </div>

              {/* Message content */}
              <div className={`text-[15px] prose prose-sm dark:prose-invert max-w-none leading-relaxed font-medium ${
                isUser ? 'text-foreground-dim' : 'text-foreground'
              }`}>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight, rehypeRaw]}
                  components={components}
                >
                  {content}
                </ReactMarkdown>
              </div>
              
              {/* Action buttons */}
              <AnimatePresence>
                {!isUser && showActions && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-1 mt-4"
                  >
                    {/* Primary actions */}
                    <div className="flex items-center gap-1 bg-gray-800/50 backdrop-blur-sm rounded-xl p-1 border border-gray-700">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 rounded-lg hover:bg-gray-700/50 text-gray-400 hover:text-white transition-all duration-200"
                              onClick={handleCopy}
                            >
                              {copied ? (
                                <Check className="h-4 w-4 text-green-400" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="bg-gray-800 border-gray-700">Copy message</TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className={`h-8 w-8 rounded-lg transition-all duration-200 ${
                                isLiked 
                                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                                  : 'hover:bg-gray-700/50 text-gray-400 hover:text-red-400'
                              }`}
                              onClick={() => setIsLiked(!isLiked)}
                            >
                              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="bg-gray-800 border-gray-700">
                            {isLiked ? 'Unlike' : 'Like message'}
                          </TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 rounded-lg hover:bg-gray-700/50 text-gray-400 hover:text-blue-400 transition-all duration-200"
                              onClick={handleRefresh}
                              disabled={isRefreshing}
                            >
                              {isRefreshing ? (
                                <motion.div 
                                  className="h-4 w-4 animate-spin rounded-full border-2 border-blue-400 border-t-transparent"
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                />
                              ) : (
                                <RefreshCw className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="bg-gray-800 border-gray-700">Regenerate response</TooltipContent>
                        </Tooltip>
                    
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className={`h-8 w-8 rounded-lg transition-all duration-200 ${
                                isBookmarked 
                                  ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' 
                                  : 'hover:bg-gray-700/50 text-gray-400 hover:text-yellow-400'
                              }`}
                              onClick={handleBookmark}
                            >
                              <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="bg-gray-800 border-gray-700">
                            {isBookmarked ? 'Remove bookmark' : 'Bookmark message'}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    {/* More actions dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 rounded-lg hover:bg-gray-700/50 text-gray-400 hover:text-white transition-all duration-200 ml-1"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent 
                        align="start" 
                        className="w-48 bg-gray-900/95 backdrop-blur-sm border-gray-700"
                      >
                        <DropdownMenuItem 
                          onClick={() => setIsEditing(true)}
                          className="gap-3 hover:bg-gray-700/50 focus:bg-gray-700/50"
                        >
                          <Edit3 className="h-4 w-4" />
                          <span>Edit message</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={onThumbsUp}
                          className="gap-3 hover:bg-gray-700/50 focus:bg-gray-700/50 text-green-400"
                        >
                          <ThumbsUp className="h-4 w-4" />
                          <span>Good response</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={onThumbsDown}
                          className="gap-3 hover:bg-gray-700/50 focus:bg-gray-700/50 text-red-400"
                        >
                          <ThumbsDown className="h-4 w-4" />
                          <span>Poor response</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gray-700" />
                        <DropdownMenuItem 
                          onClick={handleShare}
                          className="gap-3 hover:bg-gray-700/50 focus:bg-gray-700/50"
                        >
                          <Share2 className="h-4 w-4" />
                          <span>Share message</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="gap-3 hover:bg-gray-700/50 focus:bg-gray-700/50 text-red-400"
                        >
                          <Flag className="h-4 w-4" />
                          <span>Report issue</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

ChatMessage.displayName = "ChatMessage";

export default ChatMessage;
