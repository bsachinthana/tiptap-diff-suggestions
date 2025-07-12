// Sample content with diff suggestions
export const sampleContent = `
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

// Configuration for different examples
export const editorConfigs = {
  editor1: {
    element: '#editor1',
    config: {
      className: 'example-1',
      showButtons: true,
      buttonText: {
        accept: '✓',
        reject: '✗',
      },
    },
    description: 'Basic floating buttons',
  },
  editor2: {
    element: '#editor2',
    config: {
      className: 'example-2',
      showButtons: true,
      buttonText: {
        accept: 'Accept',
        reject: 'Reject',
      },
    },
    description: 'Text-based floating buttons',
  },
  editor3: {
    element: '#editor3',
    config: {
      className: 'example-3',
      showButtons: true,
      buttonText: {
        accept: '✓ Accept',
        reject: '✗ Reject',
      },
    },
    description: 'Custom styled floating buttons with gradients',
  },
  editor4: {
    element: '#editor4',
    config: {
      className: 'example-4',
      showButtons: true,
      buttonText: {
        accept: '+',
        reject: '−',
      },
    },
    description: 'Minimal circular floating buttons',
  },
};

// Sample suggestions for testing
export const sampleSuggestions = [
  { original: 'quick', suggested: 'lightning-fast' },
  { original: 'good', suggested: 'excellent' },
  { original: 'big', suggested: 'enormous' },
  { original: 'small', suggested: 'tiny' },
];
