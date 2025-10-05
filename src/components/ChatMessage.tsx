import { memo, useState } from "react";
import { User, Sparkles, Copy, Check, ThumbsUp, ThumbsDown, RefreshCw } from "lucide-react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  messageId?: string;
  onCopy?: () => void;
  onRefresh?: () => void;
  onThumbsUp?: () => void;
  onThumbsDown?: () => void;
}

const ChatMessage = memo(({ 
  role, 
  content, 
  messageId,
  onCopy,
  onRefresh,
  onThumbsUp,
  onThumbsDown 
}: ChatMessageProps) => {
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  // Custom components for markdown rendering
  const components = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      
      return !inline && language ? (
        <div className="relative group my-4 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between bg-muted px-4 py-2 text-xs text-muted-foreground">
            <span>{language}</span>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleCopyCode(String(children).replace(/\n$/, ''))}
            >
              {codeCopied === String(children).replace(/\n$/, '') ? (
                <Check className="h-3 w-3" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
          <SyntaxHighlighter
            language={language}
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              borderRadius: '0',
              padding: '1rem',
              fontSize: '0.875rem',
              background: 'hsl(var(--muted-foreground/0.1))',
            }}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code className="bg-muted/50 px-1 py-0.5 rounded text-sm font-mono" {...props}>
          {children}
        </code>
      );
    },
    pre({ children }: any) {
      return <div className="overflow-x-auto">{children}</div>;
    },
    table({ children }: any) {
      return (
        <div className="overflow-x-auto my-4">
          <table className="min-w-full border-collapse border border-border rounded-lg">
            {children}
          </table>
        </div>
      );
    },
    th({ children }: any) {
      return (
        <th className="border border-border bg-muted px-4 py-2 text-left font-medium">
          {children}
        </th>
      );
    },
    td({ children }: any) {
      return (
        <td className="border border-border px-4 py-2">
          {children}
        </td>
      );
    },
    blockquote({ children }: any) {
      return (
        <blockquote className="border-l-2 border-border pl-4 italic my-4 text-muted-foreground">
          {children}
        </blockquote>
      );
    },
    a({ children, href }: any) {
      return (
        <a 
          href={href} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          {children}
        </a>
      );
    },
  };

  return (
    <div className={`w-full py-6 px-4 ${isUser ? 'bg-background' : 'bg-muted/20'}`}>
      <div className="max-w-3xl mx-auto">
        <div className="flex gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {isUser ? (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <User className="w-5 h-5 text-primary-foreground" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div className="text-[15px] text-foreground prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight, rehypeRaw]}
                  components={components}
                >
                  {content}
                </ReactMarkdown>
              </div>
              
              {/* Message actions */}
              {!isUser && (
                <div className="flex gap-1 ml-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 rounded-full opacity-70 hover:opacity-100"
                          onClick={handleCopy}
                        >
                          {copied ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">Copy</TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 rounded-full opacity-70 hover:opacity-100"
                          onClick={handleRefresh}
                          disabled={isRefreshing}
                        >
                          {isRefreshing ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                          ) : (
                            <RefreshCw className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">Regenerate</TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 rounded-full opacity-70 hover:opacity-100"
                          onClick={onThumbsUp}
                        >
                          <ThumbsUp className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">Good response</TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 rounded-full opacity-70 hover:opacity-100"
                          onClick={onThumbsDown}
                        >
                          <ThumbsDown className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">Bad response</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ChatMessage.displayName = "ChatMessage";

export default ChatMessage;
