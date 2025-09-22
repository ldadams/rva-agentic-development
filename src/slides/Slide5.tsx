import type { SlideProps } from '../types';

// Slide 5 — Agent Types
export const slide5: SlideProps = {
  title: "Agent Types", 
  content: [
    "State Graphs: explicit nodes & edges, typed state, deterministic routing",
    "ReAct: model plans every step → hidden state, tool loops",
    "ReAct pros and cons"
  ],
  layout: 'bullets-left-code-right',
  codeTabs: [
    {
      filename: "state_graph_approach.py",
      code: `# State Graph Approach (structured)  
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
    },
    {
      filename: "react_approach.py",
      code: `# ReAct Approach (loop-prone)
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
    }
  ],
  note: "Structured prompts prevent ReAct loops • Side-by-side: concepts + code"
};
