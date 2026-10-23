export default function Footer() {
  return (
    <footer className="bg-espresso py-14">
      <div className="mx-auto flex max-w-[1240px] flex-col items-center gap-5 px-6 text-center md:flex-row md:justify-between md:px-10 md:text-left">
        <span className="serif text-paper text-lg font-semibold tracking-[0.1em]">Anti-Rush Club</span>
        <span className="italic-serif text-paper/70">Come as you are. Slow down. Stay awhile.</span>
        <span className="kicker text-[0.62rem] text-paper/40">© {new Date().getFullYear()} Anti-Rush Club</span>
      </div>
    </footer>
  )
}
