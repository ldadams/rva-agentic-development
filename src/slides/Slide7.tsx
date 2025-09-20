import type { SlideProps } from '../types';

// Slide 7 — RAG Path (Knowledge Lookup)
export const slide7: SlideProps = {
  title: "RAG Path (Knowledge Lookup)",
  content: [
    "MCP resources: docs, ADRs, service catalog",
    "LangGraph ToolNode handles MCP resource access", 
    "Grounded responses with resource citations"
  ],
  code: `# RAG with MCP Server at https://localhost/mcp

from mcp import ClientSession, HttpTransport
import json

# Connect to org MCP server
mcp_transport = HttpTransport("https://localhost/mcp")

async def search_org_knowledge(query: str) -> str:
    """Search org knowledge via MCP server at https://localhost/mcp"""
    
    async with ClientSession(mcp_transport) as client:
        # Use MCP server's search_documentation tool
        search_result = await client.call_tool("search_documentation", {
            "query": query,
            "include_adrs": True,
            "include_services": True,
            "max_results": 10
        })
        
        # Get full content for top results
        detailed_results = []
        for doc in search_result["documents"][:3]:
            content = await client.read_resource(doc["uri"])
            detailed_results.append({
                "uri": doc["uri"],
                "title": doc["title"],
                "snippet": content[:300] + "...",
                "relevance": doc["score"]
            })
        
        return json.dumps(detailed_results, indent=2)

# MCP server provides unified access to:
# - docs:// resources (documentation)
# - adr:// resources (architecture decisions)  
# - service:// resources (service catalog)`,
  note: "MCP resources provide org-specific knowledge access"
};
