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
      filename: "mcp_agent_setup.py",
      code: `# MCP Agent Setup with LangGraph

from langchain_openai import ChatOpenAI
from mcp import ClientSession, StdioServerParameters
from langchain_mcp_adapters.tools import load_mcp_tools
from langgraph.prebuilt import create_react_agent
from langgraph.graph import StateGraph, START, END
import os
from dotenv import load_dotenv

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
model = ChatOpenAI(model="gpt-4o")

async def setup_agent_with_mcp_tools():
    """Setup agent with MCP tools for org-specific workflows."""
    
    # Connect to your MCP server (assuming it's running)
    async with ClientSession(StdioServerParameters(
        command="python", 
        args=["org_tools_server.py"],
        name="OrgTools"
    )) as client:
        
        # Load MCP tools automatically
        mcp_tools = await load_mcp_tools(client)
        
        # Create agent with MCP tools
        agent = create_react_agent(
            model, 
            mcp_tools,
            state_modifier=INTENT_CLASSIFIER_PROMPT
        )
        
        return agent

# Usage: agent handles both classification and tool execution
# MCP tools registered automatically from server`,
      language: "python"
    }
  ],
  diagram: "/diagrams/dark_prompt_intent_route.svg",
  note: "Proper MCP registration + clear prompt separation"
};
