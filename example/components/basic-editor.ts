import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { DiffSuggestion } from '../../dist/index.esm.js';
import { log } from '../shared/utils.js';

export function createBasicEditor(elementSelector: string, logElementId = 'basic-log') {
  const editor = new Editor({
    element: document.querySelector(elementSelector)!,
    extensions: [
      StarterKit,
      DiffSuggestion.configure({
        // Default configuration - minimal setup to showcase built-in features
        showButtons: true, // Default floating toolbar
        buttons: {
          accept: 'Accept', // Accept button  
          reject: 'Reject', // Reject button
        },
        onAccept: (meta) => {
          log(`✅ Accepted suggestion "${meta.id}": "${meta.originalText}" → "${meta.suggestedText}"`, logElementId);
        },
        onReject: (meta) => {
          log(`❌ Rejected suggestion "${meta.id}": Kept "${meta.originalText}"`, logElementId);
        },
      }),
    ],
    content: `
      <p>This demonstrates the <strong>basic configuration</strong> of the Diff Suggestions extension.</p>
      <p>Features shown:</p>
      <ul>
        <li>Default floating toolbar with ✓ and ✗ buttons</li>
        <li>Hover interaction to reveal actions</li>
        <li>Built-in styling with CSS variables</li>
        <li>Simple text replacement behavior</li>
      </ul>
      <p>Here's a sample: The weather is <span data-diff-suggestion="" data-diff-suggestion-id="demo-1" data-diff-suggestion-comment="Use a more descriptive adjective" contenteditable="false"><span data-diff-suggestion-old="">good</span><span data-diff-suggestion-new="">fantastic</span></span> today!</p>
      <p>Click "Add Sample Suggestion" to insert more examples.</p>
    `,
    editorProps: {
      attributes: {
        class: 'prose prose-sm focus:outline-none',
      },
    },
  });

  const addSample = () => {
    const suggestions = [
      {
        id: `suggestion-${Date.now()}`,
        originalText: 'big',
        suggestedText: 'enormous',
        comment: 'Use a more impactful adjective',
      },
      {
        id: `suggestion-${Date.now() + 1}`,
        originalText: 'went to',
        suggestedText: 'visited',
        comment: 'More precise verb choice',
      },
      {
        id: `suggestion-${Date.now() + 2}`,
        originalText: 'a lot of people',
        suggestedText: 'numerous individuals',
        comment: 'More formal language',
      },
    ];

    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    
    editor.commands.insertDiffSuggestion(randomSuggestion);
    log(`📝 Added suggestion: "${randomSuggestion.originalText}" → "${randomSuggestion.suggestedText}"`, logElementId);
  };

  return { editor, addSample };
}
