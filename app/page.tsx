"use client";

import { useState, useEffect, useRef } from "react";

const SCENARIOS = [
  {
    id: "dead-ends",
    label: "Repeat investigation",
    ticket: "Service failure in checkout flow",
    without: [
      { text: "→ Checking error logs...", type: "try" },
      { text: "→ Scaling up instances...  ✗  still failing", type: "fail" },
      { text: "→ Increasing request timeout...  ✗  no change", type: "fail" },
      { text: "→ Restarting the service...  ✗  failure persists", type: "fail" },
      { text: "→ Scaling up instances again (higher)...  ✗", type: "fail" },
      { text: "→ Re-reading the same docs as last time...", type: "try" },
      { text: "↳  1hr 20min elapsed", type: "time" },
    ],
    withStateful: [
      { text: "TEAM MEMORY  ·  3 prior sessions", type: "header" },
      { text: "✗  Dead end: scaling + timeouts — team ruled this out twice", type: "dead" },
      { text: "✓  Root cause: upstream rate limit on third-party API", type: "fix" },
      { text: "↳  @teammate resolved this 3 weeks ago", type: "lineage" },
    ],
  },
  {
    id: "similar-pattern",
    label: "Similar problem",
    ticket: "New service timing out under load",
    without: [
      { text: "→ Checking server capacity...  CPU/memory look fine", type: "try" },
      { text: "→ Adding more instances...  ✗  still timing out", type: "fail" },
      { text: "→ Increasing memory limits...  ✗  no change", type: "fail" },
      { text: "→ Tweaking load balancer config...  ✗  no effect", type: "fail" },
      { text: "→ Adding even more instances...  ✗  same result", type: "fail" },
      { text: '→ Opening infra ticket: "need more capacity"', type: "try" },
      { text: "↳  2hrs 45min elapsed", type: "time" },
    ],
    withStateful: [
      { text: "⚠  Similar pattern seen across 2 other services", type: "warn" },
      { text: "✗  Not a capacity issue — your team already proved this", type: "dead" },
      { text: "✓  Root cause: connection pool exhaustion, not load", type: "fix" },
      { text: "↳  Two other services, same fix, last quarter", type: "lineage" },
    ],
  },
  {
    id: "new-engineer",
    label: "Known dead end",
    ticket: "New hire fixing flaky test suite",
    without: [
      { text: "→ Running test suite...  ✗  8 failures", type: "fail" },
      { text: "→ Adding retry logic...  ✗  still 8 failures", type: "fail" },
      { text: "→ Increasing test timeouts...  ✗  8 failures", type: "fail" },
      { text: "→ Adding more retries...  ✗  still 8 failures", type: "fail" },
      { text: "→ Increasing timeouts further...  ✗  8 failures", type: "fail" },
      { text: '→ "Why isn\'t retry logic working??"', type: "try" },
      { text: "↳  Day 2:  still 8 failures", type: "time" },
    ],
    withStateful: [
      { text: "⚠  Known dead end — 3 sessions confirm this", type: "warn" },
      { text: "✗  Retries/timeouts don't fix this class of failure", type: "dead" },
      { text: "✓  Root cause: race condition in test teardown", type: "fix" },
      { text: "↳  Senior engineer documented the exact fix last sprint", type: "lineage" },
    ],
  },
];

// Typing constants
const L_CHAR = 22;   // ms per char, left (slow/painful)
const L_GAP  = 260;  // ms pause between left lines
const R_CHAR = 14;   // ms per char, right (fast/confident)
const R_GAP  = 160;  // ms pause between right lines
const RIGHT_AFTER_LEFT_LINES = 2; // right starts after this many left lines finish
const HOLD   = 3200; // ms to hold after left finishes before cycling

type Line = { text: string; type: string };

