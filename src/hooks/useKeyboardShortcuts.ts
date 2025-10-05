import { useEffect } from 'react';

interface KeyboardShortcuts {
  onNewChat?: () => void;
  onToggleSidebar?: () => void;
  onFocusInput?: () => void;
  onClearChat?: () => void;
  onOpenSettings?: () => void;
  onToggleTheme?: () => void;
  onSearch?: () => void;
  onEscape?: () => void;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcuts) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key, ctrlKey, metaKey, shiftKey, altKey } = event;
      const isCmd = ctrlKey || metaKey;

      // Don't trigger shortcuts when typing in inputs
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        // Only allow Escape to work in inputs
        if (key === 'Escape' && shortcuts.onEscape) {
          shortcuts.onEscape();
          return;
        }
        return;
      }

      // Prevent default for our shortcuts
      const preventDefault = () => {
        event.preventDefault();
        event.stopPropagation();
      };

      switch (true) {
        // Cmd/Ctrl + N: New Chat
        case isCmd && key === 'n' && !shiftKey:
          if (shortcuts.onNewChat) {
            preventDefault();
            shortcuts.onNewChat();
          }
          break;

        // Cmd/Ctrl + B: Toggle Sidebar
        case isCmd && key === 'b' && !shiftKey:
          if (shortcuts.onToggleSidebar) {
            preventDefault();
            shortcuts.onToggleSidebar();
          }
          break;

        // Cmd/Ctrl + K: Focus Input
        case isCmd && key === 'k' && !shiftKey:
          if (shortcuts.onFocusInput) {
            preventDefault();
            shortcuts.onFocusInput();
          }
          break;

        // Cmd/Ctrl + Shift + K: Clear Chat
        case isCmd && key === 'k' && shiftKey:
          if (shortcuts.onClearChat) {
            preventDefault();
            shortcuts.onClearChat();
          }
          break;

        // Cmd/Ctrl + ,: Open Settings
        case isCmd && key === ',':
          if (shortcuts.onOpenSettings) {
            preventDefault();
            shortcuts.onOpenSettings();
          }
          break;

        // Cmd/Ctrl + D: Toggle Theme
        case isCmd && key === 'd' && !shiftKey:
          if (shortcuts.onToggleTheme) {
            preventDefault();
            shortcuts.onToggleTheme();
          }
          break;

        // Cmd/Ctrl + F: Search
        case isCmd && key === 'f' && !shiftKey:
          if (shortcuts.onSearch) {
            preventDefault();
            shortcuts.onSearch();
          }
          break;

        // Forward slash: Quick search
        case key === '/' && !isCmd && !shiftKey && !altKey:
          if (shortcuts.onSearch) {
            preventDefault();
            shortcuts.onSearch();
          }
          break;

        // Escape: General escape action
        case key === 'Escape':
          if (shortcuts.onEscape) {
            preventDefault();
            shortcuts.onEscape();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);

  // Return list of available shortcuts for display
  return {
    shortcuts: [
      { key: 'Ctrl+N', action: 'New Chat', available: !!shortcuts.onNewChat },
      { key: 'Ctrl+B', action: 'Toggle Sidebar', available: !!shortcuts.onToggleSidebar },
      { key: 'Ctrl+K', action: 'Focus Input', available: !!shortcuts.onFocusInput },
      { key: 'Ctrl+Shift+K', action: 'Clear Chat', available: !!shortcuts.onClearChat },
      { key: 'Ctrl+,', action: 'Settings', available: !!shortcuts.onOpenSettings },
      { key: 'Ctrl+D', action: 'Toggle Theme', available: !!shortcuts.onToggleTheme },
      { key: 'Ctrl+F', action: 'Search', available: !!shortcuts.onSearch },
      { key: '/', action: 'Quick Search', available: !!shortcuts.onSearch },
      { key: 'Escape', action: 'Close/Cancel', available: !!shortcuts.onEscape },
    ].filter(shortcut => shortcut.available)
  };
};