import { useState, useEffect } from 'react';
import CodeBlock from './CodeBlock';
import TabbedCodeBlock from './TabbedCodeBlock';
import type { SlideProps } from './types';
import { 
  slide1, slide2, slide3, slide4, slide5, 
  slide6, slide7, slide8, slide9, slide10 
} from './slides';

function Slide({ title, content, code, codeTabs, diagram, note }: SlideProps) {
  return (
    <div className="w-full h-full flex flex-col justify-start px-12 md:px-16 lg:px-20 py-8 md:py-12 overflow-y-auto" style={{ padding: '5px' }}>
      <div className="max-w-7xl mx-auto w-full space-y-8 flex-1 flex flex-col">
        {/* Title - Always present */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight" style={{ color: 'var(--vscode-text)' }}>
            {title}
          </h1>
        </div>
        
        {/* Content area - flexible */}
        <div className="flex-1 flex flex-col justify-center space-y-8">
          {/* Content bullets - only for slides WITHOUT side-by-side layout */}
          {content && content.length > 0 && 
           !title.includes("Lessons Learned Getting Started") &&
           !title.includes("State Graph vs ReAct") && 
           !title.includes("MCP Tools + LangGraph") &&
           !title.includes("RAG Path") &&
           !title.includes("Workflow Path") &&
           !title.includes("Pitfalls & Debugging") && (
            <div className="w-full">
              <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                {content.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex items-start"
                    style={{ 
                      marginBottom: '48px',
                      paddingLeft: '30px',
                      paddingRight: '30px',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ 
                      width: '10px', 
                      flexShrink: 0, 
                      display: 'flex', 
                      justifyContent: 'flex-start',
                      paddingTop: '8px',
                      paddingLeft: '8px'
                    }}>
                      <span style={{ 
                        fontSize: '28px', 
                        fontWeight: 'bold',
                        color: '#007acc',
                        lineHeight: '1'
                      }}>
                        •
                      </span>
                    </div>
                    <span style={{ 
                      fontSize: '28px',
                      lineHeight: '1.4',
                      color: '#cccccc',
                      flex: 1,
                      marginLeft: '24px'
                    }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Diagram and Bullets - side by side for slide 3 */}
          {title.includes("Lessons Learned Getting Started") && content && content.length > 0 && diagram && !code && !codeTabs ? (
            <div className="w-full flex gap-8 items-start">
              {/* Diagram - left side */}
              <div className="w-1/2 flex items-center justify-center">
                <img 
                  src={diagram} 
                  alt={`Diagram for ${title}`}
                  className="w-full h-auto rounded-lg border border-gray-600 shadow-lg"
                  style={{ maxHeight: '60vh', objectFit: 'contain' }}
                />
              </div>
              
              {/* Bullets - right side */}
              <div className="w-1/2" style={{ paddingLeft: '60px' }}>
                {content.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex items-start"
                    style={{ 
                      marginBottom: '40px',
                      paddingLeft: '20px',
                      paddingRight: '20px'
                    }}
                  >
                    <div style={{ 
                      width: '28px', 
                      flexShrink: 0, 
                      display: 'flex', 
                      justifyContent: 'flex-start',
                      paddingTop: '8px'
                    }}>
                      <span style={{ 
                        fontSize: '28px', 
                        fontWeight: 'bold',
                        color: '#007acc',
                        lineHeight: '1'
                      }}>
                        •
                      </span>
                    </div>
                    <span style={{ 
                      fontSize: '28px',
                      lineHeight: '1.4',
                      color: '#cccccc',
                      flex: 1,
                      marginLeft: '20px'
                    }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : 
          
          /* Bullets and Code - side by side for slides 5-9 */
          (title.includes("State Graph vs ReAct") || 
            title.includes("MCP Tools + LangGraph") ||
            title.includes("RAG Path") ||
            title.includes("Workflow Path") ||
            title.includes("Pitfalls & Debugging")) && 
           content && content.length > 0 && (code || codeTabs) && !diagram ? (
            <div className="w-full flex gap-8 items-start">
              {/* Bullets - left side */}
              <div className="w-1/2" style={{ paddingLeft: '60px' }}>
                {content.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex items-start"
                    style={{ 
                      marginBottom: '40px',
                      paddingLeft: '20px',
                      paddingRight: '20px'
                    }}
                  >
                    <div style={{ 
                      width: '60px', 
                      flexShrink: 0, 
                      display: 'flex', 
                      justifyContent: 'flex-start',
                      paddingTop: '8px'
                    }}>
                      <span style={{ 
                        fontSize: '28px', 
                        fontWeight: 'bold',
                        color: '#007acc',
                        lineHeight: '1'
                      }}>
                        •
                      </span>
                    </div>
                    <span style={{ 
                      fontSize: '28px',
                      lineHeight: '1.4',
                      color: '#cccccc',
                      flex: 1,
                      marginLeft: '20px'
                    }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Code block - right side */}
              <div className="w-1/2">
                {codeTabs && codeTabs.length > 0 ? (
                  <TabbedCodeBlock key={`${title}-tabs`} tabs={codeTabs} title="State Graph vs ReAct" />
                ) : code ? (
                  <CodeBlock 
                    code={code} 
                    language="python" 
                    title="Code Comparison"
                  />
                ) : null}
              </div>
            </div>
          ) : 
          
          /* Diagram and Code - side by side if both present */
          (code || codeTabs) && diagram ? (
            <div className="w-full flex gap-8 items-start">
              {/* Diagram - left side */}
              <div className="w-1/2 flex items-center justify-center">
                <img 
                  src={diagram} 
                  alt={`Diagram for ${title}`}
                  className="w-full h-auto rounded-lg border border-gray-600 shadow-lg"
                  style={{ maxHeight: '60vh', objectFit: 'contain' }}
                />
              </div>
              {/* Code block - right side */}
              <div className="w-1/2">
                {codeTabs && codeTabs.length > 0 ? (
                  <TabbedCodeBlock key={`${title}-tabs`} tabs={codeTabs} title="Implementation" />
                ) : code ? (
                  <CodeBlock 
                    code={code} 
                    language="python" 
                    title="Code Example"
                  />
                ) : null}
              </div>
            </div>
          ) : (
            /* Code only or Diagram only */
            <>
              {/* Code block only */}
              {(codeTabs && codeTabs.length > 0) || code ? (
                <div className="w-full flex justify-center">
                  <div className="w-full max-w-6xl">
                    {codeTabs && codeTabs.length > 0 ? (
                      <TabbedCodeBlock key={`${title}-tabs`} tabs={codeTabs} title="Implementation" />
                    ) : code ? (
                      <CodeBlock 
                        code={code} 
                        language="python" 
                        title="Code Example"
                      />
                    ) : null}
                  </div>
                </div>
              ) : null}
              
              {/* Diagram only */}
              {diagram && !(code || codeTabs) && (
                <div className="w-full flex justify-center py-8">
                  <div className="max-w-5xl w-full">
                    <img 
                      src={diagram} 
                      alt={`Diagram for ${title}`}
                      className="w-full h-auto rounded-lg border border-gray-600 shadow-lg"
                      style={{ maxHeight: '50vh', objectFit: 'contain' }}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Note - Always at bottom if present */}
        {note && (
          <div className="mt-auto pt-8">
            <p className="text-lg md:text-xl text-gray-400 italic text-center px-8 py-4 bg-gray-800/30 rounded-lg max-w-4xl mx-auto">
              {note}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SlideDeck() {
  const slides: SlideProps[] = [
    slide1,
    slide2, 
    slide3,
    slide4,
    slide5,
    slide6,
    slide7,
    slide8,
    slide9,
    slide10
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    const newSlide = (currentSlide + 1) % slides.length;
    setCurrentSlide(newSlide);
    // updateURL(newSlide); // Temporarily disabled
  };

  const prevSlide = () => {
    const newSlide = (currentSlide - 1 + slides.length) % slides.length;
    setCurrentSlide(newSlide);
    // updateURL(newSlide); // Temporarily disabled
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    // updateURL(index); // Temporarily disabled
  };



  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          nextSlide();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prevSlide();
          break;
        case 'p':
        case 'P':
          e.preventDefault();
          window.print();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, slides.length]);

  return (
    <div className="h-screen w-full overflow-hidden" style={{ backgroundColor: 'var(--vscode-bg)', color: 'var(--vscode-text)' }}>
      {/* VS Code-style progress bar */}
      <div className="h-1 w-full" style={{ backgroundColor: 'var(--vscode-sidebar)' }}>
        <div 
          className="h-full transition-all duration-300"
          style={{ 
            width: `${((currentSlide + 1) / slides.length) * 100}%`,
            backgroundColor: 'var(--vscode-accent)'
          }}
        />
      </div>

      {/* Slide content */}
      <div className="h-full relative">
        <Slide {...slides[currentSlide]} />
        
        {/* Navigation arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/90 backdrop-blur-sm border border-gray-300 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:bg-white transition-all z-10"
          aria-label="Previous slide"
        >
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24" className="text-gray-700">
            <path d="M15.41 16.58L10.83 12l4.58-4.58L14 6l-6 6 6 6z"/>
          </svg>
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/90 backdrop-blur-sm border border-gray-300 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:bg-white transition-all z-10"
          aria-label="Next slide"
        >
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24" className="text-gray-700">
            <path d="M8.59 16.58L13.17 12 8.59 7.42 10 6l6 6-6 6z"/>
          </svg>
        </button>

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 bg-black/60 px-6 py-3 rounded-full backdrop-blur-sm">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white scale-125 shadow-lg'
                  : 'bg-gray-400 hover:bg-gray-300 hover:scale-110'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Status indicator */}
      <div className="fixed bottom-6 right-6 px-4 py-2 bg-black/60 backdrop-blur-sm text-white text-sm font-medium rounded-lg">
        {currentSlide + 1} / {slides.length}
      </div>
    </div>
  );
}
