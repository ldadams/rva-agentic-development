import { useState, useEffect, useRef } from 'react';
import Prism from 'prismjs';

// Import Prism themes and languages
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-typescript';

interface CodeTab {
  filename: string;
  code: string;
  language?: string;
}

interface TabbedCodeBlockProps {
  tabs: CodeTab[];
  title?: string;
}

export default function TabbedCodeBlock({ tabs, title = 'Code' }: TabbedCodeBlockProps) {
  const [activeTab, setActiveTab] = useState(0);
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current && tabs[activeTab]) {
      // Clear previous highlighting
      codeRef.current.innerHTML = tabs[activeTab].code;
      Prism.highlightElement(codeRef.current);
    }
  }, [activeTab, tabs]);

  if (!tabs || tabs.length === 0) return null;

  return (
    <div className="w-full mx-auto my-8">
      <div className="overflow-hidden rounded-lg border" style={{ 
        backgroundColor: 'var(--vscode-code-bg)', 
        borderColor: 'var(--vscode-border)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }}>
        {/* VS Code-style header with tabs */}
        <div style={{ backgroundColor: 'var(--vscode-sidebar)' }}>
          {/* Window controls and title */}
          <div className="px-4 py-3 flex items-center gap-3 border-b font-mono text-sm" style={{
            borderBottomColor: 'var(--vscode-border)',
            color: 'var(--vscode-text)'
          }}>
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <span className="ml-3 font-medium">{title}</span>
          </div>
          
          {/* VS Code-style file tabs */}
          <div className="flex overflow-x-auto">
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className="px-4 py-2 text-sm font-mono whitespace-nowrap border-r transition-all relative"
                style={{
                  backgroundColor: activeTab === index ? 'var(--vscode-code-bg)' : 'var(--vscode-sidebar)',
                  color: activeTab === index ? 'var(--vscode-text)' : '#858585',
                  borderRightColor: 'var(--vscode-border)',
                  borderBottomColor: activeTab === index ? 'var(--vscode-accent)' : 'transparent',
                  borderBottomWidth: '2px',
                  borderBottomStyle: 'solid',
                  paddingRight: '1.5rem',
                  paddingLeft: '1.5rem',
                  cursor: 'pointer',
                  fontWeight: activeTab === index ? '600' : '400',
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== index) {
                    e.currentTarget.style.color = 'var(--vscode-text)';
                    e.currentTarget.style.backgroundColor = '#2d2d30';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== index) {
                    e.currentTarget.style.color = '#858585';
                    e.currentTarget.style.backgroundColor = 'var(--vscode-sidebar)';
                  }
                }}
              >
                {tab.filename}
              </button>
            ))}
          </div>
        </div>
        
        {/* Code content with scrolling */}
        <div className="relative group">
          <div className="overflow-auto max-h-[60vh] p-6">
            <pre className="!bg-transparent !m-0 !p-0 font-mono text-sm leading-relaxed whitespace-pre" style={{ tabSize: 2 }}>
              <code 
                ref={codeRef}
                className={`language-${tabs[activeTab].language || 'python'} !bg-transparent block`}
                style={{ 
                  fontSize: '14px', 
                  lineHeight: '1.6',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word'
                }}
              >
                {tabs[activeTab].code}
              </code>
            </pre>
          </div>
          
          {/* Scroll indicator */}
          <div className="absolute bottom-2 right-2 bg-gray-700/80 text-gray-300 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            {tabs[activeTab].filename} • Scroll for more ↓
          </div>
        </div>
      </div>
    </div>
  );
}
