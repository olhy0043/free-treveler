export default function Loading() {
  return (
    <div className="mx-auto flex max-w-[1280px] flex-col gap-6 px-4 py-16 md:px-8" aria-busy="true" aria-label="계정 정보 불러오는 중">
      <div className="h-32 w-full animate-pulse rounded-[14px] bg-[#F0EEEA]" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-[14px] bg-[#F0EEEA]" />
        ))}
      </div>
    </div>
  );
}
