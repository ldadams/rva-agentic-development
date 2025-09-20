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
      code: `# Real MCP Agent Setup with Multiple Servers

from langchain_openai import ChatOpenAI
from langchain_mcp_adapters import MultiServerMCPClient
from langgraph.prebuilt import create_react_agent
from langchain_core.messages import HumanMessage
import os
import asyncio

# Configure MCP servers for your org
client_servers = {
    "documentation": {
        "command": "python",
        "args": ["docs_server.py"],  # Your org docs MCP server
        "transport": "stdio",
    },
    "services": {
        "url": "https://localhost:8000/mcp",  # Service catalog API
        "transport": "sse",
    },
    "workflow": {
        "command": "node", 
        "args": ["workflow_server.js"],  # ADR/team tools
        "transport": "stdio"
    }
}

async def get_org_mcp_tools():
    """Load all org MCP tools from multiple servers."""
    async with MultiServerMCPClient(client_servers) as client:
        tools = client.get_tools()
        print(f"Loaded {len(tools)} org tools from {len(client_servers)} servers")
        return tools

# Initialize model and get tools
model = ChatOpenAI(model="gpt-4o", openai_api_key=os.environ["OPENAI_API_KEY"])
tools = asyncio.run(get_org_mcp_tools())

# Create agent with intent classification and MCP tools
agent_executor = create_react_agent(
    model=model,
    tools=tools,
    prompt=INTENT_CLASSIFIER_PROMPT
)

# Test the agent with a workflow request
result = agent_executor.invoke({
    "messages": [HumanMessage(content="Who owns the auth service and what are the risks in ADR-123?")]
})

print(result["messages"][-1].content)`,
      language: "python"
    }
  ],
  diagram: "/diagrams/dark_prompt_intent_route.svg",
  note: "Proper MCP registration + clear prompt separation"
};
