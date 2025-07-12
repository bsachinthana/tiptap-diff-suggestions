import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { DiffSuggestion } from '../../dist/index.esm.js';
import { log, generateRandomId } from '../shared/utils.js';

export function createProgrammaticEditor(elementSelector: string, logElementId = 'programmatic-log') {
  const editor = new Editor({
    element: document.querySelector(elementSelector)!,
    extensions: [
      StarterKit,
      DiffSuggestion.configure({
        showButtons: true, // Default floating toolbar
        buttons:{
          accept: 'Accept',
          reject: 'Reject',
        },
        // Custom handlers that do full replacement with formatting
        handleAccept: ({ state, dispatch, view }) => {
          const { selection } = state;
          const { $from } = selection;
          
          // Find the diff suggestion node
          let suggestionNode: any = null;
          let suggestionPos = -1;
          
          state.doc.descendants((node: any, pos: number) => {
            if (node.type.name === 'diffSuggestion' && pos <= $from.pos && pos + node.nodeSize >= $from.pos) {
              suggestionNode = node;
              suggestionPos = pos;
              return false; // Stop searching
            }
          });
          
          if (!suggestionNode || suggestionPos === -1) return false;
          
          const suggestedText = suggestionNode.attrs.suggestedText || '';
          
          // Create formatted content instead of plain text
          const tr = state.tr;
          
          // Replace with italicized text
          const italicText = state.schema.text(suggestedText, [state.schema.marks.bold.create()]);
          tr.replaceWith(suggestionPos, suggestionPos + suggestionNode.nodeSize, italicText);
          
          if (dispatch) {
            dispatch(tr);
            return true;
          }
          return false;
        },
        
        handleReject: ({ state, dispatch, view }) => {
          const { selection } = state;
          const { $from } = selection;
          
          // Find the diff suggestion node
          let suggestionNode: any = null;
          let suggestionPos = -1;
          
          state.doc.descendants((node: any, pos: number) => {
            if (node.type.name === 'diffSuggestion' && pos <= $from.pos && pos + node.nodeSize >= $from.pos) {
              suggestionNode = node;
              suggestionPos = pos;
              return false; // Stop searching
            }
          });
          
          if (!suggestionNode || suggestionPos === -1) return false;
          
          const originalText = suggestionNode.attrs.originalText || '';
          
          // Create formatted content instead of plain text
          const tr = state.tr;
          
          // Replace with strikethrough text to show it was rejected
          const strikeText = state.schema.text(originalText, [state.schema.marks.strike.create()]);
          tr.replaceWith(suggestionPos, suggestionPos + suggestionNode.nodeSize, strikeText);
          
          if (dispatch) {
            dispatch(tr);
            return true;
          }
          return false;
        },
        
        onAccept: (meta) => {
          log(`✅ Accepted with bold formatting: "${meta.originalText}" → "*${meta.suggestedText}*"`, logElementId);
        },
        onReject: (meta) => {
          log(`❌ Rejected with strikethrough: "~~${meta.originalText}~~"`, logElementId);
        },
      }),
    ],
    content: `
      <p>This demonstrates <strong>custom action handlers</strong> that perform full replacement with formatting.</p>
      <p>Features shown:</p>
      <ul>
        <li>handleAccept: Replaces with <b>bold</b> text instead of plain text</li>
        <li>handleReject: Replaces with <s>strikethrough</s> text</li>
        <li>Full control over replacement behavior</li>
        <li>Programmatic API for adding suggestions</li>
      </ul>
      <p>Sample suggestion: This approach is <span data-diff-suggestion="" data-diff-suggestion-id="demo-programmatic-1" data-diff-suggestion-comment="Emphasize the significance" contenteditable="false"><span data-diff-suggestion-old="">useful</span><span data-diff-suggestion-new="">revolutionary</span></span> for text processing.</p>
      <p>Try the button below to add a grammar suggestion!</p>
    `,
    editorProps: {
      attributes: {
        class: 'prose prose-sm focus:outline-none',
      },
    },
  });

  const addGrammarSuggestion = () => {
    const suggestions = [
      {
        original: 'alot',
        suggested: 'a lot',
        comment: 'Correct spelling of "a lot"',
      },
      {
        original: 'its time',
        suggested: "it's time",
        comment: 'Add apostrophe for contraction',
      },
      {
        original: 'could of',
        suggested: 'could have',
        comment: 'Correct grammatical form',
      },
    ];

    const suggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    editor.commands.insertDiffSuggestion({
      id: generateRandomId(),
      originalText: suggestion.original,
      suggestedText: suggestion.suggested,
      comment: suggestion.comment,
    });
    log(`📝 Added grammar suggestion: "${suggestion.original}" → "${suggestion.suggested}"`, logElementId);
  };

  return { 
    editor, 
    addGrammarSuggestion
  };
}
