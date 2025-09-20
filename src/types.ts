export interface CodeTab {
  filename: string;
  code: string;
  language?: string;
}

export interface SlideProps {
  title: string;
  content?: string[];
  code?: string;
  codeTabs?: CodeTab[];
  diagram?: string; // Path to SVG diagram
  layout?: 'default' | 'bullets-left-code-right' | 'code-left-diagram-right';
  note?: string;
}
