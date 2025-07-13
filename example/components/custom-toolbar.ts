import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { DiffSuggestion } from '../../dist/index.esm.js';
import type { DiffSuggestionActionMeta } from '../../src/types.js';
import { cancelSvgIcon, checkSvgIcon, infoSvgIcon, log } from '../shared/utils.js';



export function createCustomToolbarEditor(elementSelector: string, logElementId = 'custom-log') {
  const editor = new Editor({
    element: document.querySelector(elementSelector)!,
    extensions: [
      StarterKit,
      DiffSuggestion.configure({
        // Custom toolbar with additional actions that chain rather than replace
        renderActionMenu: (meta: DiffSuggestionActionMeta) => {
          const toolbar = document.createElement('div');
          toolbar.className = 'diff-suggestion-action-container custom-toolbar';
          toolbar.style.cssText = `
            display: flex;
            gap: 4px;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            padding: 4px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            position: absolute;
            top: -2.5rem;
            right: 0;
            z-index: 10;
          `;

          // Info button - shows comment in alert (chained action)
          const infoBtn = document.createElement('button');
          infoBtn.innerHTML = infoSvgIcon;
          infoBtn.title = 'Show suggestion details';
          infoBtn.className = 'diff-btn-custom btn-info';
          infoBtn.style.cssText = `
            border: none;
            background: #f3f4f6;
            color: #374151;
            padding: 4px 8px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s;
          `;
          infoBtn.onmouseenter = () => { infoBtn.style.background = '#e5e7eb'; };
          infoBtn.onmouseleave = () => { infoBtn.style.background = '#f3f4f6'; };
          
          // Custom accept button
          const acceptBtn = document.createElement('button');
          acceptBtn.innerHTML = checkSvgIcon;
          acceptBtn.title = 'Accept suggestion';
          acceptBtn.className = 'diff-btn-custom btn-accept';
          acceptBtn.setAttribute('data-diff-suggestion-toolbar-accept', '');
          acceptBtn.style.cssText = `
            border: none;
            background: #d1fae5;
            color: #065f46;
            padding: 4px 8px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s;
          `;
          acceptBtn.onmouseenter = () => { acceptBtn.style.background = '#a7f3d0'; };
          acceptBtn.onmouseleave = () => { acceptBtn.style.background = '#d1fae5'; };

          // Custom reject button
          const rejectBtn = document.createElement('button');
          rejectBtn.innerHTML = cancelSvgIcon;
          rejectBtn.title = 'Reject suggestion';
          rejectBtn.className = 'diff-btn-custom btn-reject';
          rejectBtn.setAttribute('data-diff-suggestion-toolbar-reject', '');
          rejectBtn.style.cssText = `
            border: none;
            background: #fecaca;
            color: #991b1b;
            padding: 4px 8px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s;
          `;
          rejectBtn.onmouseenter = () => { rejectBtn.style.background = '#fca5a5'; };
          rejectBtn.onmouseleave = () => { rejectBtn.style.background = '#fecaca'; };

          // Chain action: Show alert with suggestion details
          infoBtn.addEventListener('click', () => {
            const details = `
Suggestion ID: ${meta.id}
Original: "${meta.originalText}"
Suggested: "${meta.suggestedText}"
Comment: ${meta.comment || 'No comment'}
Position: ${meta.pos}
            `.trim();
            alert(details);
            log(`Viewed details for suggestion "${meta.id}"`, logElementId);
          });

          toolbar.appendChild(infoBtn);
          toolbar.appendChild(acceptBtn);
          toolbar.appendChild(rejectBtn);
          
          return toolbar;
        },
        onAccept: (meta) => {
          log(`✅ Accepted via custom toolbar: "${meta.originalText}" → "${meta.suggestedText}"`, logElementId);
        },
        onReject: (meta) => {
          log(`❌ Rejected via custom toolbar: Kept "${meta.originalText}"`, logElementId);
        },
      }),
    ],
    content: `
      <p>This demonstrates <strong>custom toolbar functionality</strong> with chained actions.</p>
      <p>Features shown:</p>
      <ul>
        <li>Custom renderActionMenu implementation</li>
        <li>Additional info button that shows alerts (chained action)</li>
        <li>Custom styling for toolbar buttons</li>
        <li>Access to suggestion metadata</li>
      </ul>
      <p>Try this sample: The code is <span data-diff-suggestion="" data-diff-suggestion-id="demo-custom-1" data-diff-suggestion-comment="Consider using more specific technical terminology" contenteditable="false"><span data-diff-suggestion-old="">good</span><span data-diff-suggestion-new="">well-architected</span></span> and runs perfectly.</p>
      <p>Hover over suggestions to see the custom toolbar with an info button!</p>
    `,
    editorProps: {
      attributes: {
        class: 'prose prose-sm focus:outline-none',
      },
    },
  });

  // Auto-add some sample suggestions on load
  setTimeout(() => {
    const samples = [
      {
        id: 'custom-sample-1',
        originalText: 'fast',
        suggestedText: 'optimized',
        comment: 'More technical terminology for performance',
      },
      {
        id: 'custom-sample-2', 
        originalText: 'works well',
        suggestedText: 'performs efficiently',
        comment: 'More precise description of functionality',
      },
    ];

    samples.forEach(sample => {
      editor.commands.insertContent(' ');
      editor.commands.insertDiffSuggestion(sample);
    });
    
    log(`📝 Auto-added ${samples.length} sample suggestions with custom toolbar`, logElementId);
  }, 500);

  return { editor };
}
