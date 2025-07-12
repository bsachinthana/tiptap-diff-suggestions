export function log(message: string, logElementId = 'log') {
  console.log(message);
  const logElement = document.getElementById(logElementId);
  if (logElement) {
    logElement.innerHTML += `<br>${new Date().toLocaleTimeString()}: ${message}`;
    logElement.scrollTop = logElement.scrollHeight;
  }
}

export function clearLog(logElementId = 'log') {
  const logElement = document.getElementById(logElementId);
  if (logElement) {
    logElement.innerHTML = '<strong>Activity Log:</strong><br>';
  }
}

export const sampleContent = `
<p>Welcome to the TipTap Diff Suggestions extension! This is a 
<span data-diff-suggestion data-diff-suggestion-id="demo-1" data-diff-suggestion-comment="Grammar improvement" data-diff-suggestion-original-text="powerfull" data-diff-suggestion-suggested-text="powerful">
  <span data-diff-suggestion-old>powerfull</span>
  <span data-diff-suggestion-new">powerful</span>
</span> 
extension that allows you to show inline suggestions.</p>

<p>Here's another example: The weather today is 
<span data-diff-suggestion data-diff-suggestion-id="demo-2" data-diff-suggestion-comment="More descriptive word" data-diff-suggestion-original-text="nice" data-diff-suggestion-suggested-text="absolutely beautiful">
  <span data-diff-suggestion-old>nice</span>
  <span data-diff-suggestion-new>absolutely beautiful</span>
</span> 
and perfect for a walk in the park.</p>
`;

export const sampleSuggestions = [
  { original: 'quick', suggested: 'lightning-fast', comment: 'More vivid description' },
  { original: 'good', suggested: 'excellent', comment: 'Stronger adjective' },
  { original: 'big', suggested: 'enormous', comment: 'More precise sizing' },
  { original: 'small', suggested: 'tiny', comment: 'More descriptive' },
  { original: 'fast', suggested: 'blazing-fast', comment: 'More dynamic' },
  { original: 'old', suggested: 'ancient', comment: 'More evocative' },
];

export function getRandomSuggestion() {
  return sampleSuggestions[Math.floor(Math.random() * sampleSuggestions.length)];
}

export function generateRandomId(): string {
  return Math.random().toString(36).substr(2, 9);
}
