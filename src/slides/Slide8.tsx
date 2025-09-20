import type { SlideProps } from '../types';

// Slide 8 — Workflow Path (Org-Specific)
export const slide8: SlideProps = {
  title: "Workflow Path (Org-Specific)",
  content: [
    "MCP tools for common org workflows:",
    "ADR analysis, service ownership, cross-team updates",
    "ToolNode executes MCP calls with proper error handling"
  ],
  codeTabs: [
    {
      filename: "adr_workflow.py",
      code: `# ADR Risk Analysis via https://localhost/mcp

from mcp import ClientSession, HttpTransport

# Connect to org MCP server
mcp_transport = HttpTransport("https://localhost/mcp")

async def analyze_adr_risks(adr_id: str) -> str:
    """Analyze ADR for technical risks via MCP server."""
    
    async with ClientSession(mcp_transport) as client:
        # Use MCP server's analyze_adr_risks tool
        risk_analysis = await client.call_tool("analyze_adr_risks", {
            "adr_id": adr_id,
            "include_dependencies": True,
            "include_migration_plan": True,
            "severity_threshold": "medium"
        })
        
        # Get full ADR content for context
        adr_content = await client.read_resource(f"adr://{adr_id}")
        
        # Format comprehensive risk report
        report = {
            "adr_id": adr_id,
            "title": adr_content["title"],
            "risks": risk_analysis["identified_risks"],
            "affected_services": risk_analysis["dependencies"],
            "migration_complexity": risk_analysis["complexity_score"],
            "recommended_timeline": risk_analysis["timeline"],
            "mitigation_steps": risk_analysis["mitigations"]
        }
        
        return json.dumps(report, indent=2)`,
      language: "python"
    },
    {
      filename: "ownership_workflow.py", 
      code: `# Service Ownership via https://localhost/mcp

async def find_complete_ownership(service_name: str) -> str:
    """Complete ownership lookup via MCP server."""
    
    async with ClientSession(mcp_transport) as client:
        # Use MCP server's get_service_ownership tool
        ownership_data = await client.call_tool("get_service_ownership", {
            "service_name": service_name,
            "include_oncall": True,
            "include_contacts": True,
            "include_repo_info": True
        })
        
        # Get additional team context
        team_info = await client.read_resource(f"team://{ownership_data['team']}/info")
        
        # Format complete ownership info
        complete_ownership = {
            "service": service_name,
            "primary_owner": ownership_data["owner"],
            "team": ownership_data["team"],
            "tech_lead": team_info["tech_lead"],
            "current_oncall": ownership_data["oncall"]["current"],
            "backup_oncall": ownership_data["oncall"]["backup"],
            "slack_channel": team_info["slack_channel"],
            "pagerduty_service": ownership_data["pagerduty_id"],
            "repository": ownership_data["repo_url"],
            "documentation": f"https://localhost/mcp/docs/services/{service_name}"
        }
        
        return json.dumps(complete_ownership, indent=2)`,
      language: "python"
    },
    {
      filename: "update_workflow.py",
      code: `# Cross-Team Updates via https://localhost/mcp

async def generate_cross_team_update(topic: str, affected_teams: List[str]) -> str:
    """Generate tailored update message for cross-team coordination."""
    
    async with ClientSession(mcp_transport) as client:
        # Get team preferences from MCP server
        team_data = []
        for team in affected_teams:
            team_prefs = await client.call_tool("get_team_preferences", {
                "team_name": team,
                "include_communication_style": True,
                "include_notification_channels": True
            })
            team_data.append(team_prefs)
        
        # Generate tailored update using MCP server's generation tool
        update_request = {
            "topic": topic,
            "affected_teams": team_data,
            "format": "slack_and_jira",
            "include_action_items": True,
            "include_links": True
        }
        
        update_message = await client.call_tool("generate_team_update", update_request)
        
        # Format final message with MCP server links
        formatted_update = {
            "slack_message": update_message["slack_formatted"],
            "jira_description": update_message["jira_formatted"], 
            "action_items": update_message["action_items"],
            "related_links": [
                f"https://localhost/mcp/teams/{team}" for team in affected_teams
            ],
            "mcp_trace_id": update_message["trace_id"]
        }
        
        return json.dumps(formatted_update, indent=2)`,
      language: "python"
    }
  ],
  note: "MCP tools enable complex org-specific workflows"
};
