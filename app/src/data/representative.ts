export const REPRESENTATIVE_PROFILE = {
  name: "free_traveler",
  tripsLabel: "50+ Trips",
  countriesLabel: "30+ Countries",
  bio: "free_traveler는 지난 8년간 배낭 하나로 세계 곳곳을 돌아본 여행 기록자입니다. 처음에는 짧은 국내 여행에서 시작했지만, 낯선 도시의 골목을 걷는 즐거움에 이끌려 조금씩 더 먼 곳으로 여정을 넓혀 왔습니다. Free Traveler는 그 과정에서 직접 확인하고 정리한 정보를 다른 여행자와 나누기 위해 만든 서비스입니다.",
  philosophy: "여행은 값비싼 사치가 아니라 준비된 만큼 안전하고 자유로워질 수 있는 경험이라고 믿습니다. 그래서 화려한 순간보다 실제로 도움이 되는 정보, 즉 이동 동선과 예산, 현지 유의사항을 있는 그대로 전달하는 것을 우선합니다.",
  editorialPrinciple: "모든 여행지·안전 정보는 직접 다녀왔거나 공식 자료로 교차 확인한 내용만 싣고, 확인일을 함께 표기합니다. 특정 업체나 상품을 홍보하는 콘텐츠는 다루지 않습니다.",
} as const;

export interface TimelineEntry {
  year: string;
  place: string;
  summary: string;
}

export const timeline: TimelineEntry[] = [
  { year: "2018", place: "제주", summary: "첫 장기 국내 여행으로 제주에서 한 달을 머물며 여행 기록을 남기기 시작했다." },
  { year: "2019", place: "도쿄·오사카", summary: "첫 해외 배낭여행으로 일본 간사이·간토 지역을 3주간 돌아봤다." },
  { year: "2020", place: "동남아시아 5개국", summary: "태국·베트남을 중심으로 동남아 저비용 장기여행 노하우를 정리했다." },
  { year: "2021", place: "국내 도서 지역", summary: "이동 제한 기간 동안 국내 섬 지역을 집중적으로 기록했다." },
  { year: "2022", place: "서유럽 6개국", summary: "프랑스·이탈리아·스페인 등을 6주간 돌며 유럽 첫 장기 여행을 다녀왔다." },
  { year: "2023", place: "북미·캐나다", summary: "뉴욕에서 밴쿠버까지 대륙 횡단 여행으로 도시별 안전정보를 정리했다." },
  { year: "2024", place: "호주·뉴질랜드", summary: "오세아니아 자연 여행지를 중심으로 렌터카 로드트립을 기록했다." },
  { year: "2025", place: "튀르키예·그리스", summary: "지중해와 아나톨리아를 잇는 여정으로 30개국 방문을 달성했다." },
] as const;

export interface VisitedCountry {
  name: string;
  region: string;
}

export const visitedCountries: VisitedCountry[] = [
  { name: "대한민국", region: "아시아" },
  { name: "일본", region: "아시아" },
  { name: "태국", region: "아시아" },
  { name: "베트남", region: "아시아" },
  { name: "캄보디아", region: "아시아" },
  { name: "라오스", region: "아시아" },
  { name: "말레이시아", region: "아시아" },
  { name: "싱가포르", region: "아시아" },
  { name: "인도네시아", region: "아시아" },
  { name: "대만", region: "아시아" },
  { name: "필리핀", region: "아시아" },
  { name: "인도", region: "아시아" },
  { name: "프랑스", region: "유럽" },
  { name: "이탈리아", region: "유럽" },
  { name: "스페인", region: "유럽" },
  { name: "영국", region: "유럽" },
  { name: "독일", region: "유럽" },
  { name: "네덜란드", region: "유럽" },
  { name: "스위스", region: "유럽" },
  { name: "그리스", region: "유럽" },
  { name: "포르투갈", region: "유럽" },
  { name: "체코", region: "유럽" },
  { name: "튀르키예", region: "유럽" },
  { name: "미국", region: "북미" },
  { name: "캐나다", region: "북미" },
  { name: "멕시코", region: "북미" },
  { name: "호주", region: "오세아니아" },
  { name: "뉴질랜드", region: "오세아니아" },
  { name: "브라질", region: "남미" },
  { name: "페루", region: "남미" },
  { name: "아르헨티나", region: "남미" },
  { name: "모로코", region: "아프리카" },
] as const;

export interface ContactLink {
  label: string;
  url: string;
}

export const contactLinks: ContactLink[] = [
  { label: "이메일 문의", url: "mailto:hello@freetraveler.example" },
  { label: "인스타그램", url: "https://instagram.com/freetraveler" },
];

export const featuredDestinationIds: string[] = ["jeju", "paris", "santorini", "tokyo"];
