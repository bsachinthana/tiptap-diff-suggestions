import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { DiffSuggestion } from '../src/index.js';
import { editorConfigs, sampleContent, sampleSuggestions } from './sample-data.js';
import { log } from './shared/utils.ts';

// Store editor instances
export const editors: Record<string, Editor> = {};

// Initialize all editors
export function initializeEditors() {
  Object.entries(editorConfigs).forEach(([editorId, config]) => {
    const editor = new Editor({
      element: document.querySelector(config.element)!,
      extensions: [
        StarterKit,
        DiffSuggestion.configure({
          ...config.config,
          onAccept: (meta) => {
            log(`[${config.description}] Accepted: "${meta.originalText}" → "${meta.suggestedText}"`);
          },
          onReject: (meta) => {
            log(`[${config.description}] Rejected: kept "${meta.originalText}"`);
          },
        }),
      ],
      content: sampleContent,
      editorProps: {
        attributes: {
          class: 'prose prose-sm focus:outline-none',
        },
      },
    });
    
    editors[editorId] = editor;
  });
  
  log('All editors initialized with floating button configurations');
}

// Add a sample suggestion to an editor
export function addSample(editorId: string) {
  const editor = editors[editorId];
  if (!editor) return;
  
  const randomId = Math.random().toString(36).substr(2, 9);
  const random = sampleSuggestions[Math.floor(Math.random() * sampleSuggestions.length)];
  
  editor.commands.insertDiffSuggestion({
    id: String(randomId),
    originalText: random.original,
    suggestedText: random.suggested,
    comment: 'Sample suggestion for testing',
  });
  
  log(`Added to ${editorId}: "${random.original}" → "${random.suggested}"`);
}

// Accept all suggestions in an editor
export function acceptAll(editorId: string) {
  const editor = editors[editorId];
  if (!editor) return;
  
  const success = (editor.commands as any).acceptAllDiffSuggestions();
  log(`${editorId}: ${success ? 'Accepted all suggestions' : 'No suggestions to accept'}`);
}

// Reject all suggestions in an editor
export function rejectAll(editorId: string) {
  const editor = editors[editorId];
  if (!editor) return;
  
  const success = (editor.commands as any).rejectAllDiffSuggestions();
  log(`${editorId}: ${success ? 'Rejected all suggestions' : 'No suggestions to reject'}`);
}
