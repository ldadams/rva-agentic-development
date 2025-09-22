# Slides Structure

Each slide is now in its own file for better organization and maintainability.

## 📁 Files

**Main Presentation:**
- **`Slide1.tsx`** - Title & Setup (agenda overview)
- **`Slide2.tsx`** - Why Agents Beyond Copilot (pain points)
- **`Slide3.tsx`** - Lessons Learned Getting Started (best practices)
- **`Slide4.tsx`** - Intent → Tool Selection (classification code)
- **`Slide5.tsx`** - Model Context Protocol (MCP) + LangGraph (3 tabbed code examples)
- **`Slide6.tsx`** - Implementing Org-Specific Tools (3 tabbed code examples with RAG integrated)  
- **`Slide7.tsx`** - Pitfalls & Debugging (2 tabbed code examples)
- **`Slide8.tsx`** - Takeaways (no code)
- **`Slide9.tsx`** - Questions (Q&A)

**Appendix:**
- **`Slide10.tsx`** - Appendix (title slide)
- **`Slide11.tsx`** - Agent Types (ReAct vs State Graph comparison)

## 🔧 Structure

Each slide file exports a `SlideProps` object with:
- `title` - Main slide heading
- `content` - Array of bullet points (optional)
- `code` - Single code block (optional)
- `codeTabs` - Array of tabbed code blocks (optional)
- `note` - Footer note (optional)

## 📝 Example

```tsx
import type { SlideProps } from '../types';

export const slide1: SlideProps = {
  title: "My Slide Title",
  content: [
    "First bullet point",
    "Second bullet point"
  ],
  code: `print("Single code block")`,
  note: "Optional footer note"
};
```

## 🚀 Usage

All slides are imported and exported through `index.ts`, then used in `SlideDeck.tsx`:

```tsx
import { slide1, slide2, ... } from './slides';

const slides: SlideProps[] = [slide1, slide2, ...];
```

This modular approach makes it easy to:
- Edit individual slides without affecting others
- Reorder slides by changing the import order
- Add/remove slides easily
- Maintain consistent typing with shared `SlideProps` interface
