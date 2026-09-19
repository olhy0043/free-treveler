export default function Loading() {
  return (
    <div className="mx-auto flex max-w-[1280px] flex-col gap-6 px-4 py-16 md:px-8" aria-busy="true" aria-label="페이지 불러오는 중">
      <div className="h-16 w-full animate-pulse rounded-[14px] bg-[#F0EEEA]" />
      <div className="h-64 w-full animate-pulse rounded-[14px] bg-[#F0EEEA]" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-40 animate-pulse rounded-[14px] bg-[#F0EEEA]" />
        ))}
      </div>
    </div>
  );
}
