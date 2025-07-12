// Main entry point for the TipTap Diff Suggestions extension
export { DiffSuggestion } from './extension';
export { DiffSuggestionNodeView } from './nodeview';
export { commands, defaultHandleSuggestion } from './commands';
export * from './types';

// Default export for convenience
import { DiffSuggestion } from './extension';
export default DiffSuggestion;
