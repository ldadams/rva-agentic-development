import type { SlideProps } from '../types';

// Slide 6 — Implementing Org-Specific Tools
export const slide6: SlideProps = {
  title: "Implementing Org-Specific Tools",
  content: [
    "Three core organizational tools: Summarize Architecture Decision Records (ADR), Find Owner, Compose Update",
    "Agent routes to ONE tool per request → deterministic execution", 
    "Model Context Protocol (MCP) provides org-specific data and functions"
  ],
  codeTabs: [
    {
      filename: "summarize_adr.py",
      code: `# Summarize ADR with RAG

from fastmcp import FastMCP
from langchain.vectorstores import Chroma
from langchain.embeddings import OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import ChatOpenAI

adr_mcp = FastMCP("ADR Knowledge")

# Vector store for ADR documentation
@adr_mcp.resource("adrs/vectorstore")
def setup_adr_vectorstore():
    # Load and chunk ADR documents
    docs = ["ADR-123: JWT Implementation...", "ADR-124: Database Migration..."]
    splitter = RecursiveCharacterTextSplitter(chunk_size=500)
    chunks = splitter.create_documents(docs)
    
    # Create vector store
    vectorstore = Chroma.from_documents(chunks, OpenAIEmbeddings())
    return vectorstore

# RAG-powered ADR summarization tool
@adr_mcp.tool
async def summarize_adr_with_rag(adr_id: str, question: str = "Summarize this ADR") -> str:
    # Get vector store
    vectorstore = setup_adr_vectorstore()
    
    # Retrieve relevant chunks (real RAG)
    retriever = vectorstore.as_retriever(search_kwargs={"k": 3})
    relevant_chunks = retriever.get_relevant_documents(f"ADR-{adr_id} {question}")
    
    # Assemble context from retrieved chunks
    context = "\\n\\n".join([chunk.page_content for chunk in relevant_chunks])
    
    # Generate summary with LLM
    llm = ChatOpenAI(model="gpt-4o")
    response = await llm.ainvoke([
        {"role": "system", "content": "Summarize ADRs with key decisions and impacts"},
        {"role": "user", "content": f"Context:\\n{context}\\n\\nQuestion: {question}"}
    ])
    
    return response.content

# Usage
async def org_adr_summary(adr_id: str):
    async with FastMCP.client(adr_mcp) as client:
        summary = await client.call_tool("summarize_adr_with_rag", {
            "adr_id": adr_id,
            "question": "What are the key decisions and risks?"
        })
        return summary.content`,
      language: "python"
    },
    {
      filename: "service_ownership.py", 
      code: `# Service Ownership with MCP

from fastmcp import FastMCP

org_mcp = FastMCP("Org Directory")

@org_mcp.resource("services/ownership")
def get_ownership():
    return {
        "auth-service": {"owner": "alice@org.com", "team": "platform"},
        "payment-api": {"owner": "bob@org.com", "team": "payments"},
        "user-service": {"owner": "charlie@org.com", "team": "identity"}
    }

@org_mcp.resource("teams/contacts")
def get_contacts():
    return {
        "platform": {"lead": "alice@org.com", "slack": "#platform-support"},
        "payments": {"lead": "bob@org.com", "slack": "#payments-team"},
        "identity": {"lead": "charlie@org.com", "slack": "#identity-team"}
    }

@org_mcp.resource("services/{service_name}/health")
def get_health(service_name: str):
    health = {
        "auth-service": {"status": "healthy", "uptime": "99.9%"},
        "payment-api": {"status": "degraded", "uptime": "95.2%"},
        "user-service": {"status": "healthy", "uptime": "99.8%"}
    }
    return health.get(service_name, {"error": "Service not found"})

# Usage - Find Owner
async def find_service_owner(service_name: str):
    async with FastMCP.client(org_mcp) as client:
        ownership = await client.read_resource("services/ownership")
        contacts = await client.read_resource("teams/contacts")
        health = await client.read_resource(f"services/{service_name}/health")
        
        service_info = ownership.content[service_name]
        team_info = contacts.content[service_info["team"]]
        
        return f"Owner: {service_info['owner']}, Team: {service_info['team']}, Contact: {team_info['slack']}"`,
      language: "python"
    },
    {
      filename: "team_updates.py",
      code: `# Cross-Team Updates with MCP Context

from fastmcp import FastMCP, Context

comm_mcp = FastMCP("Team Communication")

@comm_mcp.resource("teams/contacts")
def get_contacts():
    return {
        "platform": {"lead": "alice@org.com", "slack": "#platform-support"},
        "payments": {"lead": "bob@org.com", "slack": "#payments-team"},
        "identity": {"lead": "charlie@org.com", "slack": "#identity-team"}
    }

@comm_mcp.resource("templates/communication")
def get_templates():
    return {
        "normal": {"emoji": "🔔", "prefix": "Action Required:", "follow_up": "8 hours"},
        "high": {"emoji": "🚨", "prefix": "URGENT:", "follow_up": "2 hours"},
        "critical": {"emoji": "🔴", "prefix": "CRITICAL:", "follow_up": "immediate"}
    }

# Tool with Context for logging/progress
@comm_mcp.tool
async def generate_update(topic: str, teams: list[str], urgency: str = "normal", ctx: Context = None) -> str:
    if ctx:
        await ctx.info(f"Generating {urgency} update for {len(teams)} teams")
    
    # Access resources within tool using context
    team_data = await ctx.read_resource("teams/contacts") if ctx else {}
    templates = await ctx.read_resource("templates/communication") if ctx else {}
    
    template = templates.content.get(urgency, templates.content.get("normal", {}))
    
    update = {
        "slack_message": f"{template['emoji']} {template['prefix']} {topic}",
        "affected_teams": teams,
        "follow_up": template['follow_up']
    }
    
    if ctx:
        await ctx.info(f"Generated update for teams: {', '.join(teams)}")
    
    return update

# Usage - Compose team update
async def compose_team_update(topic: str, teams: list[str]):
    async with FastMCP.client(comm_mcp) as client:
        update = await client.call_tool("generate_update", {
            "topic": topic,
            "teams": teams,
            "urgency": "normal"
        })
        return update.content`,
      language: "python"
    }
  ],
  note: "Org-specific agents with RAG, resource lookup, and contextual tools • Matches opening diagram"
};
