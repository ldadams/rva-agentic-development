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
      code: `# Production MCP Setup with Multiple Org Servers

from langchain_openai import ChatOpenAI
from langchain_mcp_adapters import MultiServerMCPClient
from langgraph.prebuilt import create_react_agent
from langchain_core.messages import HumanMessage
import asyncio
import os

# Production MCP server configuration
org_mcp_servers = {
    "docs": {
        "url": "https://docs.yourorg.com/mcp",
        "transport": "sse",
        "headers": {"Authorization": f"Bearer {os.environ['ORG_API_KEY']}"}
    },
    "services": {
        "command": "python",
        "args": ["service_catalog_server.py"],
        "transport": "stdio",
        "env": {"SERVICE_DB_URL": os.environ["SERVICE_DB_URL"]}
    },
    "adr": {
        "url": "https://adr.yourorg.com/mcp", 
        "transport": "sse"
    }
}

async def setup_production_agent():
    """Setup production agent with all org MCP servers."""
    
    # Load tools from all org servers
    async with MultiServerMCPClient(org_mcp_servers) as client:
        org_tools = client.get_tools()
        print(f"Loaded {len(org_tools)} tools from {len(org_mcp_servers)} org servers")
        
        # List available tools
        for tool in org_tools:
            print(f"  - {tool.name}: {tool.description}")
    
    # Create production agent
    model = ChatOpenAI(model="gpt-4o", openai_api_key=os.environ["OPENAI_API_KEY"])
    
    agent = create_react_agent(
        model=model,
        tools=org_tools,
        prompt="You are an org workflow assistant with access to docs, services, and ADRs."
    )
    
    return agent`,
      language: "python"
    },
    {
      filename: "agent_usage.py",
      code: `# Using the MCP Agent in Production

import asyncio
from langchain_core.messages import HumanMessage

async def main():
    # Setup agent with all org MCP servers
    agent = await setup_production_agent()
    
    # Example 1: Knowledge request (routes to docs/ADR search)
    knowledge_result = agent.invoke({
        "messages": [HumanMessage(content="How does our authentication system work?")]
    })
    print("Knowledge query result:", knowledge_result["messages"][-1].content)
    
    # Example 2: Workflow request (routes to service catalog)
    workflow_result = agent.invoke({
        "messages": [HumanMessage(content="Who owns the payment service and what's their Slack channel?")]
    })
    print("Workflow query result:", workflow_result["messages"][-1].content)
    
    # Example 3: Complex multi-tool request
    complex_result = agent.invoke({
        "messages": [HumanMessage(content="Analyze ADR-156 risks and find affected service owners")]
    })
    print("Complex query result:", complex_result["messages"][-1].content)

# Run the examples
if __name__ == "__main__":
    asyncio.run(main())

# Agent automatically:
# 1. Classifies intent (knowledge vs workflow)
# 2. Routes to appropriate MCP server
# 3. Executes tools and returns structured results`,
      language: "python"
    }
  ],
  note: "ToolNode + MCP integration = powerful org-specific agents"
};
