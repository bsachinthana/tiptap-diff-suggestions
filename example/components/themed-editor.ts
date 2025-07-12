import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { DiffSuggestion } from '../../dist/index.esm.js';
import { log } from '../shared/utils.js';

export type Theme = 'light' | 'dark' | 'minimal' | 'colorful';

export function createThemedEditor(elementSelector: string, theme: Theme = 'light', logElementId = 'themed-log') {
  const container = document.querySelector(elementSelector)!;
  
  // Apply theme-specific CSS variables for the diff suggestion extension
  const applyTheme = (themeName: Theme) => {
    // Remove existing theme attributes
    container.removeAttribute('data-theme');
    // Set new theme attribute for CSS targeting
    container.setAttribute('data-theme', themeName);
    
    log(`🎨 Applied ${themeName} theme via CSS data-theme attribute (see custom-theme.css for overrides)`, logElementId);
  };
  
  // Apply initial theme
  applyTheme(theme);
  
  const editor = new Editor({
    element: container,
    extensions: [
      StarterKit,
      DiffSuggestion.configure({
        // Basic configuration to showcase theming
        showButtons: true,
        buttons: {
          accept: 'Accept',
          reject: 'Reject',
        },
        onAccept: (meta) => {
          log(`✅ [${theme.toUpperCase()}] Accepted: "${meta.originalText}" → "${meta.suggestedText}"`, logElementId);
        },
        onReject: (meta) => {
          log(`❌ [${theme.toUpperCase()}] Rejected: Kept "${meta.originalText}"`, logElementId);
        },
      }),
    ],
    content: `
      <p>This demonstrates <strong>theming via external CSS file</strong> that overrides the extension's built-in styles.</p>
      <p>Features shown:</p>
      <ul>
        <li>External <code>custom-theme.css</code> overrides extension's CSS variables</li>
        <li>CSS cascade demonstration with <code>[data-theme]</code> selectors</li>
        <li>Theme-specific color schemes and styling</li>
        <li>Runtime theme switching via data attributes</li>
      </ul>
      <p>Current theme: <strong>${theme}</strong></p>
      <p>The extension's default styles are in <code>src/styles/index.css</code>, and our custom overrides are in <code>custom-theme.css</code>.</p>
      <p>Try this suggestion: The extension looks <span data-diff-suggestion="" data-diff-suggestion-id="theme-demo-1" data-diff-suggestion-comment="Theme-specific styling demonstration" contenteditable="false"><span data-diff-suggestion-old="">nice</span><span data-diff-suggestion-new="">absolutely stunning</span></span> with custom theming!</p>
      <p>Another example: Hover effects are <span data-diff-suggestion="" data-diff-suggestion-id="theme-demo-2" data-diff-suggestion-comment="Interactive feedback demonstration" contenteditable="false"><span data-diff-suggestion-old="">responsive</span><span data-diff-suggestion-new="">beautifully crafted</span></span> in each theme.</p>
    `,
    editorProps: {
      attributes: {
        class: 'prose prose-sm focus:outline-none',
      },
    },
  });

  const switchTheme = (newTheme: Theme) => {
    applyTheme(newTheme);
    
    // Update content to reflect new theme
    const currentContent = editor.getHTML();
    const updatedContent = currentContent.replace(
      /Current theme: <strong>\w+<\/strong>/,
      `Current theme: <strong>${newTheme}</strong>`
    );
    editor.commands.setContent(updatedContent);
    
    log(`🔄 Switched to ${newTheme} theme`, logElementId);
  };

  return { editor, switchTheme };
}
