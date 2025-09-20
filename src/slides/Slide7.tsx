import type { SlideProps } from '../types';

// Slide 7 — RAG Path (Knowledge Lookup)
export const slide7: SlideProps = {
  title: "RAG Path (Knowledge Lookup)",
  content: [
    "MCP resources: docs, ADRs, service catalog",
    "create_react_agent integrates MCP tools automatically", 
    "Grounded responses with resource citations"
  ],
  code: `# RAG Knowledge Search with MCP

from langchain_mcp_adapters import MultiServerMCPClient
from langchain_core.messages import HumanMessage
import asyncio

# MCP servers for knowledge sources
knowledge_servers = {
    "internal_docs": {
        "command": "python",
        "args": ["docs_search_server.py"],
        "transport": "stdio"
    },
    "adr_system": {
        "url": "https://adr.yourorg.com/mcp",
        "transport": "sse" 
    }
}

async def rag_knowledge_search():
    """Demonstrate RAG with MCP knowledge servers."""
    
    async with MultiServerMCPClient(knowledge_servers) as client:
        # Get knowledge search tools
        knowledge_tools = client.get_tools()
        print(f"Knowledge tools available: {[t.name for t in knowledge_tools]}")
        
        # Create RAG agent
        model = ChatOpenAI(model="gpt-4o", openai_api_key=os.environ["OPENAI_API_KEY"])
        rag_agent = create_react_agent(
            model=model,
            tools=knowledge_tools,
            prompt="Search internal knowledge and provide detailed answers with citations."
        )
        
        # Test knowledge search
        result = rag_agent.invoke({
            "messages": [HumanMessage(content="What are the security requirements for our API gateway?")]
        })
        
        return result["messages"][-1].content

# Knowledge sources automatically accessible via MCP
# Agent provides grounded answers with proper citations`,
  note: "RAG with MultiServerMCPClient • Grounded answers from org knowledge"
};
