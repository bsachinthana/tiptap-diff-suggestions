# Custom Action Toolbar Design

> ## Content
> [Overview](#overview) </br>
> [Features](#features)
> 1. [Semantic Action Mapping via data-* attributes](#1-semantic-action-mapping-via-data--attributes)
> 2. [Custom Action Toolbar UI](#2-custom-action-toolbar-ui-via-renderactionmenu)
> 3. [Framework Integration](#3-framework-integration-ready)
>
> [Usage Examples](#usage-examples)
> 1. [Basic Usage](#basic-usage-default-styling)
> 2. [Advanced Custom Toolbar](#advanced-custom-toolbar)
>
> [Styling](#-styling)
>




## Overview

The TipTap Diff Suggestions extension features a customizable action toolbar system, aligning with TipTap/ProseMirror's philosophy of extensibility and configuration. This document focuses specifically on the custom toolbar aspects. For general usage, refer to [README.md](README.md).

## Features

### 1. Semantic Action Mapping via `data-*` Attributes

The extension supports flexible markup by automatically binding logic to semantically labeled buttons:

```html
<!-- These will be automatically handled -->
<button data-diff-suggestion-toolbar-accept>Accept</button>
<button data-diff-suggestion-toolbar-reject>Reject</button>
```

This approach is ideal if you want to use custom button content (such as icons or styled elements) while retaining the default accept/reject actions handled by the extension.

### 2. Custom Action Toolbar UI via `renderActionMenu`
Complete control over toolbar appearance and behaviour:

```typescript
DiffSuggestion.configure({
  renderActionMenu: (meta) => {
    const toolbar = document.createElement('div');
    toolbar.innerHTML = `
      <button data-diff-suggestion-toolbar-accept>
        ✅ Accept "${meta.suggestedText}"
      </button>
      <button data-diff-suggestion-toolbar-reject>
        ❌ Keep "${meta.originalText}"
      </button>
      <button onclick="showInfo('${meta.id}')">
        ℹ️ Info
      </button>
      <!-- other elements -->
    `;
    return toolbar;
  }
})
```

### 3. Framework Integration Ready
The `renderActionMenu` function can easily integrate with any framework:

```typescript
// React-like usage
function createReactToolbar(meta) {
  const toolbar = document.createElement('div');
  // Create React portal or render React component
  ReactDOM.render(<CustomToolbar meta={meta} />, toolbar);
  return toolbar;
}

// Vue-like usage  
function createVueToolbar(meta) {
  const toolbar = document.createElement('div');
  // Mount Vue component
  createApp(CustomToolbar, { meta }).mount(toolbar);
  return toolbar;
}
```

## Usage Examples

### Basic Usage (Default Styling)
```typescript
DiffSuggestion.configure({
  showButtons: true,
  buttonText: {
    accept: '✓',
    reject: '✗',
  },
})
```

### Advanced Custom Toolbar

For advanced usage, see the custom-toolbar and programmatic examples in the repository for fully customized toolbars and custom accept/reject handlers.

```typescript
DiffSuggestion.configure({
  renderActionMenu: (meta) => {
    const toolbar = document.createElement('div');
    toolbar.className = 'diff-actions custom-style';
    
    // Add accept button
    const acceptBtn = document.createElement('button');
    acceptBtn.setAttribute('data-diff-suggestion-toolbar-accept', '');
    acceptBtn.innerHTML = `<span>✅</span> Accept`;
    
    // Add reject button  
    const rejectBtn = document.createElement('button');
    rejectBtn.setAttribute('data-diff-suggestion-toolbar-reject', '');
    rejectBtn.innerHTML = `<span>❌</span> Reject`;
    
    // Add custom info button
    const infoBtn = document.createElement('button');
    infoBtn.innerHTML = '💬';
    infoBtn.onclick = () => showComment(meta.comment);
    
    toolbar.append(acceptBtn, rejectBtn, infoBtn);
    return toolbar;
  },
  onAccept: (meta) => console.log('Accepted:', meta),
  onReject: (meta) => console.log('Rejected:', meta),
})
```

## 🎨 Styling

Consistent with TipTap's headless approach, this extension provides no default styles. For quick prototyping, sample CSS is available (see README.md). In production, use CSS variables and your own styles for full control. See the themed-editor example in the repository for custom toolbar and diff tag styling.