// Build { time, chars } schedule for a list of lines typed char-by-char
function buildSchedule(lines: Line[], charMs: number, gapMs: number, startMs: number) {
  const events: { time: number; chars: number }[] = [];
  let t = startMs;
  let total = 0;
  lines.forEach((line, idx) => {
    for (let c = 1; c <= line.text.length; c++) {
      t += charMs;
      events.push({ time: t, chars: total + c });
    }
    total += line.text.length;
    if (idx < lines.length - 1) t += gapMs;
  });
  return events;
}

// Convert flat char count → array of { ...line, visible: string }
function renderLines(lines: Line[], totalChars: number) {
  let rem = totalChars;
  return lines.map((line) => {
    const shown = Math.min(Math.max(rem, 0), line.text.length);
    rem -= line.text.length;
    return { ...line, visible: line.text.slice(0, shown) };
  });
}

function TerminalDemo() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [leftChars, setLeftChars]   = useState(0);
  const [rightChars, setRightChars] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const scenario = SCENARIOS[activeIdx];

  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setLeftChars(0);
    setRightChars(0);

    // Left schedule (starts at t=0)
    const leftSched = buildSchedule(scenario.without, L_CHAR, L_GAP, 0);
    leftSched.forEach(({ time, chars }) =>
      timers.current.push(setTimeout(() => setLeftChars(chars), time))
    );

    // Compute when left finishes its Nth line → that's when right starts
    let rightStart = 0;
    {
      let t = 0;
      let n = Math.min(RIGHT_AFTER_LEFT_LINES, scenario.without.length);
      for (let i = 0; i < n; i++) {
        t += scenario.without[i].text.length * L_CHAR;
        if (i < n - 1) t += L_GAP;
      }
      rightStart = t + L_GAP; // small extra beat before right appears
    }

    // Right schedule
    const rightSched = buildSchedule(scenario.withStateful, R_CHAR, R_GAP, rightStart);
    rightSched.forEach(({ time, chars }) =>
      timers.current.push(setTimeout(() => setRightChars(chars), time))
    );

    // Cycle to next scenario after left finishes + hold
    const leftEnd = leftSched[leftSched.length - 1]?.time ?? 0;
    timers.current.push(
      setTimeout(
        () => setActiveIdx((i) => (i + 1) % SCENARIOS.length),
        leftEnd + HOLD
      )
    );

    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [activeIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  const leftRendered  = renderLines(scenario.without, leftChars);
  const rightRendered = renderLines(scenario.withStateful, rightChars);
  const leftDone  = leftChars  >= scenario.without.reduce((s, l) => s + l.text.length, 0);
  const rightDone = rightChars >= scenario.withStateful.reduce((s, l) => s + l.text.length, 0);

  return (
    <div>
      {/* Scenario tabs */}
      <div className="flex gap-2 mb-4">
        {SCENARIOS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setActiveIdx(i)}
            className={`text-xs px-3 py-1.5 rounded border transition-all ${
              i === activeIdx
                ? "border-white/30 text-white/70 bg-white/5"
                : "border-white/10 text-white/25 hover:border-white/20 hover:text-white/40"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Two-panel terminal */}
      <div className="grid grid-cols-2 rounded-lg border border-white/10 overflow-hidden">
        {/* Left — without Stateful */}
        <div className="bg-white/[0.015] border-r border-white/10">
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/10">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <span className="ml-2 text-xs text-white/20">without stateful</span>
          </div>
          <div className="p-5 text-xs leading-[1.8] min-h-[240px] font-mono">
            <div className="text-white/35 mb-3">$ {scenario.ticket}</div>
            {leftRendered.map((line, i) =>
              line.visible.length === 0 ? null : (
                <div
                  key={i}
                  className={
                    line.type === "fail"
                      ? "text-red-400/50"
                      : line.type === "time"
                      ? "text-yellow-500/40 mt-2"
                      : "text-white/25"
                  }
                >
                  {line.visible}
                  {/* cursor on the line currently being typed */}
                  {i === leftRendered.filter((l) => l.visible.length > 0).length - 1 &&
                    !leftDone && (
                      <span className="animate-pulse text-white/20">▊</span>
                    )}
                </div>
              )
            )}
          </div>
        </div>

        {/* Right — with Stateful */}
        <div className="bg-white/[0.03]">
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/10">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
            <span className="ml-2 text-xs text-emerald-400/50">⬡ with stateful</span>
          </div>
          <div className="p-5 text-xs leading-[1.8] min-h-[240px] font-mono">
            <div className="text-white/35 mb-3">$ {scenario.ticket}</div>
            {rightChars === 0 ? (
              <span className="text-white/10 animate-pulse">loading context...</span>
            ) : (
              rightRendered.map((line, i) =>
                line.visible.length === 0 ? null : (
                  <div
                    key={i}
                    className={
                      line.type === "header"
                        ? "text-white/20 uppercase tracking-widest text-[10px] mb-2"
                        : line.type === "warn"
                        ? "text-yellow-400/60"
                        : line.type === "dead"
                        ? "text-white/30"
                        : line.type === "fix"
                        ? "text-emerald-400"
                        : "text-white/25 mt-1"
                    }
                  >
                    {line.visible}
                    {i === rightRendered.filter((l) => l.visible.length > 0).length - 1 &&
                      !rightDone && (
                        <span className="animate-pulse text-emerald-400/30">▊</span>
                      )}
                  </div>
                )
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    // TODO: wire to your backend / Resend / Loops
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    setLoading(false);
  }

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen font-mono">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-5xl mx-auto">
        <span className="text-sm font-semibold tracking-widest text-white/80 uppercase">
          ⬡ Stateful
        </span>
        <a
          href="#signup"
          className="text-xs px-4 py-2 border border-white/20 rounded hover:border-white/60 hover:text-white text-white/60 transition-all"
        >
          Request Access →
        </a>
      </nav>

      {/* Hero */}
      <section id="signup" className="max-w-5xl mx-auto px-6 pt-24 pb-20">
        <div className="inline-flex items-center gap-2 text-xs text-emerald-400/80 border border-emerald-400/20 rounded-full px-3 py-1 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Now in private beta
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold leading-tight tracking-tight mb-6 text-white">
          Your AI agents never<br />
          <span className="text-white/40">solve the same problem twice.</span>
        </h1>

        <p className="text-lg text-white/50 max-w-xl mb-12 leading-relaxed">
          Stateful is a memory layer for AI coding agents — so everything your team&apos;s agents learn is shared, searchable, and ready for the next session.
        </p>

        {/* Email capture */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md">
          {submitted ? (
            <div className="flex items-center gap-2 text-emerald-400 text-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              You&apos;re on the list. We&apos;ll be in touch.
            </div>
          ) : (
            <>
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-white text-black text-sm font-semibold px-6 py-3 rounded hover:bg-white/90 transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                {loading ? "..." : "Get Early Access"}
              </button>
            </>
          )}
        </form>
      </section>

      {/* Terminal demo */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <TerminalDemo />
      </section>

      {/* Problem */}
      <section className="max-w-5xl mx-auto px-6 py-20 border-t border-white/5">
        <p className="text-xs text-white/30 uppercase tracking-widest mb-6 text-center">The problem</p>
        <div className="grid sm:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-white/90">
              Every agent session cold-starts with zero memory.
            </h2>
            <p className="text-white/40 leading-relaxed">
              Your team&apos;s AI agents re-investigate the same bugs, retry the same failed approaches, and rediscover the same fixes — every single session. The knowledge disappears the moment the context window closes.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            {[
              { bad: "Agent spends an hour on an approach your team already ruled out", good: "Memory flags it before the first command runs" },
              { bad: "New engineer's agent circles the same dead end for days", good: "Past failures become instant guardrails for every agent" },
              { bad: "Every session starts from zero, even for known fixes", good: "Solutions accumulate — each session makes the next one faster" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col gap-1 text-sm">
                <div className="flex items-start gap-2 text-white/30">
                  <span className="mt-0.5 text-red-400/60">✗</span> {item.bad}
                </div>
                <div className="flex items-start gap-2 text-white/60">
                  <span className="mt-0.5 text-emerald-400">✓</span> {item.good}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-6 py-20 border-t border-white/5">
        <p className="text-xs text-white/30 uppercase tracking-widest mb-12 text-center">How it works</p>
        <div className="grid sm:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Capture",
              desc: "Every Claude Code session is recorded in real time — failures tried, solutions found, files touched. One install command, zero config.",
            },
            {
              step: "02",
              title: "Store",
              desc: "Sessions are extracted into structured memory: digest, solutions, failure causes, key terms. Stored as vector embeddings in your org's namespace.",
            },
            {
              step: "03",
              title: "Warm start",
              desc: "The next agent to hit a similar problem gets the full history injected automatically — what failed, what fixed it, who solved it last.",
            },
          ].map((item) => (
            <div key={item.step} className="flex flex-col gap-3">
              <span className="text-xs text-white/20 font-semibold">{item.step}</span>
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-6 py-20 border-t border-white/5">
        <p className="text-xs text-white/30 uppercase tracking-widest mb-12 text-center">Benchmark results</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {[
            { value: "100%", label: "Warm insight rate", sub: "18 of 18 scenarios" },
            { value: "+0.40", label: "Avg score delta", sub: "cold 0.58 → warm 0.98" },
            { value: "28%", label: "Cold insight rate", sub: "without Stateful" },
            { value: "5 min", label: "Setup time", sub: "one install command" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <span className="text-3xl font-bold text-white">{stat.value}</span>
              <span className="text-xs text-white/50">{stat.label}</span>
              <span className="text-xs text-white/25">{stat.sub}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Integrations carousel */}
      <section className="py-20 border-t border-white/5">
        <p className="text-xs text-white/30 uppercase tracking-widest mb-8 max-w-5xl mx-auto px-6 text-center">Works with your stack</p>
        <div className="max-w-5xl mx-auto px-6">
          <div className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 z-10 bg-gradient-to-r from-[#0a0a0a] to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 z-10 bg-gradient-to-l from-[#0a0a0a] to-transparent" />
            <div className="flex animate-marquee whitespace-nowrap">
              {[...Array(3)].flatMap((_, dupe) =>
                [
                  { name: "Claude Code",  icon: "anthropic" },
                  { name: "Cursor",       icon: "cursor" },
                  { name: "Windsurf",     icon: "windsurf" },
                  { name: "GitHub PRs",   icon: "github" },
                  { name: "Slack",        icon: "slack" },
                  { name: "Linear",       icon: "linear" },
                  { name: "Jira",         icon: "jira" },
                  { name: "Confluence",   icon: "confluence" },
                  { name: "VS Code",      icon: "visualstudiocode" },
                  { name: "Notion",       icon: "notion" },
                  { name: "Datadog",      icon: "datadog" },
                  { name: "PagerDuty",    icon: "pagerduty" },
                ].map((tool) => (
                  <span
                    key={`${dupe}-${tool.name}`}
                    className="inline-flex items-center gap-2.5 mx-2 text-sm px-5 py-3 border border-white/10 rounded-lg text-white/45 bg-white/[0.02] shrink-0"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://cdn.simpleicons.org/${tool.icon}/666666`}
                      alt=""
                      className="w-4 h-4 opacity-70"
                    />
                    {tool.name}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-5xl mx-auto px-6 py-24 border-t border-white/5 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to give your team shared AI memory?</h2>
        <p className="text-white/40 mb-10 text-sm">Private beta. Free to start. No credit card.</p>
        <a
          href="#signup"
          className="inline-block bg-white text-black text-sm font-semibold px-8 py-3 rounded hover:bg-white/90 transition-colors"
        >
          Request Early Access →
        </a>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-8 max-w-5xl mx-auto flex items-center justify-between text-xs text-white/20">
        <span>⬡ Stateful — shared AI memory for engineering teams</span>
        <div className="flex gap-6">
          <a href="mailto:arrian@stateful.dev" className="hover:text-white/50 transition-colors">Contact</a>
        </div>
      </footer>
    </div>
  );
}
