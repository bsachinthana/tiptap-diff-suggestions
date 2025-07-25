import type { Command } from '@tiptap/core';

export interface DiffSuggestionMeta {
  id: string;
  comment?: string;
  accepted: boolean;
  originalText: string;
  suggestedText: string;
  pos?: number; // Position in document for advanced use cases
}

export interface DiffSuggestionActionMeta {
  id: string;
  comment?: string;
  originalText: string;
  suggestedText: string;
  pos: number;
  accepted?: boolean;
}

export interface DiffSuggestionTheme {
  /**
   * CSS variables for theming
   */
  variables?: {
    acceptBg?: string;
    rejectBg?: string;
    borderColor?: string;
    acceptColor?: string;
    rejectColor?: string;
    hoverBg?: string;
  };
}

export interface DiffSuggestionButtonConfig {
  /**
   * Button content - can be text, unicode, HTML, etc.
   */
  content: string;
  /**
   * Button title/tooltip
   */
  title?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Inline styles
   */
  style?: Record<string, string>;
}

export interface DiffSuggestionOptions {
  HTMLAttributes: Record<string, any>;
  /**
   * Custom CSS class for the diff suggestion wrapper
   */
  className?: string;
  /**
   * Whether to show accept/reject buttons by default
   */
  showButtons?: boolean;
  /**
   * Button configuration - can be simple strings or detailed config
   */
  buttons?: {
    accept?: string | DiffSuggestionButtonConfig;
    reject?: string | DiffSuggestionButtonConfig;
  };
 
  /**
   * Custom action menu renderer - full control over toolbar UI
   * @param meta - Suggestion metadata with position info
   * @returns HTMLElement to be inserted as the action toolbar
   */
  renderActionMenu?: (meta: DiffSuggestionActionMeta) => HTMLElement;
  /**
   * Theme configuration
   */
  theme?: DiffSuggestionTheme;
  /**
   * Side-effect callback when a suggestion is accepted
   */
  onAccept?: (meta: DiffSuggestionMeta) => void;
  /**
   * Side-effect callback when a suggestion is rejected
   */
  onReject?: (meta: DiffSuggestionMeta) => void;
  /**
   * Full override for accept behavior
   */
  handleAccept?: Command;
  /**
   * Full override for reject behavior
   */
  handleReject?: Command;
}

export interface DiffSuggestionAttributes {
  id: string;
  comment?: string;
  originalText: string;
  suggestedText: string;
}
