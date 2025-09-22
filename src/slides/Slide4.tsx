import type { SlideProps } from '../types';

// Slide 4 — Intent → Route (Workflow vs RAG)
export const slide4: SlideProps = {
  title: "Intent → Tool Selection",
  content: [
    "Single LLM call classifies user intent → deterministic routing"
  ],
  layout: 'code-left-diagram-right',
  codeTabs: [
    {
      filename: "intent_prompt.py",
      code: `# Intent Classification Prompt - Clear & Verbose

INTENT_CLASSIFIER_PROMPT = """
You are an intelligent routing system for developer workflow requests.

Your job is to classify the user's request into exactly ONE of these categories:

📋 SUMMARIZE REQUEST:
- User wants to understand or summarize architecture decisions
- Examples: "Summarize ADR-123", "What are the key points of our JWT decision?",
  "Explain the database migration ADR", "What risks does this ADR have?"
- Route to: Summarize tool (uses RAG internally)

👤 OWNERSHIP REQUEST:  
- User wants to find who owns or is responsible for services
- Examples: "Who owns the payment service?", "Find the auth service owner",
  "Get contact info for the API gateway team", "Who should I ask about Redis?"
- Route to: Find Owner tool

📢 UPDATE REQUEST:
- User wants to create or compose team communications  
- Examples: "Generate update for mobile team", "Compose maintenance notice",
  "Create incident notification", "Draft team announcement"
- Route to: Compose Update tool

INSTRUCTIONS:
1. Read the user request carefully  
2. Classify into exactly one category
3. Respond with EXACTLY ONE WORD: "summarize", "owner", or "update"
4. Do not explain your reasoning - just return the classification

User Request: {user_prompt}

Classification:"""`,
      language: "python"
    },
    {
      filename: "routing_logic.py",
      code: `# Simple Deterministic Routing Logic

from typing import TypedDict, Literal
from langchain_openai import ChatOpenAI

class DevState(TypedDict):
    user_prompt: str
    intent: Literal["summarize", "owner", "update"]
    tool_selected: str

async def classify_and_route(user_prompt: str) -> DevState:
    """Single LLM call to classify intent and route deterministically."""
    
    model = ChatOpenAI(model="gpt-4o")
    
    # Step 1: Get LLM classification
    response = await model.ainvoke(INTENT_CLASSIFIER_PROMPT.format(user_prompt=user_prompt))
    intent = response.content.strip().lower()
    
    # Step 2: Deterministic tool selection (no LLM needed)
    def select_tool(intent: str) -> str:
        if intent == "summarize":
            return "summarize_adr"    # → RAG + LLM summarization
        elif intent == "owner":
            return "find_owner"       # → Lookup service ownership
        elif intent == "update":
            return "compose_update"   # → Generate team communication
        else:
            return "clarification_needed"
    
    tool = select_tool(intent)
    
    return {
        "user_prompt": user_prompt,
        "intent": intent,
        "tool_selected": tool
    }

# Example usage:
# result = await classify_and_route("Who owns the auth service?")
# → {"intent": "owner", "tool_selected": "find_owner"}
#
# result = await classify_and_route("Summarize ADR-123") 
# → {"intent": "summarize", "tool_selected": "summarize_adr"}`,
      language: "python"
    }
  ],
  diagram: "/diagrams/org_workflow_agent.svg",
  note: "Single classification call + deterministic routing prevents loops"
};
