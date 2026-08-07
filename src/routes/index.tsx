import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, Compass, ShieldCheck, Users } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Advanced Creation Studio" },
      {
        name: "description",
        content: "Premium authority with a human-centered approach to reducing recidivism and supporting reentry.",
      },
    ],
  }),
  component: HomePage,
});

const pillars = [
  {
    title: "Trusted partnership",
    body: "A credible collaborator for federal and state governments seeking practical reentry strategy.",
    icon: ShieldCheck,
  },
  {
    title: "Evidence-based delivery",
    body: "Operational programs grounded in measurable outcomes and recidivism reduction best practices.",
    icon: BadgeCheck,
  },
  {
    title: "Human-centered support",
    body: "Holistic guidance that helps people transition into community life with confidence and dignity.",
    icon: Users,
  },
  {
    title: "Future-ready skills",
    body: "Education and AI-enabled pathways that connect participants with high-growth opportunities.",
    icon: Compass,
  },
];

const offerings = [
  "Reentry education and life-readiness coaching",
  "Community reintegration planning and support",
  "AI and workforce readiness pathways for long-term opportunity",
];

function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8 space-y-6">
      <header className="overflow-hidden rounded-[2rem] border border-hairline bg-panel/70 shadow-[0_20px_60px_rgba(2,8,23,0.35)]">
        <div className="grid gap-8 p-8 lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-3 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.3em] text-blue-400">
              <img src="/assets/logo-full-color.svg" alt="Advanced Creation Studio" className="h-5 w-auto" />
              <span>Advanced Creation Studio</span>
            </div>
            <h1 className="max-w-3xl text-4xl leading-[0.95] md:text-6xl">
              Reentry with Dignity. Results with Purpose.
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Premium authority with a human-centered approach to reducing recidivism and supporting reentry.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-400"
              >
                Let&apos;s partner
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#offerings"
                className="inline-flex items-center rounded-full border border-hairline px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/5"
              >
                Explore our approach
              </a>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-hairline bg-[linear-gradient(135deg,rgba(30,144,255,0.16),rgba(255,255,255,0.04))] p-6">
            <div className="space-y-4">
              <div className="rounded-2xl border border-blue-400/25 bg-blue-500/10 p-4">
                <div className="text-[11px] uppercase tracking-[0.3em] text-blue-300">Trusted partner</div>
                <p className="mt-2 text-sm text-white/90">Trusted partner for federal and state governments committed to safer communities.</p>
              </div>
              <div className="rounded-2xl border border-hairline bg-background/40 p-4">
                <div className="text-[11px] uppercase tracking-[0.3em] text-gray-300">Evidence-based</div>
                <p className="mt-2 text-sm text-muted-foreground">Evidence-based solutions for recidivism reduction with clear strategic outcomes.</p>
              </div>
              <div className="rounded-2xl border border-hairline bg-background/40 p-4">
                <div className="text-[11px] uppercase tracking-[0.3em] text-gray-300">Holistic support</div>
                <p className="mt-2 text-sm text-muted-foreground">Holistic support for successful community reintegration and long-term stability.</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div key={pillar.title} className="rounded-[1.25rem] border border-hairline bg-panel/60 p-5">
              <div className="inline-flex rounded-full bg-blue-500/10 p-2 text-blue-400">
                <Icon className="h-4 w-4" />
              </div>
              <h2 className="mt-4 text-xl">{pillar.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{pillar.body}</p>
            </div>
          );
        })}
      </section>

      <section id="offerings" className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[1.5rem] border border-hairline bg-panel/70 p-8">
          <div className="text-[11px] uppercase tracking-[0.3em] text-blue-400">What we offer</div>
          <h2 className="mt-3 text-3xl">A professional, strategic approach to reentry and reintegration.</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We help people learn about re-entry life, build confidence for returning to the community, and use education plus AI skills to get involved in one of the country&apos;s biggest and fastest-growing industries.
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-hairline bg-[linear-gradient(140deg,rgba(30,144,255,0.12),rgba(255,255,255,0.05))] p-8">
          <div className="text-[11px] uppercase tracking-[0.3em] text-blue-300">Program pillars</div>
          <ul className="mt-4 space-y-3">
            {offerings.map((item) => (
              <li key={item} className="flex items-start gap-3 rounded-2xl border border-hairline/70 bg-background/30 p-3">
                <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" />
                <span className="text-sm text-white/90">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-[2rem] border border-hairline bg-panel/70 p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <div className="text-[11px] uppercase tracking-[0.3em] text-blue-400">Let&apos;s partner</div>
            <h2 className="mt-2 text-3xl">Connect with us to learn how we can advance safer communities together.</h2>
            <p className="mt-3 text-lg text-muted-foreground">
              We welcome conversations with organizations that want credible, compassionate, and measurable reentry support.
            </p>
          </div>
          <a href="mailto:hello@advancedcreationstudio.com" className="inline-flex items-center gap-2 rounded-full bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-400">
            hello@advancedcreationstudio.com
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
