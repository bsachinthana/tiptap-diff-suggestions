import './shared/styles.css';
import '../dist/sample.css';
import './custom-theme.css';

import { clearLog } from './shared/utils.js';
import { createBasicEditor } from './components/basic-editor.js';
import { createCustomToolbarEditor } from './components/custom-toolbar.js';
import { createThemedEditor, type Theme } from './components/themed-editor.js';
import { createProgrammaticEditor } from './components/programmatic.js';

// Initialize all editors
const basicEditor = createBasicEditor('#basic-editor', 'basic-log');
const customEditor = createCustomToolbarEditor('#custom-editor', 'custom-log');
const themedEditor = createThemedEditor('#themed-editor', 'light', 'themed-log');
const programmaticEditor = createProgrammaticEditor('#programmatic-editor', 'programmatic-log');

// Tab switching functionality
function switchTab(tabName: string) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.tab-button').forEach(el => el.classList.remove('active'));
  
  document.getElementById(`${tabName}-tab`)?.classList.remove('hidden');
  document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');
}

// Global functions for HTML
(window as any).switchTab = switchTab;
(window as any).clearLog = clearLog;
(window as any).addSample = basicEditor.addSample;
(window as any).addGrammarSuggestion = programmaticEditor.addGrammarSuggestion;
(window as any).switchTheme = (theme: Theme) => themedEditor.switchTheme(theme);

// Make editors available for debugging
(window as any).editors = {
  basic: basicEditor.editor,
  custom: customEditor.editor,
  themed: themedEditor.editor,
  programmatic: programmaticEditor.editor,
};

// Initialize with basic tab
switchTab('basic');