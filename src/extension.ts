import { Node, mergeAttributes } from '@tiptap/core';
import type { DiffSuggestionOptions } from './types';
import { DiffSuggestionNodeView } from './nodeview';
import { commands } from './commands';

export const DiffSuggestion = Node.create<DiffSuggestionOptions>({
  name: 'diffSuggestion',

  addOptions() {
    return {
      HTMLAttributes: {},
      className: 'diff-suggestion',
      showButtons: true,
      buttons: {
        accept: '',
        reject: '',
      },
    };
  },

  group: 'inline',

  inline: true,

  atom: true,

  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-diff-suggestion-id'),
        renderHTML: (attributes) => {
          if (!attributes.id) {
            return {};
          }
          return {
            'data-diff-suggestion-id': attributes.id,
          };
        },
      },
      comment: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-diff-suggestion-comment'),
        renderHTML: (attributes) => {
          return {
            'data-diff-suggestion-comment': attributes.comment || '',
          };
        },
      },
      originalText: {
        default: '',
        parseHTML: (element) => {
          const oldSpan = element.querySelector('[data-diff-suggestion-old]');
          return oldSpan?.textContent || '';
        },
        renderHTML: () => {
          // This is rendered in the HTML structure, not as an attribute
          return {};
        },
      },
      suggestedText: {
        default: '',
        parseHTML: (element) => {
          const newSpan = element.querySelector('[data-diff-suggestion-new]');
          return newSpan?.textContent || '';
        },
        renderHTML: () => {
          // This is rendered in the HTML structure, not as an attribute
          return {};
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-diff-suggestion]',
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    return [
      'span',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-diff-suggestion': '',
        'data-diff-suggestion-id': node.attrs.id,
        'data-diff-suggestion-comment': node.attrs.comment ?? '',
        'contenteditable': 'false',
        'class': this.options.className,
      }),
      ['span', { 'data-diff-suggestion-old': '' }, node.attrs.originalText || ''],
      ['span', { 'data-diff-suggestion-new': '' }, node.attrs.suggestedText || ''],
    ];
  },

  addNodeView() {
    return ({ node, view, getPos }) => {
      return new DiffSuggestionNodeView(node, view, getPos, this.options);
    };
  },

  addCommands() {
    return commands;
  },
});
