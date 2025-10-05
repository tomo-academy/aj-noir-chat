import { memo } from "react";
import { User, Sparkles } from "lucide-react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

const ChatMessage = memo(({ role, content }: ChatMessageProps) => {
  const isUser = role === "user";

  const renderContent = () => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(
          <p key={`text-${lastIndex}`} className="whitespace-pre-wrap leading-7">
            {content.substring(lastIndex, match.index)}
          </p>
        );
      }

      const language = match[1] || 'text';
      const code = match[2];
      parts.push(
        <div key={`code-${match.index}`} className="my-4">
          <SyntaxHighlighter
            language={language}
            style={vscDarkPlus}
            customStyle={{
              borderRadius: '0.5rem',
              padding: '1rem',
              fontSize: '0.875rem',
              background: 'hsl(var(--code-bg))',
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      );

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push(
        <p key={`text-${lastIndex}`} className="whitespace-pre-wrap leading-7">
          {content.substring(lastIndex)}
        </p>
      );
    }

    return parts.length > 0 ? parts : <p className="whitespace-pre-wrap leading-7">{content}</p>;
  };

  return (
    <div className="w-full py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {isUser ? (
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="text-[15px] text-foreground">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ChatMessage.displayName = "ChatMessage";

export default ChatMessage;
