import React, { useMemo, useState, useEffect } from "react";

/**
 * Minimal slide deck with keyboard navigation
 * - Keyboard: ←/→ to navigate, P to print
 * - Clean styling with Tailwind
 */

function Code({ children }: { children: React.ReactNode }) {
  return (
    <pre className="whitespace-pre-wrap text-sm md:text-base bg-gray-50 text-gray-900 rounded-lg p-6 overflow-auto border border-gray-200 font-mono leading-relaxed">
      <code>{children}</code>
    </pre>
  );
}

function Slide({
  title,
  bullets,
  code,
  note,
}: {
  title: string;
  bullets?: string[];
  code?: string;
  note?: string;
}) {
  return (
    <div className="w-full h-full flex flex-col justify-start p-12 md:p-16 lg:p-20 overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-8">
          {title}
        </h1>

        {bullets && (
          <ul className="list-disc pl-8 text-xl md:text-2xl leading-relaxed space-y-4 text-gray-700">
            {bullets.map((b, i) => (
              <li key={i} className="mb-3">
                {b}
              </li>
            ))}
          </ul>
        )}

        {code && <Code>{code}</Code>}

        {note && (
          <p className="text-base text-gray-500 mt-6 italic">
            {note}
          </p>
        )}
      </div>
    </div>
  );
}

