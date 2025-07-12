# TipTap Diff Suggestions Extension

A framework-agnostic TipTap extension that enables inline comparison between current content and LLM-generated suggestions.

## Features

- 🔍 **HTML-based Structure**: Uses semantic HTML structure for diff suggestions
- ✅ **Accept/Reject Actions**: Interactive buttons to accept or reject suggestions
- 💬 **Comments Support**: Add contextual comments to suggestions
- 🎨 **Customizable Styling**: Built-in styles with dark mode support
- 🚀 **Framework Agnostic**: Works with any JavaScript framework
- � **Extensible**: Support for custom handlers and side-effects
- �📦 **TypeScript Support**: Full type definitions included

## HTML Structure

The extension generates the following HTML structure:

```html
<span data-diff-suggestion data-diff-suggestion-id="unique-id" data-diff-suggestion-comment="LLM reason">
  <span data-diff-suggestion-old>Original text</span>
  <span data-diff-suggestion-new>Suggested text</span>
</span>
```

## Installation

```bash
npm install @tiptap/extension-diff-suggestions
```

## Usage

### Basic Setup

```typescript
import { Editor } from '@tiptap/core';
import { DiffSuggestion } from '@tiptap/extension-diff-suggestions';

const editor = new Editor({
  extensions: [
    DiffSuggestion,
    // ... other extensions
  ],
});
```

### Inserting Diff Suggestions

```typescript
editor.commands.insertDiffSuggestion({
  id: 'unique-suggestion-123',
  comment: 'Suggested improvement for clarity'
});
```

### Advanced Configuration with Side-effects

```typescript
import { DiffSuggestion } from '@tiptap/extension-diff-suggestions';

const editor = new Editor({
  extensions: [
    DiffSuggestion.configure({
      HTMLAttributes: {
        class: 'my-custom-diff',
      },
      className: 'custom-diff-wrapper',
      showButtons: true,
      buttonText: {
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
  buttonText?: {
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

The extension includes default styles that can be customized by overriding CSS selectors:

- `span[data-diff-suggestion]` - Main container
- `span[data-diff-suggestion-old]` - Original text styling
- `span[data-diff-suggestion-new]` - Suggested text styling
- `.diff-actions` - Action buttons container
- `.diff-accept-btn` - Accept button
- `.diff-reject-btn` - Reject button

### Custom Styles Example

```css
span[data-diff-suggestion] {
  border: 2px solid #3b82f6;
  border-radius: 8px;
  padding: 4px 8px;
}

.diff-accept-btn {
  background-color: #10b981;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
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
