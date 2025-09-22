import type { SlideProps } from '../types';

// Slide 5 — MCP Tools + LangGraph Integration
export const slide5: SlideProps = {
  title: "Model Context Protocol (MCP) + LangGraph",
  content: [
    "Model Context Protocol (MCP) Resources expose data (read-only information)",
    "Model Context Protocol (MCP) Tools perform actions (functions with side effects)",
    "LangGraph + FastMCP: resources directly, tools via agent"
  ],
  codeTabs: [
    {
      filename: "mcp_server.py",
      code: `# Generic MCP Server Pattern

from fastmcp import FastMCP

mcp = FastMCP("Example Server")

# Resources expose data (read-only)
@mcp.resource("data/items")
def get_items():
    return [
        {"id": "item1", "name": "Example Item", "status": "active"},
        {"id": "item2", "name": "Another Item", "status": "pending"}
    ]

@mcp.resource("config/settings")
def get_settings():
    return {
        "api_version": "v1",
        "rate_limit": 1000,
        "features": ["feature_a", "feature_b"]
    }

# Dynamic resource with parameters
@mcp.resource("items/{item_id}")
def get_item_details(item_id: str):
    return {
        "id": item_id,
        "details": f"Details for {item_id}",
        "metadata": {"created": "2024-01-01"}
    }

# Tools perform actions
@mcp.tool
def process_item(item_id: str, action: str) -> str:
    return {
        "result": f"Processed {item_id} with action: {action}",
        "status": "completed"
    }`,
      language: "python"
    },
    {
      filename: "mcp_client.py",
      code: `# Basic MCP Client Usage

from fastmcp import FastMCP

async def use_mcp_server():
    async with FastMCP.client("mcp_server.py") as client:
        
        # Read resources (data access)
        items = await client.read_resource("data/items")
        settings = await client.read_resource("config/settings") 
        item1_details = await client.read_resource("items/item1")
        
        # Call tools (actions)
        result = await client.call_tool("process_item", {
            "item_id": "item1",
            "action": "validate"
        })
        
        return {
            "items": items.content,
            "settings": settings.content,
            "details": item1_details.content,
            "action_result": result.content
        }`,
      language: "python"
    },
    {
      filename: "langgraph_integration.py", 
      code: `# LangGraph with MCP Integration

from langgraph.prebuilt import create_react_agent
from langchain_openai import ChatOpenAI
from fastmcp import FastMCP

async def create_agent_with_mcp(user_prompt: str):
    # Connect to MCP server
    async with FastMCP.client("mcp_server.py") as mcp_client:
        
        # Get MCP tools for LangGraph
        mcp_tools = await mcp_client.list_tools()
        
        # Convert to LangChain tools
        langchain_tools = []
        for tool in mcp_tools:
            def make_func(tool_name):
                async def func(**kwargs):
                    result = await mcp_client.call_tool(tool_name, kwargs)
                    return result.content
                return func
            langchain_tools.append(make_func(tool.name))
        
        # Create agent
        llm = ChatOpenAI(model="gpt-4o")
        agent = create_react_agent(llm, langchain_tools)
        
        # Use agent with user input (it can call MCP tools automatically)
        result = await agent.ainvoke({
            "messages": [user_prompt]
        })
        
        return result

# Usage: await create_agent_with_mcp("Process item1 with validation action")`,
      language: "python"
    }
  ],
  note: "Generic MCP integration patterns • Foundation for org-specific implementations"
};