export default function SlideDeck() {
  const slides = useMemo(
    () => [
      {
        title: "Lessons Learned Building Agent & Agentic Developer Tooling",
        bullets: [
          "Graphs vs ReAct • Pitfalls • MCP/RAG integrations • Debugging with LLMs",
          "Mini state graph + tool integration + copy-paste prompt",
          "Focus: practical, developer-first agent workflows",
        ],
        note: "Use ←/→ to navigate • Press P to print",
      },
      {
        title: "Interactive Opener",
        bullets: [
          "Who has written an agent?",
          "Who has built an agent for developer workflows/DevEx?",
          "Who has used MCP tools/resources with agents?",
          "Everyday GenAI for devs: user stories, interviews, RFCs/ADRs, code review, research, test generation.",
        ],
      },
      {
        title: "Graphs vs ReAct (Mental Model)",
        bullets: [
          "ReAct: Think → Act → Observe → Repeat; simple to prototype; great for search/QA.",
          "Risks: recursive tool loops, hidden state in prompts, hard to enforce invariants.",
          "State Graphs: explicit nodes & edges; typed state; deterministic routing; per-node retries/timeouts; strong observability.",
          "Rule of thumb: start with small graphs for workflows; use ReAct for ad-hoc pokes.",
        ],
      },
      {
        title: "Lessons Learned (Pitfalls & Guardrails)",
        bullets: [
          "Terminate & budget: cap tool calls, set global deadline, per-node timeouts.",
          "Idempotency: make tools repeatable; provide dry-run modes.",
          "Deterministic routing via guards; don’t let the LLM pick every hop.",
          "Structured state (narrow, typed) + early redaction of secrets.",
          "Observability-by-default: correlation IDs, state diffs, retries, exceptions.",
          "Human-in-the-loop edges for risky actions (merge/deploy).",
          "Test surfaces: unit-test nodes; contract-test tools; golden logs.",
        ],
      },
      {
        title: "Mini State Graph (LangGraph • Python)",
        code: `# pip install langgraph langchain_openai pydantic rich
from typing import TypedDict, Optional, List
from pydantic import BaseModel
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver

class DevState(TypedDict):
    task: str
    plan: List[str]
    code_patch: Optional[str]
    test_results: Optional[str]
    pr_url: Optional[str]
    logs: List[str]

class DiffInput(BaseModel):
    spec: str

# ---- Tool stubs (idempotent) ----
async def tool_plan(task: str) -> List[str]:
    return ["analyze", "implement", "test", "propose_pr"]

async def tool_code(diff: DiffInput) -> str:
    return "// patch.diff ..."

async def tool_test(patch: str) -> str:
    return "OK: 124 tests; 0 failed"

async def tool_open_pr(patch: str) -> str:
    return "https://github.com/org/repo/pull/123"

# ---- Nodes ----
async def node_plan(state: DevState) -> DevState:
    plan = await tool_plan(state["task"])  # deterministic list
    state["logs"].append(f"Plan: {plan}")
    return {**state, "plan": plan}

async def node_implement(state: DevState) -> DevState:
    patch = await tool_code(DiffInput(spec=state["task"]))
    state["logs"].append("Patch created")
    return {**state, "code_patch": patch}

async def node_test(state: DevState) -> DevState:
    results = await tool_test(state["code_patch"])
    state["logs"].append(f"Tests: {results}")
    return {**state, "test_results": results}

async def node_pr(state: DevState) -> DevState:
    pr = await tool_open_pr(state["code_patch"])
    state["logs"].append(f"PR opened: {pr}")
    return {**state, "pr_url": pr}

# ---- Routing guard ----
def should_open_pr(state: DevState) -> str:
    ok = state.get("test_results", "").startswith("OK:")
    return "open" if ok else "end"

# ---- Build graph ----
workflow = StateGraph(DevState)
workflow.add_node("plan", node_plan)
workflow.add_node("implement", node_implement)
workflow.add_node("test", node_test)
workflow.add_node("pr", node_pr)

workflow.add_edge(START, "plan")
workflow.add_edge("plan", "implement")
workflow.add_edge("implement", "test")
workflow.add_conditional_edges("test", should_open_pr, {"open": "pr", "end": END})
workflow.add_edge("pr", END)

app = workflow.compile(checkpointer=MemorySaver())

# Example:
# initial: DevState = {"task": "Refactor Foo module for DI; add unit tests",
#                      "plan": [], "code_patch": None, "test_results": None,
#                      "pr_url": None, "logs": []}
# result = await app.ainvoke(initial, config={"configurable": {"thread_id": "demo-1"}})`,
        note:
          "Highlights: typed state • guarded edge prevents loops • checkpointer enables replay.",
      },
      {
        title: "MCP / RAG Integration (Sketch • Python)",
        code: `from typing import List
from pydantic import BaseModel

class SearchDocsInput(BaseModel):
    query: str

async def mcp_search_docs(input: SearchDocsInput) -> List[str]:
    """Search internal KB (RAG source) and return doc IDs (pure function)."""
    # call MCP transport -> tool "search_kb"
    return ["doc:abc", "doc:def"]

async def node_research(state: DevState) -> DevState:
    ids = await mcp_search_docs(SearchDocsInput(query=state["task"]))
    state["logs"].append(f"Research IDs: {ids}")
    return state

# To insert research before implement:
# workflow.add_node("research", node_research)
# workflow.add_edge("plan", "research")
# workflow.add_edge("research", "implement")`,
        note:
          "Prefer pure, idempotent tools; isolate side effects behind explicit nodes. RAG: chunked sources + citations → write back to state.",
      },
      {
        title: "Debugging State Graphs with LLMs",
        bullets: [
          "Structured logs make routing bugs and ReAct-style loops visible.",
          "Ask LLMs to find: missing guards, non-idempotent tools, flaky steps.",
          "Redact secrets; keep logs JSONL/NDJSON for easy pasting.",
        ],
        code: `You are an expert in agentic state machines (LangGraph) and tool reliability.
Given the execution log, identify: (1) nodes that should be guarded, (2) non-idempotent tools,
(3) missing termination conditions, (4) slow/flaky steps, and (5) concrete routing or retry policies to add.
Return a prioritized fix list with code-level changes.

<LOG>
{paste NDJSON log here}
</LOG>`,
      },
      {
        title: "30-sec Tour: Bigger Graph (CI/CD Hygiene)",
        bullets: [
          "plan → research → implement → test → security_scan → pr → review_gate → merge → deploy_canary → verify → rollback_or_promote",
          "If security_scan fails → suggest remediations; loop to implement (cap N).",
          "review_gate enforces human approval; verify checks SLOs; failures rollback.",
        ],
      },
      {
        title: "Agents vs Autocomplete • Accountability",
        bullets: [
          "Fully agentic (AMP Code-style) vs non-agentic copilots.",
          "Senior vs junior usage patterns; guardrails to prevent overreliance.",
          "Shared accountability: humans own merges; agents propose changes.",
          "Universal fits: tests, debugging, refactoring.",
        ],
      },
      {
        title: "Getting Started in < 1 Day",
        bullets: [
          "Pick one workflow (e.g., generate tests & open PR).",
          "Define 3–5 nodes + a TypedDict state.",
          "Add budgets & guards; log everything.",
          "Wrap one MCP tool (RAG search or repo diff) and iterate with LLM-assisted debugging.",
        ],
      },
      {
        title: "Close / CTA",
        bullets: [
          "Start small • Make it observable • Keep humans in the loop.",
          "Agents that improve developer experience return value fastest.",
          "Let agents help you build agents — bootstrap with prompts.",
        ],
        note: "Use ←/→ to navigate • Press P to print",
      },
    ],
    []
  );

  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      } else if (e.key === "p" || e.key === "P") {
        e.preventDefault();
        window.print();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [slides.length]);

  return (
    <div className="h-screen w-full bg-white text-gray-900 flex flex-col">
      {/* Progress bar */}
      <div className="h-1 w-full bg-gray-100">
        <div
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        />
      </div>

      {/* Slide container */}
      <div className="flex-1 relative overflow-hidden">
        <div 
          className="h-full flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((s, i) => (
            <div key={i} className="min-w-full h-full flex-shrink-0">
              <Slide
                title={s.title}
                bullets={s.bullets}
                code={s.code}
                note={s.note}
              />
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow z-10"
          aria-label="Previous slide"
        >
          <span className="text-gray-600 text-lg">←</span>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow z-10"
          aria-label="Next slide"
        >
          <span className="text-gray-600 text-lg">→</span>
        </button>

        {/* Slide indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === currentSlide ? 'bg-blue-500' : 'bg-gray-300'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Status indicator */}
      <div className="fixed bottom-4 right-4 px-3 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium shadow-lg">
        {currentSlide + 1} / {slides.length}
      </div>
    </div>
  );
}
