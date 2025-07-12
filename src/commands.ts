import type { Command } from '@tiptap/core';
import type { DiffSuggestionAttributes, DiffSuggestionMeta } from './types';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    diffSuggestion: {
      /**
       * Insert a diff suggestion at the current position
       */
      insertDiffSuggestion: (options: DiffSuggestionAttributes) => ReturnType;
      /**
       * Accept a specific diff suggestion
       */
      acceptDiffSuggestion: (id?: string) => ReturnType;
      /**
       * Reject a specific diff suggestion
       */
      rejectDiffSuggestion: (id?: string) => ReturnType;
      /**
       * Accept all diff suggestions in the document
       */
      acceptAllDiffSuggestions: () => ReturnType;
      /**
       * Reject all diff suggestions in the document
       */
      rejectAllDiffSuggestions: () => ReturnType;
    };
  }
}

/**
 * Get the suggestion element from current selection or by ID
 */
const getSuggestionElement = (state: any, id?: string): Element | null => {
  if (id) {
    // Find by ID in the document
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = state.doc.textContent || '';
    return tempDiv.querySelector(`[data-diff-suggestion-id="${id}"]`);
  }
  
  // Get from current selection (simplified approach)
  const { selection } = state;
  const { $from } = selection;
  const node = $from.node();
  
  if (node?.type?.name === 'diffSuggestion') {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = node.textContent || '';
    return tempDiv.querySelector('[data-diff-suggestion]');
  }
  
  return null;
};

/**
 * Default suggestion handler
 */
export const defaultHandleSuggestion = (
  action: 'accept' | 'reject',
  onAction?: (meta: DiffSuggestionMeta) => void
): Command => ({ state, dispatch }) => {
  const { selection } = state;
  const suggestionElement = getSuggestionElement(state);
  
  if (!suggestionElement) return false;
  
  const newSpan = suggestionElement.querySelector('[data-diff-suggestion-new]');
  const oldSpan = suggestionElement.querySelector('[data-diff-suggestion-old]');
  
  const content = action === 'accept' 
    ? newSpan?.textContent || ''
    : oldSpan?.textContent || '';
    
  const meta: DiffSuggestionMeta = {
    id: suggestionElement.getAttribute('data-diff-suggestion-id') || '',
    comment: suggestionElement.getAttribute('data-diff-suggestion-comment') || undefined,
    accepted: action === 'accept',
    originalText: oldSpan?.textContent || '',
    suggestedText: newSpan?.textContent || '',
  };
  
  if (content && dispatch) {
    const tr = state.tr;
    const { from, to } = selection;
    tr.insertText(content, from, to);
    dispatch(tr);
    onAction?.(meta);
    return true;
  }
  
  return false;
};

export const commands = {
  insertDiffSuggestion:
    (options: DiffSuggestionAttributes): Command =>
    ({ commands }) => {
      return commands.insertContent({
        type: 'diffSuggestion',
        attrs: options,
      });
    },

  acceptDiffSuggestion:
    (id?: string): Command =>
    (props) => {
      // This will be bound to the extension instance
      const extension = (props as any).editor?.extensionManager?.extensions?.find(
        (ext: any) => ext.name === 'diffSuggestion'
      );
      
      const { handleAccept, onAccept } = extension?.options || {};
      
      return handleAccept
        ? handleAccept(props)
        : defaultHandleSuggestion('accept', onAccept)(props);
    },

  rejectDiffSuggestion:
    (id?: string): Command =>
    (props) => {
      // This will be bound to the extension instance
      const extension = (props as any).editor?.extensionManager?.extensions?.find(
        (ext: any) => ext.name === 'diffSuggestion'
      );
      
      const { handleReject, onReject } = extension?.options || {};
      
      return handleReject
        ? handleReject(props)
        : defaultHandleSuggestion('reject', onReject)(props);
    },

  acceptAllDiffSuggestions:
    (): Command =>
    ({ state, dispatch }) => {
      if (!dispatch) return false;

      const { tr } = state;
      let modified = false;

      state.doc.descendants((node: any, pos: number) => {
        if (node.type.name === 'diffSuggestion') {
          // Simply access the node attributes - much cleaner!
          const suggestedText = node.attrs.suggestedText || '';
          
          if (suggestedText) {
            tr.replaceWith(
              pos,
              pos + node.nodeSize,
              state.schema.text(suggestedText)
            );
            modified = true;
          }
        }
      });

      if (modified) {
        dispatch(tr);
        return true;
      }

      return false;
    },

  rejectAllDiffSuggestions:
    (): Command =>
    ({ state, dispatch }) => {
      if (!dispatch) return false;

      const { tr } = state;
      let modified = false;

      state.doc.descendants((node: any, pos: number) => {
        if (node.type.name === 'diffSuggestion') {
          // Simply access the node attributes - much cleaner!
          const originalText = node.attrs.originalText || '';
          
          if (originalText) {
            tr.replaceWith(
              pos,
              pos + node.nodeSize,
              state.schema.text(originalText)
            );
            modified = true;
          }
        }
      });

      if (modified) {
        dispatch(tr);
        return true;
      }

      return false;
    },
};
