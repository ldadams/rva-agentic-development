import type { SlideProps } from '../types';

// Slide 6 — MCP Tools + LangGraph Integration
export const slide6: SlideProps = {
  title: "MCP Tools + LangGraph Integration",
  content: [
    "Register MCP resources and tools with LangGraph:",
    "ToolNode automatically handles MCP tool execution",
    "Structured tool calls with proper error handling"
  ],
  codeTabs: [
    {
      filename: "mcp_server_tools.py",
      code: `# MCP Server Running on https://localhost/mcp
# Provides org-specific tools for documentation, services, and ADRs

from mcp import ClientSession, HttpTransport
import json

# Connect to MCP server at https://localhost/mcp
mcp_transport = HttpTransport("https://localhost/mcp")

async def connect_to_org_mcp_server():
    """Connect to the organization's MCP server."""
    
    async with ClientSession(mcp_transport) as client:
        # List available tools from server
        tools = await client.list_tools()
        print(f"Available org tools: {[tool.name for tool in tools]}")
        
        # List available resources
        resources = await client.list_resources()
        print(f"Available resources: {[r.uri for r in resources]}")
        
        return client

# Example tools available on https://localhost/mcp:
# - search_documentation(query)
# - get_service_ownership(service_name) 
# - analyze_adr_risks(adr_id)
# - find_team_contacts(team_name)
# - get_oncall_rotation(service)`,
      language: "python"
    },
    {
      filename: "register_tools.py",
      code: `# Register MCP Tools from https://localhost/mcp

from langchain_openai import ChatOpenAI
from mcp import ClientSession, HttpTransport
from langchain_mcp_adapters.tools import load_mcp_tools
from langgraph.prebuilt import create_react_agent
import os
from dotenv import load_dotenv

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
model = ChatOpenAI(model="gpt-4o")

async def setup_agent_with_mcp_tools():
    """Setup agent with org MCP server running on https://localhost/mcp"""
    
    # Connect to org MCP server at https://localhost/mcp
    mcp_transport = HttpTransport("https://localhost/mcp")
    
    async with ClientSession(mcp_transport) as client:
        # Load all org tools automatically from MCP server
        mcp_tools = await load_mcp_tools(client)
        
        print(f"Loaded {len(mcp_tools)} tools from https://localhost/mcp")
        for tool in mcp_tools:
            print(f"  - {tool.name}: {tool.description}")
        
        # Create agent with all org MCP tools
        agent = create_react_agent(
            model, 
            mcp_tools,
            state_modifier="You are an org workflow assistant with access to internal tools."
        )
        
        return agent

# MCP server at https://localhost/mcp provides:
# search_documentation, get_service_ownership, analyze_adr_risks, etc.`,
      language: "python"
    },
    {
      filename: "graph_setup.py",
      code: `# Build LangGraph with MCP tools
workflow = StateGraph(DevState)

# Add nodes
workflow.add_node("classify_intent", classify_intent_node)
workflow.add_node("select_tool", select_tool_node)
workflow.add_node("execute_tools", tool_node)  # ToolNode handles MCP calls
workflow.add_node("format_response", format_response_node)

# Define edges
workflow.add_edge(START, "classify_intent")
workflow.add_conditional_edges(
    "classify_intent",
    route_guard,
    {"knowledge": "select_tool", "workflow": "select_tool"}
)
workflow.add_edge("select_tool", "execute_tools")
workflow.add_edge("execute_tools", "format_response") 
workflow.add_edge("format_response", END)

# Compile with MCP tool integration
app = workflow.compile()

# Example usage:
# result = await app.ainvoke({
#     "prompt": "Who owns the auth service?",
#     "budget_calls": 3,
#     "trace_id": "req-123"
# })`,
      language: "python"
    }
  ],
  note: "ToolNode + MCP integration = powerful org-specific agents"
};
