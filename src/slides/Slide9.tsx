import type { SlideProps } from '../types';

// Slide 9 — Pitfalls & Debugging
export const slide9: SlideProps = {
  title: "Pitfalls & Debugging",
  content: [
    "Recursive tool loops → add budgets & termination guards",
    "Non-idempotent tools → add dry-run mode", 
    "Logs: correlation IDs, state diffs, retries",
    "Debug with LLMs: paste JSONL logs → get guard/route fixes"
  ],
  codeTabs: [
    {
      filename: "guards.py",
      code: `# Budget guards
def check_budget(state: DevState) -> str:
    if state["budget_calls"] <= 0:
        return "budget_exceeded"
    return "continue"

# Timeout guards  
import asyncio
async def with_timeout(coro, timeout_sec: float):
    try:
        return await asyncio.wait_for(coro, timeout_sec)
    except asyncio.TimeoutError:
        return {"error": "timeout"}

# Idempotency
async def idempotent_tool(state, tool_fn, cache_key):
    if cache_key in state.get("cache", {}):
        return state["cache"][cache_key]
    
    result = await tool_fn(state)
    state.setdefault("cache", {})[cache_key] = result
    return result`,
      language: "python"
    },
    {
      filename: "debug_prompt.py", 
      code: `DEBUG_PROMPT = """
Given execution logs, identify:
1. Missing guards
2. Non-idempotent tools  
3. Termination conditions
4. Retry policies

Return prioritized fix list.

<LOGS>
{jsonl_logs}
</LOGS>
"""

# Usage: paste your agent_logs.jsonl content
# get back specific code fixes and improvements`,
      language: "python"
    }
  ],
  note: "Start small • Add observability • Use LLMs to debug your agents"
};
