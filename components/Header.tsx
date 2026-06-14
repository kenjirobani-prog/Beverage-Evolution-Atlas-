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
          <span className="ml-auto rounded-full bg-gold px-3 py-1 text-xs font-bold tracking-wide text-[#2d2d2d]">
            一部実データ・Passport導入前
          </span>
        </div>
        <p className="mt-2 max-w-4xl text-xs leading-relaxed text-light-blue/80">
          ものづくりは『何を作るか』を担い、本ツールは『どこに・いつ届けるか』を担う。サントリーの強みは、市場と時機を捉えて初めて利益になる。
        </p>
      </div>
    </header>
  );
}
