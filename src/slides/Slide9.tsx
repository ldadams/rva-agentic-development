import type { SlideProps } from '../types';

// Slide 9 — Pitfalls & Debugging
export const slide9: SlideProps = {
  title: "Pitfalls & Debugging",
  content: [
    "Simple guards new engineers can use immediately",
    "Budget limits, timeouts, retry caps, input validation", 
    "Log execution patterns and errors for analysis",
    "Use any LLM (ChatGPT, Claude, Gemini) to identify improvements"
  ],
  codeTabs: [
    {
      filename: "guards.py",
      code: `# Simple Guards for New Engineers Building Agents

# 1. Call Budget Guards (Prevent Runaway Costs)
def check_budget(state: AgentState) -> str:
    """Prevent expensive runaway API calls."""
    if state.get("api_calls", 0) >= 10:  # Simple limit
        return "budget_exceeded"
    return "continue"

# 2. Timeout Guards (Prevent Hanging)
import asyncio
async def with_timeout(tool_call, timeout_sec=30):
    """Prevent tools from hanging indefinitely."""
    try:
        return await asyncio.wait_for(tool_call, timeout_sec)
    except asyncio.TimeoutError:
        return {"error": "Tool timed out after 30s"}

# 3. Retry Limits (Prevent Endless Loops)
def check_retries(state: AgentState, max_retries=3) -> str:
    """Prevent infinite retry loops."""
    retries = state.get("retries", 0)
    if retries >= max_retries:
        return "max_retries_exceeded" 
    return "continue"

# 4. Input Validation (Prevent Tool Errors)
def validate_tool_input(tool_name: str, args: dict) -> bool:
    """Validate tool inputs before execution."""
    if tool_name == "search_docs" and not args.get("query"):
        return False
    if tool_name == "get_owner" and not args.get("service_name"):
        return False
    return True

# These guards address real problems new engineers encounter!`,
      language: "python"
    },
    {
      filename: "debug_prompt.py", 
      code: `# Using Logs to Improve Your Agents

DEBUG_PROMPT = """
You are an expert in agent reliability and debugging.

Review these agent execution logs and help me improve the system:

{agent_logs}

Please identify:
1. Patterns that suggest missing guardrails
2. Steps that seem to repeat or loop unnecessarily  
3. Places where the agent gets stuck or confused
4. Opportunities to add timeouts, budgets, or validation

Provide specific, actionable recommendations for improvement.
"""

# Usage Examples:
# - Paste logs into ChatGPT/Claude/Gemini with this prompt
# - Include error traces, state transitions, tool calls
# - Get back concrete suggestions for guards and improvements
# - Iterate on agent design based on real execution patterns

# Log anything useful: errors, state changes, tool selections, timing
# LLMs are great at spotting patterns humans miss`,
      language: "python"
    }
  ],
  note: "Essential guardrails for production agents • LLM-assisted debugging patterns"
};
