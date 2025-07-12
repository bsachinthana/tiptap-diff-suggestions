import type { NodeView } from '@tiptap/pm/view';
import type { Node } from '@tiptap/pm/model';
import type { EditorView } from '@tiptap/pm/view';
import type { DiffSuggestionMeta, DiffSuggestionOptions, DiffSuggestionActionMeta } from './types';

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
    // Direct access to node attributes
    const { id, comment, originalText, suggestedText } = this.node.attrs;

    // Create a wrapper for the suggestion content
    const contentWrapper = document.createElement('span');
    contentWrapper.className = 'diff-suggestion-content';
    contentWrapper.style.position = 'relative';
    contentWrapper.style.display = 'inline-block';

    // Create old text span
    const oldSpan = document.createElement('span');
    oldSpan.setAttribute('data-diff-suggestion-old', '');
    oldSpan.textContent = originalText || '';

    // Create new text span
    const newSpan = document.createElement('span');
    newSpan.setAttribute('data-diff-suggestion-new', '');
    newSpan.textContent = suggestedText || '';

    contentWrapper.appendChild(oldSpan);
    contentWrapper.appendChild(newSpan);

    // Create action menu/toolbar
    const actionsContainer = this.createActionMenu();
    
    if (actionsContainer) {
      contentWrapper.appendChild(actionsContainer);
      
      // Show/hide on hover
      contentWrapper.addEventListener('mouseenter', () => {
        actionsContainer.style.opacity = '1';
      });
      
      contentWrapper.addEventListener('mouseleave', () => {
        actionsContainer.style.opacity = '0';
      });
    }

    // Clear and rebuild DOM
    this.dom.innerHTML = '';
    this.dom.appendChild(contentWrapper);
  }

  private createActionMenu(): HTMLElement | null {
    // Skip if buttons are disabled
    if (this.options.showButtons === false) {
      return null;
    }

    const { id, comment, originalText, suggestedText } = this.node.attrs;
    const pos = this.getPos();
    
    if (pos === undefined) return null;

    const meta: DiffSuggestionActionMeta = {
      id,
      comment,
      originalText: originalText || '',
      suggestedText: suggestedText || '',
      pos,
    };

    // Use custom renderActionMenu if provided
    if (this.options.renderActionMenu) {
      const customMenu = this.options.renderActionMenu(meta);
      this.attachDefaultEventListeners(customMenu);
      return customMenu;
    }

    // Create default toolbar
    return this.createDefaultToolbar();
  }

  private createDefaultToolbar(): HTMLElement {
    const actionsContainer = document.createElement('div');
    actionsContainer.className = 'diff-suggestion-action-container';

    const acceptButton = document.createElement('button');
    acceptButton.className = 'diff-accept-btn';
    acceptButton.setAttribute('data-diff-suggestion-toolbar-accept', '');
    acceptButton.textContent = this.getButtonText('accept');
    acceptButton.title = 'Accept suggestion';
    acceptButton.type = 'button';

    const rejectButton = document.createElement('button');
    rejectButton.className = 'diff-reject-btn';
    rejectButton.setAttribute('data-diff-suggestion-toolbar-reject', '');
    rejectButton.textContent = this.getButtonText('reject');
    rejectButton.title = 'Reject suggestion';
    rejectButton.type = 'button';

    actionsContainer.appendChild(acceptButton);
    actionsContainer.appendChild(rejectButton);

    this.attachDefaultEventListeners(actionsContainer);
    return actionsContainer;
  }

  private getButtonText(type: 'accept' | 'reject'): string {
    if (this.options.buttons?.[type]) {
      const button = this.options.buttons[type];
      if (typeof button === 'string') {
        return button;
      }
      return button.content;
    }
    
    return '';
  }

  private attachDefaultEventListeners(container: HTMLElement): void {
    // Use semantic data-* attributes for button recognition
    const acceptBtn = container.querySelector('[data-diff-suggestion-toolbar-accept]');
    const rejectBtn = container.querySelector('[data-diff-suggestion-toolbar-reject]');
    
    if (acceptBtn) {
      acceptBtn.addEventListener('click', this.handleAccept.bind(this));
    }
    if (rejectBtn) {
      rejectBtn.addEventListener('click', this.handleReject.bind(this));
    }
  }

  private createMeta(action: 'accept' | 'reject'): DiffSuggestionMeta {
    const pos = this.getPos();
    return {
      id: this.node.attrs.id,
      comment: this.node.attrs.comment,
      accepted: action === 'accept',
      originalText: this.node.attrs.originalText || '',
      suggestedText: this.node.attrs.suggestedText || '',
      pos: pos !== undefined ? pos : -1,
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
    // Cleanup event listeners - use semantic selectors
    const acceptBtn = this.dom.querySelector('[data-diff-suggestion-toolbar-accept]');
    const rejectBtn = this.dom.querySelector('[data-diff-suggestion-toolbar-reject]');
    
    if (acceptBtn) {
      acceptBtn.removeEventListener('click', this.handleAccept.bind(this));
    }
    if (rejectBtn) {
      rejectBtn.removeEventListener('click', this.handleReject.bind(this));
    }
  }
}
