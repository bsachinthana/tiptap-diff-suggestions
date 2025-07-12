import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
// Import our extension from the parent directory
import { DiffSuggestion } from '../src/index';

// Utility function to log messages
function log(message: string) {
  console.log(message);
  const logElement = document.getElementById('log');
  if (logElement) {
    logElement.innerHTML += `<br>${new Date().toLocaleTimeString()}: ${message}`;
    logElement.scrollTop = logElement.scrollHeight;
  }
}

// Sample content with diff suggestions
const sampleContent = `
<p>Welcome to the TipTap Diff Suggestions extension! This is a 
<span data-diff-suggestion data-diff-suggestion-id="demo-1" data-diff-suggestion-comment="Grammar improvement" data-diff-suggestion-original-text="powerfull" data-diff-suggestion-suggested-text="powerful">
  <span data-diff-suggestion-old>powerfull</span>
  <span data-diff-suggestion-new>powerful</span>
</span> 
extension that allows you to show inline suggestions.</p>

<p>Here's another example: The weather today is 
<span data-diff-suggestion data-diff-suggestion-id="demo-2" data-diff-suggestion-comment="More descriptive word" data-diff-suggestion-original-text="nice" data-diff-suggestion-suggested-text="absolutely beautiful">
  <span data-diff-suggestion-old>nice</span>
  <span data-diff-suggestion-new>absolutely beautiful</span>
</span> 
and perfect for a walk in the park.</p>
`;

// Store editor instances
const editors: Record<string, Editor> = {};

// Create custom styling for different examples
const customStyles = `
/* Custom styles for Example 3 */
.example-3 .diff-accept-btn {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 4px 12px;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
  transition: all 0.2s ease;
}

.example-3 .diff-accept-btn:hover {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(16, 185, 129, 0.4);
}

.example-3 .diff-reject-btn {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 4px 12px;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);
  transition: all 0.2s ease;
}

.example-3 .diff-reject-btn:hover {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(239, 68, 68, 0.4);
}

/* Custom styles for Example 4 */
.example-4 .diff-accept-btn,
.example-4 .diff-reject-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  border: 2px solid currentColor;
  background: white;
  transition: all 0.2s ease;
}

.example-4 .diff-accept-btn:hover {
  background: var(--diff-accept-color);
  color: white;
}

.example-4 .diff-reject-btn:hover {
  background: var(--diff-reject-color);
  color: white;
}

/* Dark mode toggle styles */
body.dark-mode {
  background: #1a1a1a;
  color: #e5e5e5;
}

body.dark-mode .demo-section {
  background: #2a2a2a;
  border-color: #404040;
}

body.dark-mode .editor {
  background: #1f1f1f;
  border-color: #404040;
  color: #e5e5e5;
}

body.dark-mode .log {
  background: #1f1f1f;
  border-color: #404040;
  color: #e5e5e5;
}
`;

// Add custom styles to the page
const styleSheet = document.createElement('style');
styleSheet.textContent = customStyles;
document.head.appendChild(styleSheet);

// Configuration for different examples
const editorConfigs = {
  editor1: {
    element: '#editor1',
    config: {
      className: 'example-1',
      showButtons: true,
      buttons: {
        accept: 'Accept',
        reject: 'Reject',
      },
    },
    description: 'Basic text buttons',
  },
  editor2: {
    element: '#editor2',
    config: {
      className: 'example-2',
      showButtons: true,
      buttons: {
        accept: {
          content: '✓',
          title: 'Accept this suggestion',
          className: 'diff-btn-icon',
        },
        reject: {
          content: '✗',
          title: 'Reject this suggestion',
          className: 'diff-btn-icon',
        },
      },
    },
    description: 'Unicode emoji buttons',
  },
  editor3: {
    element: '#editor3',
    config: {
      className: 'example-3',
      showButtons: true,
      buttons: {
        accept: {
          content: '✓ Accept',
          title: 'Accept this suggestion',
          className: 'diff-btn-custom',
        },
        reject: {
          content: '✗ Reject',
          title: 'Reject this suggestion',
          className: 'diff-btn-custom',
        },
      },
    },
    description: 'Custom styled buttons with gradients',
  },
  editor4: {
    element: '#editor4',
    config: {
      className: 'example-4',
      showButtons: true,
      buttons: {
        accept: {
          content: '+',
          title: 'Accept',
          className: 'diff-btn-minimal',
        },
        reject: {
          content: '−',
          title: 'Reject',
          className: 'diff-btn-minimal',
        },
      },
    },
    description: 'Minimal icon buttons',
  },
};

// Initialize all editors
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

// Global helper functions for the demo
(window as any).addSample = (editorId: string) => {
  const editor = editors[editorId];
  if (!editor) return;
  
  const randomId = Math.random().toString(36).substr(2, 9);
  const suggestions = [
    { original: 'quick', suggested: 'lightning-fast' },
    { original: 'good', suggested: 'excellent' },
    { original: 'big', suggested: 'enormous' },
    { original: 'small', suggested: 'tiny' },
  ];
  const random = suggestions[Math.floor(Math.random() * suggestions.length)];
  
  editor.commands.insertDiffSuggestion({
    id: String(randomId),
    originalText: random.original,
    suggestedText: random.suggested,
    comment: 'Sample suggestion for testing',
  });
  
  log(`Added to ${editorId}: "${random.original}" → "${random.suggested}"`);
};

(window as any).acceptAll = (editorId: string) => {
  const editor = editors[editorId];
  if (!editor) return;
  
  const success = (editor.commands as any).acceptAllDiffSuggestions();
  log(`${editorId}: ${success ? 'Accepted all suggestions' : 'No suggestions to accept'}`);
};

(window as any).rejectAll = (editorId: string) => {
  const editor = editors[editorId];
  if (!editor) return;
  
  const success = (editor.commands as any).rejectAllDiffSuggestions();
  log(`${editorId}: ${success ? 'Rejected all suggestions' : 'No suggestions to reject'}`);
};

(window as any).toggleDarkMode = () => {
  document.body.classList.toggle('dark-mode');
  log(`Dark mode ${document.body.classList.contains('dark-mode') ? 'enabled' : 'disabled'}`);
};

(window as any).clearLog = () => {
  const logElement = document.getElementById('log');
  if (logElement) {
    logElement.innerHTML = '<strong>Activity Log:</strong><br>';
  }
};

// Log initial state
log('All editors initialized with different button configurations');
log('Hover over suggestions to see different button styles');

// Make editors available globally for debugging
(window as any).editors = editors;
