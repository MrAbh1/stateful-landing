"use client";

import { useState } from "react";

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
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-20">
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
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md" id="signup">
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
        <div className="rounded-lg border border-white/10 bg-white/[0.03] overflow-hidden">
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/10">
            <span className="w-3 h-3 rounded-full bg-red-500/60" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/60" />
            <span className="ml-3 text-xs text-white/30">claude — stateful warm start</span>
          </div>
          <div className="p-6 text-sm leading-7 overflow-x-auto">
            <div className="text-white/30">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
            <div className="text-emerald-400">  ⬡ STATEFUL  ·  Fix JWT clock skew  ·  3 prior sessions</div>
            <div className="text-white/30">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
            <div className="mt-4 text-white/20 text-xs uppercase tracking-widest mb-2">Prior session memory loaded</div>
            <div className="text-white/60">
              <span className="text-white/30">✗ Tried: </span>Increasing token TTL in Redis — did not fix root cause<br />
              <span className="text-emerald-400">✓ Fixed: </span>Set <span className="text-amber-400">clock_skew_leeway=10</span> in <span className="text-sky-400">auth/config.py:jwt.decode()</span><br />
              <span className="text-white/30">↳ </span>Same bug hit by @alice 3 weeks ago on payments-service
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="max-w-5xl mx-auto px-6 py-20 border-t border-white/5">
        <p className="text-xs text-white/30 uppercase tracking-widest mb-6">The problem</p>
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
              { bad: "Agent spends 40 min debugging JWT expiry", good: "Stateful surfaces the fix in the first response" },
              { bad: "New engineer's agent repeats a known dead end", good: "Memory flags it: ✗ tried, didn't work" },
              { bad: "Team knowledge lives in Slack threads no one reads", good: "Captured automatically from every coding session" },
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
        <p className="text-xs text-white/30 uppercase tracking-widest mb-12">How it works</p>
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
        <p className="text-xs text-white/30 uppercase tracking-widest mb-12">Benchmark results</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {[
            { value: "100%", label: "Warm insight rate", sub: "7 of 7 scenarios" },
            { value: "+0.32", label: "Avg score delta", sub: "cold 0.66 → warm 0.98" },
            { value: "43%", label: "Cold insight rate", sub: "without Stateful" },
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

      {/* Integrations */}
      <section className="max-w-5xl mx-auto px-6 py-20 border-t border-white/5">
        <p className="text-xs text-white/30 uppercase tracking-widest mb-8">Works with your stack</p>
        <div className="flex flex-wrap gap-3">
          {["Claude Code", "Cursor", "Windsurf", "GitHub PRs", "Slack", "Linear", "Jira", "Confluence"].map((tool) => (
            <span
              key={tool}
              className="text-xs px-3 py-1.5 border border-white/10 rounded text-white/40 bg-white/[0.02]"
            >
              {tool}
            </span>
          ))}
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
