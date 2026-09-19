import { describe, expect, it } from "vitest";
import { containsContactInfo } from "@/lib/actions/matePost";

// REQ-FUNC-032: phone/email/messenger-id patterns should be caught; ordinary
// travel-post text should not be flagged.
const CONTACT_SAMPLES = [
  "01012345678로 연락주세요",
  "010-1234-5678",
  "제 번호는 010 1234 5678 입니다",
  "test.user@gmail.com으로 메일 주세요",
  "카톡 아이디는 travel_kim 입니다",
  "카카오톡: travelkim22",
  "인스타 @travel_with_me 팔로우 해주세요",
  "instagram: travel.diary.kr",
  "자세한 건 https://open.kakao.com/o/abc123 에서",
  "링크 http://t.me/traveler 참고하세요",
];

const CLEAN_SAMPLES = [
  "제주도 3박4일 같이 가실 분 구합니다",
  "20대 여성이고 사진 찍는 걸 좋아해요",
  "오사카 도톤보리 맛집 투어 함께해요",
  "출발일은 다음달 초, 예산은 1인당 50만원 정도 생각합니다",
  "동행 신청은 앱 채팅으로 편하게 남겨주세요",
  "혼자 여행 다닌 지 3년차입니다",
  "숙소는 게스트하우스 위주로 다녀요",
  "안전 수칙 꼭 지켜주세요",
  "여행 스타일은 액티비티, 맛집 위주입니다",
  "일정은 유동적으로 맞출 수 있어요",
];

describe("containsContactInfo", () => {
  it("detects at least 95% of known contact-sharing patterns", async () => {
    const results = await Promise.all(CONTACT_SAMPLES.map((text) => containsContactInfo(text)));
    const detected = results.filter(Boolean).length;
    expect(detected / CONTACT_SAMPLES.length).toBeGreaterThanOrEqual(0.95);
  });

  it("false-flags at most 5% of ordinary travel-post text", async () => {
    const results = await Promise.all(CLEAN_SAMPLES.map((text) => containsContactInfo(text)));
    const falsePositives = results.filter(Boolean).length;
    expect(falsePositives / CLEAN_SAMPLES.length).toBeLessThanOrEqual(0.05);
  });
});
