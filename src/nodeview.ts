import type { NodeView } from '@tiptap/pm/view';
import type { Node } from '@tiptap/pm/model';
import type { EditorView } from '@tiptap/pm/view';
import type { DiffSuggestionMeta, DiffSuggestionOptions } from './types';

/**
 * Framework-agnostic NodeView for diff suggestions
 * Creates a vanilla HTML/DOM implementation that can work with any framework
 */
export class DiffSuggestionNodeView implements NodeView {
  dom: HTMLElement;
  private node: Node;
  private view: EditorView;
  private getPos: () => number | undefined;
  private options: Partial<DiffSuggestionOptions>;

  constructor(
    node: Node, 
    view: EditorView, 
    getPos: () => number | undefined,
    options: Partial<DiffSuggestionOptions> = {}
  ) {
    this.node = node;
    this.view = view;
    this.getPos = getPos;
    this.options = options;

    // Create the main wrapper following the specified structure
    this.dom = document.createElement('span');
    this.dom.setAttribute('data-diff-suggestion', '');
    this.dom.setAttribute('data-diff-suggestion-id', node.attrs.id);
    this.dom.setAttribute('data-diff-suggestion-comment', node.attrs.comment || '');
    this.dom.setAttribute('contenteditable', 'false');
    
    if (options.className) {
      this.dom.className = options.className;
    }

    this.render();
  }

  private render(): void {
    // Direct access to node attributes - just like your Svelte props!
    const { id, comment, originalText, suggestedText } = this.node.attrs;

    // Create old text span
    const oldSpan = document.createElement('span');
    oldSpan.setAttribute('data-diff-suggestion-old', '');
    oldSpan.textContent = originalText || '';

    // Create new text span
    const newSpan = document.createElement('span');
    newSpan.setAttribute('data-diff-suggestion-new', '');
    newSpan.textContent = suggestedText || '';

    // Create action buttons if enabled
    let actionsContainer: HTMLElement | null = null;
    if (this.options.showButtons !== false) {
      actionsContainer = document.createElement('span');
      actionsContainer.className = 'diff-actions';

      const acceptButton = document.createElement('button');
      acceptButton.className = 'diff-accept-btn';
      acceptButton.textContent = this.options.buttonText?.accept || '✓';
      acceptButton.title = 'Accept suggestion';
      acceptButton.type = 'button';
      acceptButton.addEventListener('click', this.handleAccept.bind(this));

      const rejectButton = document.createElement('button');
      rejectButton.className = 'diff-reject-btn';
      rejectButton.textContent = this.options.buttonText?.reject || '✗';
      rejectButton.title = 'Reject suggestion';
      rejectButton.type = 'button';
      rejectButton.addEventListener('click', this.handleReject.bind(this));

      actionsContainer.appendChild(acceptButton);
      actionsContainer.appendChild(rejectButton);
    }

    // Clear and rebuild DOM
    this.dom.innerHTML = '';
    this.dom.appendChild(oldSpan);
    this.dom.appendChild(newSpan);
    
    if (actionsContainer) {
      this.dom.appendChild(actionsContainer);
    }
  }

  private createMeta(action: 'accept' | 'reject'): DiffSuggestionMeta {
    // Direct access to node attributes - much simpler!
    return {
      id: this.node.attrs.id,
      comment: this.node.attrs.comment,
      accepted: action === 'accept',
      originalText: this.node.attrs.originalText || '',
      suggestedText: this.node.attrs.suggestedText || '',
    };
  }

  private handleAccept(): void {
    const meta = this.createMeta('accept');
    
    // Use custom handler if provided, otherwise use default behavior
    if (this.options.handleAccept) {
      const result = this.options.handleAccept({
        state: this.view.state,
        dispatch: this.view.dispatch.bind(this.view),
        view: this.view,
        tr: this.view.state.tr,
        editor: (this.view as any).editor,
      } as any);
      
      if (result) {
        this.options.onAccept?.(meta);
      }
    } else {
      // Default behavior: replace with suggested text
      const pos = this.getPos();
      if (pos === undefined) return;

      const transaction = this.view.state.tr.replaceWith(
        pos,
        pos + this.node.nodeSize,
        this.view.state.schema.text(this.node.attrs.suggestedText || '')
      );
      this.view.dispatch(transaction);
      this.options.onAccept?.(meta);
    }
  }

  private handleReject(): void {
    const meta = this.createMeta('reject');
    
    // Use custom handler if provided, otherwise use default behavior
    if (this.options.handleReject) {
      const result = this.options.handleReject({
        state: this.view.state,
        dispatch: this.view.dispatch.bind(this.view),
        view: this.view,
        tr: this.view.state.tr,
        editor: (this.view as any).editor,
      } as any);
      
      if (result) {
        this.options.onReject?.(meta);
      }
    } else {
      // Default behavior: replace with original text
      const pos = this.getPos();
      if (pos === undefined) return;

      const transaction = this.view.state.tr.replaceWith(
        pos,
        pos + this.node.nodeSize,
        this.view.state.schema.text(this.node.attrs.originalText || '')
      );
      this.view.dispatch(transaction);
      this.options.onReject?.(meta);
    }
  }

  update(node: Node): boolean {
    if (node.type !== this.node.type) {
      return false;
    }

    this.node = node;
    this.render();
    return true;
  }

  destroy(): void {
    // Cleanup event listeners
    const acceptBtn = this.dom.querySelector('.diff-accept-btn');
    const rejectBtn = this.dom.querySelector('.diff-reject-btn');
    
    if (acceptBtn) {
      acceptBtn.removeEventListener('click', this.handleAccept.bind(this));
    }
    if (rejectBtn) {
      rejectBtn.removeEventListener('click', this.handleReject.bind(this));
    }
  }
}
