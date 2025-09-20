import { useEffect, useRef } from 'react';
import Prism from 'prismjs';

// Import Prism themes and languages
import 'prismjs/themes/prism-tomorrow.css'; // Dark theme
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-typescript';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export default function CodeBlock({ code, language = 'python', title = 'Code' }: CodeBlockProps) {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      // Clear previous highlighting to prevent accumulation
      codeRef.current.innerHTML = code;
      Prism.highlightElement(codeRef.current);
    }
  }, [code, language]);

  return (
    <div className="w-full mx-auto my-8">
      <div className="overflow-hidden rounded-lg border" style={{ 
        backgroundColor: 'var(--vscode-code-bg)', 
        borderColor: 'var(--vscode-border)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }}>
        {/* VS Code-style header */}
        <div className="px-4 py-3 flex items-center gap-3 border-b font-mono text-sm" style={{
          backgroundColor: 'var(--vscode-sidebar)',
          borderBottomColor: 'var(--vscode-border)',
          color: 'var(--vscode-text)'
        }}>
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="ml-3 font-medium" style={{ color: 'var(--vscode-text)' }}>
            {title}
          </span>
        </div>
        
        {/* VS Code-style code content */}
        <div className="relative">
          <div className="overflow-auto max-h-[60vh] p-6">
            <pre 
              className="!m-0 !p-0 font-mono leading-relaxed whitespace-pre"
              style={{ 
                backgroundColor: 'var(--vscode-code-bg)',
                color: 'var(--vscode-code-text)',
                fontSize: '14px',
                lineHeight: '1.5',
                tabSize: 4
              }}
            >
              <code 
                ref={codeRef}
                className={`language-${language} block`}
                style={{ 
                  backgroundColor: 'transparent',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word'
                }}
              >
                {code}
              </code>
            </pre>
          </div>
          
          {/* VS Code-style scroll indicator */}
          <div 
            className="absolute bottom-2 right-2 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              backgroundColor: 'var(--vscode-sidebar)',
              color: 'var(--vscode-text)',
              border: '1px solid var(--vscode-border)'
            }}
          >
            Scroll for more ↓
          </div>
        </div>
      </div>
    </div>
  );
}
