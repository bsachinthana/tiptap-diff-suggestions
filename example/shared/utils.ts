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
  return Math.random().toString(36).substring(2, 9);
}


export const checkSvgIcon = `<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 11.917 9.724 16.5 19 7.5"/>
</svg>`;

export const cancelSvgIcon = `<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>
</svg>
`;

export const infoSvgIcon = `<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
</svg>`;
