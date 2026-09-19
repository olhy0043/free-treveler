export default function Loading() {
  return (
    <div className="mx-auto flex max-w-[1280px] flex-col gap-6 px-4 py-16 md:px-8" aria-busy="true" aria-label="동행글 불러오는 중">
      <div className="h-10 w-full max-w-[420px] animate-pulse rounded-[14px] bg-[#F0EEEA]" />
      <div className="h-12 w-full animate-pulse rounded-[14px] bg-[#F0EEEA]" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-[14px] bg-[#F0EEEA]" />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-[14px] bg-[#F0EEEA]" />
      </div>
    </div>
  );
}
