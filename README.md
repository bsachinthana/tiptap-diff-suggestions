# TipTap Diff Suggestions Extension

A TipTap extension for inline comparison of content with suggested revisions, including interactive controls.

## Idea/Goal

This extension provides a way to visualize and interact with suggested changes within a TipTap editor. It bridges the gap between static diff viewers and actionable content editing, allowing users to evaluate, accept, or reject suggestions directly in the editor.

> ## Content
> - [Use Cases](#use-cases)
> - [Features](#features)
> - [HTML Element Structure](#html-structure)
> - [Installation](#installation)
> - [Usage](#usage)
>    - [Basic Setup](#basic-setup)
>    - [Inserting diff Suggestions](#inserting-diff-suggestions)
>    - [Set editor content with diff Suggestions](#setting-editor-content-with-diff-suggestion-html)
>   - [Advanced Configuration with Side-effects](#advanced-configuration-with-side-effects)
>   - [Custom Action Override](#custom-behavior-override)
>
> - [API Reference](#api-reference)
> - [Styling](#styling)
> - [Examples](#examples)
> - [Development](#development)
> - [Contributing](#contributing)
>



## Use Cases

- **AI-Powered Writing Assistance**: Displaying and managing suggestions from AI writing tools.
- **Collaborative Content Review**: Facilitating editorial suggestions and peer review workflows.
- **Translation and Localization**: Presenting and integrating translation suggestions.

## Features

- 📝 **Interactive Diff Visualization**: Inline comparison with accept/reject controls
- 🎯 **Customizable Actions**: From simple buttons to complex approval workflows  
- 💬 **Contextual Comments**: Add explanations and reasoning to suggestions
- 🎨 **Headless Design**: No built-in styles - from quick prototyping to fully branded experiences
- 🔧 **Extensible Toolbar**: Custom action panels and interactive elements
- 🎭 **CSS Variables**: Themeable styling system with dark mode support
- 🚀 **Framework Agnostic**: Leverages TipTap's framework-agnostic architecture
- 📦 **TypeScript Ready**: Full type definitions for better developer experience
- ⚡ **Side-effect Hooks**: Integrate with external systems and workflows

## HTML Structure

The extension generates the following HTML structure:

```html
<span data-diff-suggestion data-diff-suggestion-id="unique-id" data-diff-suggestion-comment="reason for suggestion">
  <span data-diff-suggestion-old>Original text</span>
  <span data-diff-suggestion-new>Suggested text</span>
</span>
```

## Installation

```bash
npm install @buddhima_a/tiptap-diff-suggestions
```

## Usage

### Basic Setup

```typescript
import { Editor } from '@tiptap/core';
import { DiffSuggestion } from '@buddhima_a/tiptap-diff-suggestions';

const editor = new Editor({
  extensions: [
    DiffSuggestion,
    // ... other extensions
  ],
});
```
> #### ⚠️ Headless Architecture
> Following TipTap's headless architecture, this extension includes no built-in styling. 
> For rapid prototyping, use the included sample CSS. For production, leverage CSS variables and custom styling. Refer [styling](#styling) for more information


### Inserting Diff Suggestions

```typescript
editor.commands.insertDiffSuggestion({
  id: 'unique-suggestion-123',
  comment: 'Suggested improvement for clarity'
});
```

### Setting Editor Content with Diff Suggestion HTML

```typescript
editor.commands.setContent(`
  <p> This is some random text before suggestion
  <span data-diff-suggestion data-diff-suggestion-id="unique-suggestion-123" data-diff-suggestion-comment="Suggested improvement for clarity">
    <span data-diff-suggestion-old>The old text</span>
    <span data-diff-suggestion-new>The improved text</span>
  </span> the text follows suggestions.
`);
```

### Advanced Configuration with Side-effects

```typescript
import { DiffSuggestion } from '@buddhima_a/tiptap-diff-suggestions';

const editor = new Editor({
  extensions: [
    DiffSuggestion.configure({
      HTMLAttributes: {
        class: 'my-custom-diff',
      },
      className: 'custom-diff-wrapper',
      showButtons: true,
      buttons: {
        accept: 'Accept',
        reject: 'Reject',
      },
      // Side-effect callbacks
      onAccept: (meta) => {
        console.log('Accepted suggestion:', meta);
        sidebar.highlight(meta.id);
      },
      onReject: (meta) => {
        console.log('Rejected suggestion:', meta);
        sidebar.remove(meta.id);
      },
    }),
  ],
});
```

### Custom Behavior Override

```typescript
DiffSuggestion.configure({
  // Full logic override
  handleAccept: ({ tr, dispatch }) => {
    dispatch(tr.insertText("Custom Accept Logic"));
    return true;
  },
  handleReject: ({ tr, dispatch }) => {
    dispatch(tr.insertText("Custom Reject Logic"));
    return true;
  },
});
```

## API Reference

### Commands

- `insertDiffSuggestion(options)` - Insert a diff suggestion
- `acceptDiffSuggestion(id?)` - Accept a specific suggestion (or current selection)
- `rejectDiffSuggestion(id?)` - Reject a specific suggestion (or current selection)
- `acceptAllDiffSuggestions()` - Accept all suggestions in the document
- `rejectAllDiffSuggestions()` - Reject all suggestions in the document

### Options

```typescript
interface DiffSuggestionOptions {
  HTMLAttributes: Record<string, any>;
  className?: string;
  showButtons?: boolean;
  buttons?: {
    accept?: string;
    reject?: string;
  };
  onAccept?: (meta: DiffSuggestionMeta) => void;
  onReject?: (meta: DiffSuggestionMeta) => void;
  handleAccept?: Command;
  handleReject?: Command;
}
```

### Attributes

```typescript
interface DiffSuggestionAttributes {
  id: string;
  comment?: string;
}
```

### Meta Object

When using side-effect callbacks, you receive a meta object:

```typescript
interface DiffSuggestionMeta {
  id: string;
  comment?: string;
  accepted: boolean;
  originalText: string;
  suggestedText: string;
}
```

## Styling

The extension follows TipTap's headless approach - no styles are included by default, giving you complete control over the appearance.

### Quick Start with Sample Styles

For rapid prototyping and development:

```html
<link rel="stylesheet" href="node_modules/@buddhima_a/tiptap-diff-suggestions/sample.css">
```

### CSS Variables

The sample CSS includes CSS variables for easy theming:

```css
:root {
  --diff-suggestion-border: #3b82f6;
  --diff-suggestion-bg: rgba(59, 130, 246, 0.1);
  --diff-old-bg: rgba(239, 68, 68, 0.2);
  --diff-new-bg: rgba(34, 197, 94, 0.2);
  --diff-accept-btn: #10b981;
  --diff-reject-btn: #ef4444;
  --diff-toolbar-bg: white;
  --diff-toolbar-shadow: rgba(0, 0, 0, 0.1);
}

/* Dark mode variables are also included */
[data-theme="dark"] {
  --diff-toolbar-bg: #1f2937;
  --diff-toolbar-shadow: rgba(0, 0, 0, 0.3);
  /* ... more dark mode variables */
}
```

### Key CSS Selectors

Target these selectors for custom styling:

- `span[data-diff-suggestion]` - Main container
- `span[data-diff-suggestion-old]` - Original text styling  
- `span[data-diff-suggestion-new]` - Suggested text styling
- `.diff-suggestion-action-container` - Action buttons container
- `[data-diff-suggestion-toolbar-accept]` - Accept button
- `[data-diff-suggestion-toolbar-reject]` - Reject button

### Custom Styling Example

```css
span[data-diff-suggestion] {
  border: 2px solid var(--diff-suggestion-border, #3b82f6);
  border-radius: 8px;
  padding: 4px 8px;
  background: var(--diff-suggestion-bg, rgba(59, 130, 246, 0.1));
}

[data-diff-suggestion-toolbar-accept] {
  background-color: var(--diff-accept-btn, #10b981);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}
```

## Examples

### Working with Raw HTML

Since the extension expects HTML in the specified structure, you can work with it directly:

```typescript
// Assuming you have diff HTML from your diff algorithm
const diffHTML = `
  <span data-diff-suggestion data-diff-suggestion-id="123" data-diff-suggestion-comment="Grammar fix">
    <span data-diff-suggestion-old>teh quick</span>
    <span data-diff-suggestion-new>the quick</span>
  </span>
`;

// Insert the HTML directly
editor.commands.insertContent(diffHTML);
```

### Programmatic Suggestion Creation

```typescript
// Create suggestion programmatically
editor.commands.insertDiffSuggestion({
  id: Date.now().toString(),
  comment: 'AI suggested improvement'
});
```

For additional usage scenarios and implementation samples, refer to the examples in the repository.

## Development

### Building

```bash
npm run build
```

### Type Checking

```bash
npm run type-check
```

### Watch Mode

```bash
npm run dev
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.