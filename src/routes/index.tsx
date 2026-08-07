import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, BadgeCheck, Compass, ShieldCheck, Users, Phone, Mail, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Advanced Creation Studio — Reentry with Dignity. Results with Purpose." },
      {
        name: "description",
        content:
          "Advanced Creation Studio partners with federal and state governments to deliver evidence-based reentry programs that reduce recidivism and restore community.",
      },
    ],
  }),
  component: HomePage,
});

const pillars = [
  {
    title: "Government-trusted partner",
    body: "A credible, experienced collaborator for federal and state agencies seeking accountable reentry strategy with measurable community outcomes.",
    icon: ShieldCheck,
  },
  {
    title: "Evidence-based programs",
    body: "Every intervention is grounded in proven methodology — structured to deliver recidivism reduction with clear, reportable metrics.",
    icon: BadgeCheck,
  },
  {
    title: "Human-centered reintegration",
    body: "We meet individuals where they are, equipping them with the life skills, confidence, and community connections that make reentry last.",
    icon: Users,
  },
  {
    title: "Future-ready workforce pathways",
    body: "From foundational education to AI-enabled career pathways, we connect participants with the fastest-growing opportunities in the modern economy.",
    icon: Compass,
  },
];

const offerings = [
  "Reentry education and life-readiness coaching for individuals returning to community",
  "Reintegration planning, mentorship, and wraparound community support services",
  "AI and workforce readiness training aligned to high-growth industry opportunities",
];

type FormState = "idle" | "sending" | "success" | "error";

function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "REPLACE_WITH_WEB3FORMS_KEY",
          subject: "New partnership inquiry — Advanced Creation Studio",
          from_name: form.name,
          email: form.email,
          message: form.message,
        }),
      });
      const data = await res.json();
      setState(data.success ? "success" : "error");
    } catch {
      setState("error");
    }
  };

  if (state === "success") {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <CheckCircle2 className="h-12 w-12 text-blue-400" />
        <h3 className="text-xl font-semibold text-white">Message received.</h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          Thank you for reaching out. A member of our team will respond within one business day.
        </p>
        <button
          onClick={() => { setState("idle"); setForm({ name: "", email: "", message: "" }); }}
          className="mt-2 text-sm text-blue-400 underline-offset-4 hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-[11px] uppercase tracking-[0.2em] text-gray-400">Full name</label>
          <input
            id="name"
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Dr. Jane Smith"
            className="w-full rounded-xl border border-hairline bg-background/60 px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-[11px] uppercase tracking-[0.2em] text-gray-400">Email address</label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="you@agency.gov"
            className="w-full rounded-xl border border-hairline bg-background/60 px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <label htmlFor="message" className="text-[11px] uppercase tracking-[0.2em] text-gray-400">How can we help?</label>
        <textarea
          id="message"
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          placeholder="Tell us about your agency, program goals, or questions about partnership."
          className="w-full rounded-xl border border-hairline bg-background/60 px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 resize-none"
        />
      </div>
      {state === "error" && (
        <p className="text-sm text-red-400">Something went wrong. Please try again or email us directly.</p>
      )}
      <button
        type="submit"
        disabled={state === "sending"}
        className="inline-flex items-center gap-2 rounded-full bg-blue-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-400 disabled:opacity-60"
      >
        {state === "sending" ? "Sending…" : "Send message"}
        {state !== "sending" && <ArrowRight className="h-4 w-4" />}
      </button>
    </form>
  );
}

