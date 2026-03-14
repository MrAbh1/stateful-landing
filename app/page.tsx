"use client";

import { useState, useEffect, useRef } from "react";

const TOOLS = [
  { name: "Claude Code",  svg: "M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z" },
  { name: "Cursor",       svg: "M11.503.131 1.891 5.678a.84.84 0 0 0-.42.726v11.188c0 .3.162.575.42.724l9.609 5.55a1 1 0 0 0 .998 0l9.61-5.55a.84.84 0 0 0 .42-.724V6.404a.84.84 0 0 0-.42-.726L12.497.131a1.01 1.01 0 0 0-.996 0M2.657 6.338h18.55c.263 0 .43.287.297.515L12.23 22.918c-.062.107-.229.064-.229-.06V12.335a.59.59 0 0 0-.295-.51l-9.11-5.257c-.109-.063-.064-.23.061-.23" },
  { name: "Windsurf",     svg: "M23.55 5.067c-1.2038-.002-2.1806.973-2.1806 2.1765v4.8676c0 .972-.8035 1.7594-1.7597 1.7594-.568 0-1.1352-.286-1.4718-.7659l-4.9713-7.1003c-.4125-.5896-1.0837-.941-1.8103-.941-1.1334 0-2.1533.9635-2.1533 2.153v4.8957c0 .972-.7969 1.7594-1.7596 1.7594-.57 0-1.1363-.286-1.4728-.7658L.4076 5.1598C.2822 4.9798 0 5.0688 0 5.2882v4.2452c0 .2147.0656.4228.1884.599l5.4748 7.8183c.3234.462.8006.8052 1.3509.9298 1.3771.313 2.6446-.747 2.6446-2.0977v-4.893c0-.972.7875-1.7593 1.7596-1.7593h.003a1.798 1.798 0 0 1 1.4718.7658l4.9723 7.0994c.4135.5905 1.05.941 1.8093.941 1.1587 0 2.1515-.9645 2.1515-2.153v-4.8948c0-.972.7875-1.7594 1.7596-1.7594h.194a.22.22 0 0 0 .2204-.2202v-4.622a.22.22 0 0 0-.2203-.2203Z" },
  { name: "GitHub PRs",   svg: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" },
  { name: "Slack",        svg: "M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" },
  { name: "Linear",       svg: "M2.886 4.18A11.982 11.982 0 0 1 11.99 0C18.624 0 24 5.376 24 12.009c0 3.64-1.62 6.903-4.18 9.105L2.887 4.18ZM1.817 5.626l16.556 16.556c-.524.33-1.075.62-1.65.866L.951 7.277c.247-.575.537-1.126.866-1.65ZM.322 9.163l14.515 14.515c-.71.172-1.443.282-2.195.322L0 11.358a12 12 0 0 1 .322-2.195Zm-.17 4.862 9.823 9.824a12.02 12.02 0 0 1-9.824-9.824Z" },
  { name: "Jira",         svg: "M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.005-1.005zm5.723-5.756H5.736a5.215 5.215 0 0 0 5.215 5.214h2.129v2.058a5.218 5.218 0 0 0 5.215 5.214V6.758a1.001 1.001 0 0 0-1.001-1.001zM23.013 0H11.455a5.215 5.215 0 0 0 5.215 5.215h2.129v2.057A5.215 5.215 0 0 0 24 12.483V1.005A1.001 1.001 0 0 0 23.013 0Z" },
  { name: "Confluence",   svg: "M.87 18.257c-.248.382-.53.875-.763 1.245a.764.764 0 0 0 .255 1.04l4.965 3.054a.764.764 0 0 0 1.058-.26c.199-.332.454-.763.733-1.221 1.967-3.247 3.945-2.853 7.508-1.146l4.957 2.337a.764.764 0 0 0 1.028-.382l2.364-5.346a.764.764 0 0 0-.382-1 599.851 599.851 0 0 1-4.965-2.361C10.911 10.97 5.224 11.185.87 18.257zM23.131 5.743c.249-.405.531-.875.764-1.25a.764.764 0 0 0-.256-1.034L18.675.404a.764.764 0 0 0-1.058.26c-.195.335-.451.763-.734 1.225-1.966 3.246-3.945 2.85-7.508 1.146L4.437.694a.764.764 0 0 0-1.027.382L1.046 6.422a.764.764 0 0 0 .382 1c1.039.49 3.105 1.467 4.965 2.361 6.698 3.246 12.392 3.029 16.738-4.04z" },
  { name: "VS Code",      svg: "M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z" },
  { name: "Notion",       svg: "M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z" },
  { name: "Datadog",      svg: "M19.57 17.04l-1.997-1.316-1.665 2.782-1.937-.567-1.706 2.604.087.82 9.274-1.71-.538-5.794zm-8.649-2.498l1.488-.204c.241.108.409.15.697.223.45.117.97.23 1.741-.16.18-.088.553-.43.704-.625l6.096-1.106.622 7.527-10.444 1.882zm11.325-2.712l-.602.115L20.488 0 .789 2.285l2.427 19.693 2.306-.334c-.184-.263-.471-.581-.96-.989-.68-.564-.44-1.522-.039-2.127.53-1.022 3.26-2.322 3.106-3.956-.056-.594-.15-1.368-.702-1.898-.02.22.017.432.017.432s-.227-.289-.34-.683c-.112-.15-.2-.199-.319-.4-.085.233-.073.503-.073.503s-.186-.437-.216-.807c-.11.166-.137.48-.137.48s-.241-.69-.186-1.062c-.11-.323-.436-.965-.343-2.424.6.421 1.924.321 2.44-.439.171-.251.288-.939-.086-2.293-.24-.868-.835-2.16-1.066-2.651l-.028.02c.122.395.374 1.223.47 1.625.293 1.218.372 1.642.234 2.204-.116.488-.397.808-1.107 1.165-.71.358-1.653-.514-1.713-.562-.69-.55-1.224-1.447-1.284-1.883-.062-.477.275-.763.445-1.153-.243.07-.514.192-.514.192s.323-.334.722-.624c.165-.109.262-.178.436-.323a9.762 9.762 0 0 0-.456.003s.42-.227.855-.392c-.318-.014-.623-.003-.623-.003s.937-.419 1.678-.727c.509-.208 1.006-.147 1.286.257.367.53.752.817 1.569.996.501-.223.653-.337 1.284-.509.554-.61.99-.688.99-.688s-.216.198-.274.51c.314-.249.66-.455.66-.455s-.134.164-.259.426l.03.043c.366-.22.797-.394.797-.394s-.123.156-.268.358c.277-.002.838.012 1.056.037 1.285.028 1.552-1.374 2.045-1.55.618-.22.894-.353 1.947.68.903.888 1.609 2.477 1.259 2.833-.294.295-.874-.115-1.516-.916a3.466 3.466 0 0 1-.716-1.562 1.533 1.533 0 0 0-.497-.85s.23.51.23.96c0 .246.03 1.165.424 1.68-.039.076-.057.374-.1.43-.458-.554-1.443-.95-1.604-1.067.544.445 1.793 1.468 2.273 2.449.453.927.186 1.777.416 1.997.065.063.976 1.197 1.15 1.767.306.994.019 2.038-.381 2.685l-1.117.174c-.163-.045-.273-.068-.42-.153.08-.143.241-.5.243-.572l-.063-.111c-.348.492-.93.97-1.414 1.245-.633.359-1.363.304-1.838.156-1.348-.415-2.623-1.327-2.93-1.566 0 0-.01.191.048.234.34.383 1.119 1.077 1.872 1.56l-1.605.177.759 5.908c-.337.048-.39.071-.757.124-.325-1.147-.946-1.895-1.624-2.332-.599-.384-1.424-.47-2.214-.314l-.05.059a2.851 2.851 0 0 1 1.863.444c.654.413 1.181 1.481 1.375 2.124.248.822.42 1.7-.248 2.632-.476.662-1.864 1.028-2.986.237.3.481.705.876 1.25.95.809.11 1.577-.03 2.106-.574.452-.464.69-1.434.628-2.456l.714-.104.258 1.834 11.827-1.424z" },
  { name: "PagerDuty",    svg: "M16.965 1.18C15.085.164 13.769 0 10.683 0H3.73v14.55h6.926c2.743 0 4.8-.164 6.61-1.37 1.975-1.303 3.004-3.484 3.004-6.007 0-2.716-1.262-4.896-3.305-5.994zm-5.5 10.326h-4.21V3.113l3.977-.027c3.62-.028 5.43 1.234 5.43 4.128 0 3.113-2.248 4.292-5.197 4.292zM3.73 17.61h3.525V24H3.73Z" },
];

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
        <p className="text-xs text-white/30 uppercase tracking-widest mb-16 text-center">The problem</p>
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
        <p className="text-xs text-white/30 uppercase tracking-widest mb-16 text-center">How it works</p>
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
        <p className="text-xs text-white/30 uppercase tracking-widest mb-16 text-center">Benchmark results</p>
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
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6 border-t border-white/5 pt-20">
        <p className="text-xs text-white/30 uppercase tracking-widest mb-16 text-center">Works with your stack</p>
        </div>
        <div className="max-w-5xl mx-auto px-6">
          <div className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 z-10 bg-gradient-to-r from-[#0a0a0a] to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 z-10 bg-gradient-to-l from-[#0a0a0a] to-transparent" />
            <div className="flex animate-marquee whitespace-nowrap">
              {[...Array(3)].flatMap((_, dupe) =>
                TOOLS.map((tool) => (
                  <span
                    key={`${dupe}-${tool.name}`}
                    className="inline-flex items-center gap-2.5 mx-2 text-sm px-5 py-3 border border-white/10 rounded-lg text-white/45 bg-white/[0.02] shrink-0"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0 fill-current opacity-60" aria-hidden>
                      <path d={tool.svg} />
                    </svg>
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
