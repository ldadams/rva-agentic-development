import type { SlideProps } from '../types';

// Slide 4 — Intent → Route (Workflow vs RAG)
export const slide4: SlideProps = {
  title: "Intent → Route (Workflow vs RAG)",
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

🔍 KNOWLEDGE REQUEST:
- User is asking a question that can be answered with existing documentation
- Examples: "How does our auth service work?", "What's our deployment process?", 
  "Who decided to use Redis?", "What are the performance requirements?"
- Route to: RAG system (search docs, ADRs, service catalog)

⚙️ WORKFLOW REQUEST:  
- User wants to perform an organizational action or workflow
- Examples: "Review this ADR for risks", "Find who owns the payment service",
  "Generate update for the mobile team", "Create incident response plan"
- Route to: Workflow system (execute org-specific tools)

INSTRUCTIONS:
1. Read the user request carefully
2. Determine if they want information (knowledge) or action (workflow)
3. Respond with EXACTLY ONE WORD: "knowledge" or "workflow"
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
    intent: Literal["knowledge", "workflow"]
    route_decision: str

async def classify_and_route(user_prompt: str) -> DevState:
    """Single LLM call to classify intent and route deterministically."""
    
    model = ChatOpenAI(model="gpt-4o")
    
    # Step 1: Get LLM classification
    response = await model.ainvoke(INTENT_CLASSIFIER_PROMPT.format(user_prompt=user_prompt))
    intent = response.content.strip().lower()
    
    # Step 2: Deterministic routing (no LLM needed)
    def route_guard(intent: str) -> str:
        if intent == "knowledge":
            return "rag_path"      # → Search docs, ADRs, service catalog
        elif intent == "workflow":
            return "workflow_path" # → Execute org-specific actions
        else:
            return "clarification_needed"
    
    route = route_guard(intent)
    
    return {
        "user_prompt": user_prompt,
        "intent": intent,
        "route_decision": route
    }

# Example usage:
# result = await classify_and_route("Who owns the auth service?")
# → {"intent": "workflow", "route_decision": "workflow_path"}
#
# result = await classify_and_route("How does our auth system work?") 
# → {"intent": "knowledge", "route_decision": "rag_path"}`,
      language: "python"
    }
  ],
  diagram: "/diagrams/dark_prompt_intent_route.svg",
  note: "Single classification call + deterministic routing prevents loops"
};
