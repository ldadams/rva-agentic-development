import type { SlideProps } from '../types';

// Slide 5 — ReAct vs Tool-Selecting Prompt
export const slide5: SlideProps = {
  title: "ReAct vs Tool-Selecting Prompt", 
  content: [
    "What is ReAct Agent",
    "ReAct: model plans every step → hidden state, tool loops",
    "Better: single LLM call selects tool, graph executes deterministically"
  ],
  layout: 'bullets-left-code-right',
  codeTabs: [
    {
      filename: "react_prompt.py",
      code: `# ReAct Prompt (loop-prone)
REACT_PROMPT = """
You are an assistant. Think step-by-step and use tools as needed until done.

Available tools:
- search_docs: Search documentation  
- summarize_adr: Summarize architecture decisions
- find_owner: Find service ownership

User: {prompt}

Think through this step by step. Use tools as needed.
Continue until you have a complete answer.
"""

# Problems:
# - Model decides when to stop
# - Hidden state in conversation
# - Can loop infinitely
# - Hard to enforce business rules`,
      language: "python"
    },
    {
      filename: "tool_select_prompt.py",
      code: `# Tool-Select Prompt (structured)  
TOOL_SELECT_PROMPT = """
You are a workflow router. Choose EXACTLY ONE tool.

TOOLS:
- search_docs(query): Search documentation
- summarize_adr(doc_id): Summarize architecture decision  
- find_owner(service_name): Find service ownership

User: {prompt}

Return STRICT JSON:
{
  "tool": "<tool_name>", 
  "args": {...}, 
  "reason": "<brief explanation>"
}
"""

# Benefits:
# - Single decision point
# - Structured output
# - Graph handles execution
# - Easy to add guards and validation`,
      language: "python"
    }
  ],
  note: "Structured tool selection → predictable execution paths"
};
