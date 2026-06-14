export default function Header() {
  return (
    <header className="bg-navy text-white">
      <div className="mx-auto max-w-[1400px] px-6 py-5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <h1 className="text-xl font-bold tracking-tight md:text-2xl">
            Beverage Evolution Atlas
          </h1>
          <span className="text-base text-teal md:text-lg">
            国の成長 × 嗜好変化アトラス
          </span>
          <span className="ml-auto rounded-full bg-gold px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#2d2d2d]">
            PROXY DATA — pre-Passport v0
          </span>
        </div>
        <p className="mt-2 text-xs text-light-blue/90">
          Macro indicators: World Bank API (live, latest available year). Beverage
          volumes &amp; Suntory presence:{" "}
          <strong className="font-semibold">illustrative proxy</strong> — to be
          replaced by Euromonitor Passport. Japan is the north-star reference
          curve.
        </p>
      </div>
    </header>
  );
}
