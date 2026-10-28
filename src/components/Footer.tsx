import { Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-espresso py-14">
      <div className="mx-auto flex max-w-[1240px] flex-col items-center gap-6 px-6 text-center md:flex-row md:justify-between md:px-10 md:text-left">
        <div className="flex flex-col items-center gap-1.5 md:items-start">
          <span className="serif text-paper text-lg font-semibold tracking-[0.1em]">Anti-Rush Club</span>
          <span className="italic-serif text-paper/70">Come as you are. Slow down. Stay awhile.</span>
        </div>

        <div className="flex flex-col items-center gap-3 md:items-end">
          <a
            href="https://www.instagram.com/antirushclub"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Anti-Rush Club on Instagram"
            className="group inline-flex items-center gap-2.5 text-paper/80 transition-colors hover:text-paper"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full border border-paper/25 transition-colors group-hover:border-paper/60 group-hover:bg-paper/10">
              <Instagram size={17} strokeWidth={1.6} />
            </span>
            <span className="kicker text-[0.66rem]">@antirushclub</span>
          </a>
          <span className="kicker text-[0.62rem] text-paper/40">© {new Date().getFullYear()} Anti-Rush Club</span>
        </div>
      </div>
    </footer>
  )
}