function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8 space-y-6">

      {/* Hero */}
      <header className="overflow-hidden rounded-[2rem] border border-hairline bg-panel/70 shadow-[0_20px_60px_rgba(2,8,23,0.35)]">
        <div className="grid gap-8 p-8 lg:grid-cols-[1.2fr_0.8fr] lg:p-12">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.3em] text-blue-400">
              <img src="/assets/logo-white.svg" alt="Advanced Creation Studio" className="h-4 w-auto" />
              <span>Advanced Creation Studio</span>
            </div>
            <h1 className="max-w-2xl text-5xl leading-[0.93] font-display md:text-6xl">
              Reentry with Dignity.<br />Results with Purpose.
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground leading-relaxed">
              We partner with government agencies and community organizations to deliver evidence-based reentry programs — built on dignity, measured by outcomes.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-400"
              >
                Start a conversation
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#offerings"
                className="inline-flex items-center rounded-full border border-hairline px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/5"
              >
                Our approach
              </a>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-hairline bg-[linear-gradient(135deg,rgba(30,144,255,0.16),rgba(255,255,255,0.04))] p-6 space-y-3">
            <div className="rounded-2xl border border-blue-400/25 bg-blue-500/10 p-4">
              <div className="text-[11px] uppercase tracking-[0.3em] text-blue-300">Government partnerships</div>
              <p className="mt-2 text-sm text-white/90 leading-relaxed">Trusted collaborator for federal and state agencies seeking credible, accountable reentry strategy.</p>
            </div>
            <div className="rounded-2xl border border-hairline bg-background/40 p-4">
              <div className="text-[11px] uppercase tracking-[0.3em] text-gray-300">Evidence-based outcomes</div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">Programs grounded in proven research — designed to reduce recidivism and report clear impact.</p>
            </div>
            <div className="rounded-2xl border border-hairline bg-background/40 p-4">
              <div className="text-[11px] uppercase tracking-[0.3em] text-gray-300">Community reintegration</div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">Holistic wraparound support that enables individuals to return, contribute, and remain free.</p>
            </div>
          </div>
        </div>
      </header>

      {/* Pillars */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div key={pillar.title} className="rounded-[1.25rem] border border-hairline bg-panel/60 p-6">
              <div className="inline-flex rounded-full bg-blue-500/10 p-2 text-blue-400">
                <Icon className="h-4 w-4" />
              </div>
              <h2 className="mt-4 text-[1.05rem] font-semibold leading-snug">{pillar.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{pillar.body}</p>
            </div>
          );
        })}
      </section>

      {/* What we offer */}
      <section id="offerings" className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[1.5rem] border border-hairline bg-panel/70 p-8 lg:p-10">
          <div className="text-[11px] uppercase tracking-[0.3em] text-blue-400">What we offer</div>
          <h2 className="mt-3 text-3xl font-display leading-snug">
            A strategic, human-centered approach to reentry and reintegration.
          </h2>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            We help people learn what reentry life requires, build the confidence to return to community, and access education and AI-enabled skills that open doors to one of the country&apos;s fastest-growing industries.
          </p>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            Our model is rooted in respect for human potential — and in the measurable results that government partners and communities need to see.
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-hairline bg-[linear-gradient(140deg,rgba(30,144,255,0.12),rgba(255,255,255,0.05))] p-8">
          <div className="text-[11px] uppercase tracking-[0.3em] text-blue-300">Program pillars</div>
          <ul className="mt-5 space-y-3">
            {offerings.map((item) => (
              <li key={item} className="flex items-start gap-3 rounded-2xl border border-hairline/70 bg-background/30 p-4">
                <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" />
                <span className="text-sm text-white/90 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Contact section */}
      <section id="contact" className="rounded-[2rem] border border-hairline bg-panel/70 p-8 lg:p-12">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-blue-400">Let&apos;s partner</div>
            <h2 className="mt-3 text-3xl font-display leading-snug">
              Connect with us to advance safer communities together.
            </h2>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed">
              We welcome conversations with government agencies, community organizations, and institutions committed to credible, compassionate reentry outcomes.
            </p>

            <div className="mt-8 space-y-4">
              <a
                href="mailto:Chrisgrisconis@icloud.com"
                className="flex items-center gap-3 text-sm text-white/80 hover:text-blue-400 transition-colors"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
                  <Mail className="h-4 w-4" />
                </span>
                Chrisgrisconis@icloud.com
              </a>
              <a
                href="tel:9809809449"
                className="flex items-center gap-3 text-sm text-white/80 hover:text-blue-400 transition-colors"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
                  <Phone className="h-4 w-4" />
                </span>
                (980) 980-9449
              </a>
              <a
                href="tel:9806808909"
                className="flex items-center gap-3 text-sm text-white/80 hover:text-blue-400 transition-colors"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
                  <Phone className="h-4 w-4" />
                </span>
                (980) 680-8909
              </a>
            </div>
          </div>

          <div>
            <ContactForm />
          </div>
        </div>
      </section>

    </div>
  );
}
