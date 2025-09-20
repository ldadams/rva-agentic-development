import type { SlideProps } from '../types';

// Slide 6 — MCP Tools + LangGraph Integration
export const slide6: SlideProps = {
  title: "MCP Tools + LangGraph Integration",
  content: [
    "MultiServerMCPClient connects to multiple org servers",
    "LLM prompt output specifies which tool to call",
    "ToolNode executes the selected MCP tool automatically"
  ],
  codeTabs: [
    {
      filename: "mcp_server_tools.py",
      code: `# Simple MCP Tool Example

from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool
import json

# Create MCP server instance
app = Server("org-tools")

@app.tool("get_service_ownership")
async def get_service_ownership(service_name: str) -> str:
    """Find who owns a service and their contact information."""
    
    # This would connect to your service catalog
    service_data = {
        "service": service_name,
        "owner": "alice@yourorg.com",
        "team": "platform-team", 
        "slack_channel": "#platform-support",
        "oncall": "bob@yourorg.com",
        "repo": f"https://github.com/yourorg/{service_name}",
        "runbook": f"https://docs.yourorg.com/services/{service_name}"
    }
    
    return json.dumps(service_data, indent=2)

@app.tool("search_documentation") 
async def search_docs(query: str) -> str:
    """Search internal documentation and ADRs."""
    
    # This would search your docs/wiki/ADR system
    results = [
        {"title": "Auth Service Architecture", "url": "https://docs.yourorg.com/auth"},
        {"title": "ADR-123: JWT Implementation", "url": "https://adr.yourorg.com/123"}
    ]
    
    return json.dumps(results, indent=2)

# Run MCP server: python mcp_server_tools.py
if __name__ == "__main__":
    stdio_server(app)`,
      language: "python"
    },
    {
      filename: "tool_selection_prompt.py",
      code: `# Tool Selection Prompt Output Example

TOOL_SELECTION_PROMPT = """
You are a tool selector. Choose exactly ONE tool for this request.

Available tools from MultiServerMCPClient:
- search_documentation(query): Search internal docs and ADRs
- get_service_ownership(service_name): Find service owner and team info  
- analyze_adr_risks(adr_id): Analyze architecture decision risks

User request: {user_input}

Return ONLY the tool call in this format:
{{"tool": "tool_name", "args": {{"param": "value"}}}}
"""

# Example LLM output for "Who owns the auth service?":
llm_output = '''
{
  "tool": "get_service_ownership",
  "args": {
    "service_name": "auth-service"
  }
}
'''

# This structured output is then passed to ToolNode for execution
import json
selected_tool = json.loads(llm_output)
print(f"Selected tool: {selected_tool['tool']}")
print(f"Tool args: {selected_tool['args']}")`,
      language: "python"
    },
    {
      filename: "toolnode_execution.py",
      code: `# ToolNode Executes Selected MCP Tool

from langgraph.prebuilt import ToolNode
from langchain_mcp_adapters import MultiServerMCPClient
import json

# 1. MultiServerMCPClient loads tools from org servers
async with MultiServerMCPClient(org_mcp_servers) as client:
    mcp_tools = client.get_tools()

# 2. ToolNode handles tool execution
tool_node = ToolNode(mcp_tools)

# 3. LLM selected this tool (from previous tab):
selected_tool_call = {
    "tool": "get_service_ownership",
    "args": {"service_name": "auth-service"}
}

# 4. ToolNode executes the MCP tool automatically
class State(TypedDict):
    tool_calls: List[dict]
    tool_results: List[str]

# Simulate tool execution
state = {
    "tool_calls": [selected_tool_call],
    "tool_results": []
}

# ToolNode execution
result_state = await tool_node.ainvoke(state)

# 5. ToolNode returns structured results:
print("Tool execution result:", result_state["tool_results"][0])
# Output: {"service": "auth-service", "owner": "alice@org.com", 
#          "team": "platform", "slack": "#platform-team"}

# Flow: Prompt → Tool Selection → ToolNode → MCP Server → Results`,
      language: "python"
    }
  ],
  note: "Production MCP setup with multiple servers • Automatic tool discovery"
};
