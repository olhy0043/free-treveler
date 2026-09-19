export type SafetyAlertLevel = "여행유의" | "여행자제" | "철수권고" | "여행금지";

export interface SafetyCategoryContent {
  title: string;
  content: string;
}

export interface EmergencyContactInfo {
  localEmergencyPhone: string;
  koreanConsulateOrCallCenter: string;
  source: string;
  checkedAt: string;
}

export interface OfficialSafetySource {
  name: string;
  url: string;
  lastCheckedAt: string;
  editor: string;
}

export interface CountrySafety {
  id: string;
  country: string;
  alertLevel: SafetyAlertLevel;
  scopeType: "country" | "region";
  scopeText: string;
  categories: {
    security: SafetyCategoryContent;
    scams: SafetyCategoryContent;
    localLaws: SafetyCategoryContent;
    transportation: SafetyCategoryContent;
    disasterClimate: SafetyCategoryContent;
    health: SafetyCategoryContent;
    cultureDressCode: SafetyCategoryContent;
    emergencyContacts: SafetyCategoryContent;
  };
  emergencyContactInfo: EmergencyContactInfo;
  officialSource: OfficialSafetySource;
}

export const safetyGuides: CountrySafety[] = [
  {
    "id": "일본",
    "country": "일본",
    "alertLevel": "여행유의",
    "scopeType": "country",
    "scopeText": "국가 전역",
    "categories": {
      "security": {
        "title": "치안",
        "content": "일본의 주요 관광지는 전반적으로 치안이 양호하나 혼잡한 관광지·대중교통에서는 소매치기에 유의해야 한다."
      },
      "scams": {
        "title": "흔한 사기",
        "content": "일본에서는 과도하게 친절한 호객, 부당 요금 택시, 가짜 티켓 판매 등 관광객 대상 사기 사례가 보고되므로 공식 판매처를 이용한다."
      },
      "localLaws": {
        "title": "현지 법규",
        "content": "일본는 음주·촬영·복장에 관한 현지 법규가 한국과 다를 수 있어 사전에 기본 규정을 확인하는 것이 좋다."
      },
      "transportation": {
        "title": "교통",
        "content": "일본의 대중교통은 대체로 안전하지만 야간 이동 시에는 인증된 택시 앱이나 공식 대중교통을 이용하는 것을 권장한다."
      },
      "disasterClimate": {
        "title": "재난·기후",
        "content": "일본는 계절별 기상 변화가 있을 수 있으므로 방문 전 현지 기상특보와 재난 안전 정보를 확인한다."
      },
      "health": {
        "title": "보건",
        "content": "일본 여행 전 상비약과 여행자보험을 준비하고, 필요한 예방접종이 있는지 질병관리청 해외여행질병정보센터에서 확인한다."
      },
      "cultureDressCode": {
        "title": "문화·복장",
        "content": "일본의 종교시설이나 공공장소 방문 시에는 현지 문화와 복장 예절을 존중하는 것이 좋다."
      },
      "emergencyContacts": {
        "title": "긴급연락처",
        "content": "일본 현지 긴급전화와 재외공관 연락처를 여행 전 미리 저장해 두는 것을 권장한다."
      }
    },
    "emergencyContactInfo": {
      "localEmergencyPhone": "경찰 110 / 소방·구급 119",
      "koreanConsulateOrCallCenter": "주일본 대한민국대사관 +81-3-3455-2601, 영사콜센터 +82-2-3210-0404",
      "source": "외교부 해외안전여행",
      "checkedAt": "2026-01-05"
    },
    "officialSource": {
      "name": "외교부 해외안전여행",
      "url": "https://www.0404.go.kr/dev/country_view.mofa?idx=53",
      "lastCheckedAt": "2026-01-05",
      "editor": "관리자A"
    }
  },
  {
    "id": "태국",
    "country": "태국",
    "alertLevel": "여행유의",
    "scopeType": "region",
    "scopeText": "남부 3개 접경 주(얄라·빠따니·나라티왓)는 여행자제 지역",
    "categories": {
      "security": {
        "title": "치안",
        "content": "태국의 주요 관광지는 전반적으로 치안이 양호하나 혼잡한 관광지·대중교통에서는 소매치기에 유의해야 한다."
      },
      "scams": {
        "title": "흔한 사기",
        "content": "태국에서는 과도하게 친절한 호객, 부당 요금 택시, 가짜 티켓 판매 등 관광객 대상 사기 사례가 보고되므로 공식 판매처를 이용한다."
      },
      "localLaws": {
        "title": "현지 법규",
        "content": "태국는 음주·촬영·복장에 관한 현지 법규가 한국과 다를 수 있어 사전에 기본 규정을 확인하는 것이 좋다."
      },
      "transportation": {
        "title": "교통",
        "content": "태국의 대중교통은 대체로 안전하지만 야간 이동 시에는 인증된 택시 앱이나 공식 대중교통을 이용하는 것을 권장한다."
      },
      "disasterClimate": {
        "title": "재난·기후",
        "content": "태국는 계절별 기상 변화가 있을 수 있으므로 방문 전 현지 기상특보와 재난 안전 정보를 확인한다."
      },
      "health": {
        "title": "보건",
        "content": "태국 여행 전 상비약과 여행자보험을 준비하고, 필요한 예방접종이 있는지 질병관리청 해외여행질병정보센터에서 확인한다."
      },
      "cultureDressCode": {
        "title": "문화·복장",
        "content": "태국의 종교시설이나 공공장소 방문 시에는 현지 문화와 복장 예절을 존중하는 것이 좋다."
      },
      "emergencyContacts": {
        "title": "긴급연락처",
        "content": "태국 현지 긴급전화와 재외공관 연락처를 여행 전 미리 저장해 두는 것을 권장한다."
      }
    },
    "emergencyContactInfo": {
      "localEmergencyPhone": "경찰 191 / 구급 1669",
      "koreanConsulateOrCallCenter": "주태국 대한민국대사관 +66-2-481-6000, 영사콜센터 +82-2-3210-0404",
      "source": "외교부 해외안전여행",
      "checkedAt": "2026-01-05"
    },
    "officialSource": {
      "name": "외교부 해외안전여행",
      "url": "https://www.0404.go.kr/dev/country_view.mofa?idx=54",
      "lastCheckedAt": "2026-01-05",
      "editor": "관리자A"
    }
  },
  {
    "id": "베트남",
    "country": "베트남",
    "alertLevel": "여행유의",
    "scopeType": "country",
    "scopeText": "국가 전역",
    "categories": {
      "security": {
        "title": "치안",
        "content": "베트남의 주요 관광지는 전반적으로 치안이 양호하나 혼잡한 관광지·대중교통에서는 소매치기에 유의해야 한다."
      },
      "scams": {
        "title": "흔한 사기",
        "content": "베트남에서는 과도하게 친절한 호객, 부당 요금 택시, 가짜 티켓 판매 등 관광객 대상 사기 사례가 보고되므로 공식 판매처를 이용한다."
      },
      "localLaws": {
        "title": "현지 법규",
        "content": "베트남는 음주·촬영·복장에 관한 현지 법규가 한국과 다를 수 있어 사전에 기본 규정을 확인하는 것이 좋다."
      },
      "transportation": {
        "title": "교통",
        "content": "베트남의 대중교통은 대체로 안전하지만 야간 이동 시에는 인증된 택시 앱이나 공식 대중교통을 이용하는 것을 권장한다."
      },
      "disasterClimate": {
        "title": "재난·기후",
        "content": "베트남는 계절별 기상 변화가 있을 수 있으므로 방문 전 현지 기상특보와 재난 안전 정보를 확인한다."
      },
      "health": {
        "title": "보건",
        "content": "베트남 여행 전 상비약과 여행자보험을 준비하고, 필요한 예방접종이 있는지 질병관리청 해외여행질병정보센터에서 확인한다."
      },
      "cultureDressCode": {
        "title": "문화·복장",
        "content": "베트남의 종교시설이나 공공장소 방문 시에는 현지 문화와 복장 예절을 존중하는 것이 좋다."
      },
      "emergencyContacts": {
        "title": "긴급연락처",
        "content": "베트남 현지 긴급전화와 재외공관 연락처를 여행 전 미리 저장해 두는 것을 권장한다."
      }
    },
    "emergencyContactInfo": {
      "localEmergencyPhone": "경찰 113 / 구급 115",
      "koreanConsulateOrCallCenter": "주베트남 대한민국대사관 +84-24-3831-5111, 영사콜센터 +82-2-3210-0404",
      "source": "외교부 해외안전여행",
      "checkedAt": "2026-01-05"
    },
    "officialSource": {
      "name": "외교부 해외안전여행",
      "url": "https://www.0404.go.kr/dev/country_view.mofa?idx=56",
      "lastCheckedAt": "2026-01-05",
      "editor": "관리자A"
    }
  },
  {
    "id": "프랑스",
    "country": "프랑스",
    "alertLevel": "여행유의",
    "scopeType": "country",
    "scopeText": "국가 전역",
    "categories": {
      "security": {
        "title": "치안",
        "content": "프랑스의 주요 관광지는 전반적으로 치안이 양호하나 혼잡한 관광지·대중교통에서는 소매치기에 유의해야 한다."
      },
      "scams": {
        "title": "흔한 사기",
        "content": "프랑스에서는 과도하게 친절한 호객, 부당 요금 택시, 가짜 티켓 판매 등 관광객 대상 사기 사례가 보고되므로 공식 판매처를 이용한다."
      },
      "localLaws": {
        "title": "현지 법규",
        "content": "프랑스는 음주·촬영·복장에 관한 현지 법규가 한국과 다를 수 있어 사전에 기본 규정을 확인하는 것이 좋다."
      },
      "transportation": {
        "title": "교통",
        "content": "프랑스의 대중교통은 대체로 안전하지만 야간 이동 시에는 인증된 택시 앱이나 공식 대중교통을 이용하는 것을 권장한다."
      },
      "disasterClimate": {
        "title": "재난·기후",
        "content": "프랑스는 계절별 기상 변화가 있을 수 있으므로 방문 전 현지 기상특보와 재난 안전 정보를 확인한다."
      },
      "health": {
        "title": "보건",
        "content": "프랑스 여행 전 상비약과 여행자보험을 준비하고, 필요한 예방접종이 있는지 질병관리청 해외여행질병정보센터에서 확인한다."
      },
      "cultureDressCode": {
        "title": "문화·복장",
        "content": "프랑스의 종교시설이나 공공장소 방문 시에는 현지 문화와 복장 예절을 존중하는 것이 좋다."
      },
      "emergencyContacts": {
        "title": "긴급연락처",
        "content": "프랑스 현지 긴급전화와 재외공관 연락처를 여행 전 미리 저장해 두는 것을 권장한다."
      }
    },
    "emergencyContactInfo": {
      "localEmergencyPhone": "경찰 17 / 구급 15 / 통합긴급 112",
      "koreanConsulateOrCallCenter": "주프랑스 대한민국대사관 +33-1-4753-6996, 영사콜센터 +82-2-3210-0404",
      "source": "외교부 해외안전여행",
      "checkedAt": "2026-01-05"
    },
    "officialSource": {
      "name": "외교부 해외안전여행",
      "url": "https://www.0404.go.kr/dev/country_view.mofa?idx=10",
      "lastCheckedAt": "2026-01-05",
      "editor": "관리자B"
    }
  },
  {
    "id": "이탈리아",
    "country": "이탈리아",
    "alertLevel": "여행유의",
    "scopeType": "country",
    "scopeText": "국가 전역",
    "categories": {
      "security": {
        "title": "치안",
        "content": "이탈리아의 주요 관광지는 전반적으로 치안이 양호하나 혼잡한 관광지·대중교통에서는 소매치기에 유의해야 한다."
      },
      "scams": {
        "title": "흔한 사기",
        "content": "이탈리아에서는 과도하게 친절한 호객, 부당 요금 택시, 가짜 티켓 판매 등 관광객 대상 사기 사례가 보고되므로 공식 판매처를 이용한다."
      },
      "localLaws": {
        "title": "현지 법규",
        "content": "이탈리아는 음주·촬영·복장에 관한 현지 법규가 한국과 다를 수 있어 사전에 기본 규정을 확인하는 것이 좋다."
      },
      "transportation": {
        "title": "교통",
        "content": "이탈리아의 대중교통은 대체로 안전하지만 야간 이동 시에는 인증된 택시 앱이나 공식 대중교통을 이용하는 것을 권장한다."
      },
      "disasterClimate": {
        "title": "재난·기후",
        "content": "이탈리아는 계절별 기상 변화가 있을 수 있으므로 방문 전 현지 기상특보와 재난 안전 정보를 확인한다."
      },
      "health": {
        "title": "보건",
        "content": "이탈리아 여행 전 상비약과 여행자보험을 준비하고, 필요한 예방접종이 있는지 질병관리청 해외여행질병정보센터에서 확인한다."
      },
      "cultureDressCode": {
        "title": "문화·복장",
        "content": "이탈리아의 종교시설이나 공공장소 방문 시에는 현지 문화와 복장 예절을 존중하는 것이 좋다."
      },
      "emergencyContacts": {
        "title": "긴급연락처",
        "content": "이탈리아 현지 긴급전화와 재외공관 연락처를 여행 전 미리 저장해 두는 것을 권장한다."
      }
    },
    "emergencyContactInfo": {
      "localEmergencyPhone": "경찰 113 / 구급 118 / 통합긴급 112",
      "koreanConsulateOrCallCenter": "주이탈리아 대한민국대사관 +39-06-802461, 영사콜센터 +82-2-3210-0404",
      "source": "외교부 해외안전여행",
      "checkedAt": "2026-01-05"
    },
    "officialSource": {
      "name": "외교부 해외안전여행",
      "url": "https://www.0404.go.kr/dev/country_view.mofa?idx=12",
      "lastCheckedAt": "2026-01-05",
      "editor": "관리자B"
    }
  },
  {
    "id": "스페인",
    "country": "스페인",
    "alertLevel": "여행유의",
    "scopeType": "country",
    "scopeText": "국가 전역",
    "categories": {
      "security": {
        "title": "치안",
        "content": "스페인의 주요 관광지는 전반적으로 치안이 양호하나 혼잡한 관광지·대중교통에서는 소매치기에 유의해야 한다."
      },
      "scams": {
        "title": "흔한 사기",
        "content": "스페인에서는 과도하게 친절한 호객, 부당 요금 택시, 가짜 티켓 판매 등 관광객 대상 사기 사례가 보고되므로 공식 판매처를 이용한다."
      },
      "localLaws": {
        "title": "현지 법규",
        "content": "스페인는 음주·촬영·복장에 관한 현지 법규가 한국과 다를 수 있어 사전에 기본 규정을 확인하는 것이 좋다."
      },
      "transportation": {
        "title": "교통",
        "content": "스페인의 대중교통은 대체로 안전하지만 야간 이동 시에는 인증된 택시 앱이나 공식 대중교통을 이용하는 것을 권장한다."
      },
      "disasterClimate": {
        "title": "재난·기후",
        "content": "스페인는 계절별 기상 변화가 있을 수 있으므로 방문 전 현지 기상특보와 재난 안전 정보를 확인한다."
      },
      "health": {
        "title": "보건",
        "content": "스페인 여행 전 상비약과 여행자보험을 준비하고, 필요한 예방접종이 있는지 질병관리청 해외여행질병정보센터에서 확인한다."
      },
      "cultureDressCode": {
        "title": "문화·복장",
        "content": "스페인의 종교시설이나 공공장소 방문 시에는 현지 문화와 복장 예절을 존중하는 것이 좋다."
      },
      "emergencyContacts": {
        "title": "긴급연락처",
        "content": "스페인 현지 긴급전화와 재외공관 연락처를 여행 전 미리 저장해 두는 것을 권장한다."
      }
    },
    "emergencyContactInfo": {
      "localEmergencyPhone": "경찰 091 / 구급 112",
      "koreanConsulateOrCallCenter": "주스페인 대한민국대사관 +34-91-353-2000, 영사콜센터 +82-2-3210-0404",
      "source": "외교부 해외안전여행",
      "checkedAt": "2026-01-05"
    },
    "officialSource": {
      "name": "외교부 해외안전여행",
      "url": "https://www.0404.go.kr/dev/country_view.mofa?idx=14",
      "lastCheckedAt": "2026-01-05",
      "editor": "관리자B"
    }
  },
  {
    "id": "영국",
    "country": "영국",
    "alertLevel": "여행유의",
    "scopeType": "country",
    "scopeText": "국가 전역",
    "categories": {
      "security": {
        "title": "치안",
        "content": "영국의 주요 관광지는 전반적으로 치안이 양호하나 혼잡한 관광지·대중교통에서는 소매치기에 유의해야 한다."
      },
      "scams": {
        "title": "흔한 사기",
        "content": "영국에서는 과도하게 친절한 호객, 부당 요금 택시, 가짜 티켓 판매 등 관광객 대상 사기 사례가 보고되므로 공식 판매처를 이용한다."
      },
      "localLaws": {
        "title": "현지 법규",
        "content": "영국는 음주·촬영·복장에 관한 현지 법규가 한국과 다를 수 있어 사전에 기본 규정을 확인하는 것이 좋다."
      },
      "transportation": {
        "title": "교통",
        "content": "영국의 대중교통은 대체로 안전하지만 야간 이동 시에는 인증된 택시 앱이나 공식 대중교통을 이용하는 것을 권장한다."
      },
      "disasterClimate": {
        "title": "재난·기후",
        "content": "영국는 계절별 기상 변화가 있을 수 있으므로 방문 전 현지 기상특보와 재난 안전 정보를 확인한다."
      },
      "health": {
        "title": "보건",
        "content": "영국 여행 전 상비약과 여행자보험을 준비하고, 필요한 예방접종이 있는지 질병관리청 해외여행질병정보센터에서 확인한다."
      },
      "cultureDressCode": {
        "title": "문화·복장",
        "content": "영국의 종교시설이나 공공장소 방문 시에는 현지 문화와 복장 예절을 존중하는 것이 좋다."
      },
      "emergencyContacts": {
        "title": "긴급연락처",
        "content": "영국 현지 긴급전화와 재외공관 연락처를 여행 전 미리 저장해 두는 것을 권장한다."
      }
    },
    "emergencyContactInfo": {
      "localEmergencyPhone": "경찰·구급 999 / 통합긴급 112",
      "koreanConsulateOrCallCenter": "주영국 대한민국대사관 +44-20-7227-5500, 영사콜센터 +82-2-3210-0404",
      "source": "외교부 해외안전여행",
      "checkedAt": "2026-01-05"
    },
    "officialSource": {
      "name": "외교부 해외안전여행",
      "url": "https://www.0404.go.kr/dev/country_view.mofa?idx=16",
      "lastCheckedAt": "2026-01-05",
      "editor": "관리자B"
    }
  },
  {
    "id": "독일",
    "country": "독일",
    "alertLevel": "여행유의",
    "scopeType": "country",
    "scopeText": "국가 전역",
    "categories": {
      "security": {
        "title": "치안",
        "content": "독일의 주요 관광지는 전반적으로 치안이 양호하나 혼잡한 관광지·대중교통에서는 소매치기에 유의해야 한다."
      },
      "scams": {
        "title": "흔한 사기",
        "content": "독일에서는 과도하게 친절한 호객, 부당 요금 택시, 가짜 티켓 판매 등 관광객 대상 사기 사례가 보고되므로 공식 판매처를 이용한다."
      },
      "localLaws": {
        "title": "현지 법규",
        "content": "독일는 음주·촬영·복장에 관한 현지 법규가 한국과 다를 수 있어 사전에 기본 규정을 확인하는 것이 좋다."
      },
      "transportation": {
        "title": "교통",
        "content": "독일의 대중교통은 대체로 안전하지만 야간 이동 시에는 인증된 택시 앱이나 공식 대중교통을 이용하는 것을 권장한다."
      },
      "disasterClimate": {
        "title": "재난·기후",
        "content": "독일는 계절별 기상 변화가 있을 수 있으므로 방문 전 현지 기상특보와 재난 안전 정보를 확인한다."
      },
      "health": {
        "title": "보건",
        "content": "독일 여행 전 상비약과 여행자보험을 준비하고, 필요한 예방접종이 있는지 질병관리청 해외여행질병정보센터에서 확인한다."
      },
      "cultureDressCode": {
        "title": "문화·복장",
        "content": "독일의 종교시설이나 공공장소 방문 시에는 현지 문화와 복장 예절을 존중하는 것이 좋다."
      },
      "emergencyContacts": {
        "title": "긴급연락처",
        "content": "독일 현지 긴급전화와 재외공관 연락처를 여행 전 미리 저장해 두는 것을 권장한다."
      }
    },
    "emergencyContactInfo": {
      "localEmergencyPhone": "경찰 110 / 구급 112",
      "koreanConsulateOrCallCenter": "주독일 대한민국대사관 +49-30-260-650, 영사콜센터 +82-2-3210-0404",
      "source": "외교부 해외안전여행",
      "checkedAt": "2026-01-05"
    },
    "officialSource": {
      "name": "외교부 해외안전여행",
      "url": "https://www.0404.go.kr/dev/country_view.mofa?idx=18",
      "lastCheckedAt": "2026-01-05",
      "editor": "관리자B"
    }
  },
  {
    "id": "미국",
    "country": "미국",
    "alertLevel": "여행유의",
    "scopeType": "country",
    "scopeText": "국가 전역",
    "categories": {
      "security": {
        "title": "치안",
        "content": "미국의 주요 관광지는 전반적으로 치안이 양호하나 혼잡한 관광지·대중교통에서는 소매치기에 유의해야 한다."
      },
      "scams": {
        "title": "흔한 사기",
        "content": "미국에서는 과도하게 친절한 호객, 부당 요금 택시, 가짜 티켓 판매 등 관광객 대상 사기 사례가 보고되므로 공식 판매처를 이용한다."
      },
      "localLaws": {
        "title": "현지 법규",
        "content": "미국는 음주·촬영·복장에 관한 현지 법규가 한국과 다를 수 있어 사전에 기본 규정을 확인하는 것이 좋다."
      },
      "transportation": {
        "title": "교통",
        "content": "미국의 대중교통은 대체로 안전하지만 야간 이동 시에는 인증된 택시 앱이나 공식 대중교통을 이용하는 것을 권장한다."
      },
      "disasterClimate": {
        "title": "재난·기후",
        "content": "미국는 계절별 기상 변화가 있을 수 있으므로 방문 전 현지 기상특보와 재난 안전 정보를 확인한다."
      },
      "health": {
        "title": "보건",
        "content": "미국 여행 전 상비약과 여행자보험을 준비하고, 필요한 예방접종이 있는지 질병관리청 해외여행질병정보센터에서 확인한다."
      },
      "cultureDressCode": {
        "title": "문화·복장",
        "content": "미국의 종교시설이나 공공장소 방문 시에는 현지 문화와 복장 예절을 존중하는 것이 좋다."
      },
      "emergencyContacts": {
        "title": "긴급연락처",
        "content": "미국 현지 긴급전화와 재외공관 연락처를 여행 전 미리 저장해 두는 것을 권장한다."
      }
    },
    "emergencyContactInfo": {
      "localEmergencyPhone": "경찰·구급·소방 911",
      "koreanConsulateOrCallCenter": "주미국 대한민국대사관 +1-202-939-5600, 영사콜센터 +82-2-3210-0404",
      "source": "외교부 해외안전여행",
      "checkedAt": "2026-01-05"
    },
    "officialSource": {
      "name": "외교부 해외안전여행",
      "url": "https://www.0404.go.kr/dev/country_view.mofa?idx=27",
      "lastCheckedAt": "2026-01-05",
      "editor": "관리자C"
    }
  },
  {
    "id": "캐나다",
    "country": "캐나다",
    "alertLevel": "여행유의",
    "scopeType": "country",
    "scopeText": "국가 전역",
    "categories": {
      "security": {
        "title": "치안",
        "content": "캐나다의 주요 관광지는 전반적으로 치안이 양호하나 혼잡한 관광지·대중교통에서는 소매치기에 유의해야 한다."
      },
      "scams": {
        "title": "흔한 사기",
        "content": "캐나다에서는 과도하게 친절한 호객, 부당 요금 택시, 가짜 티켓 판매 등 관광객 대상 사기 사례가 보고되므로 공식 판매처를 이용한다."
      },
      "localLaws": {
        "title": "현지 법규",
        "content": "캐나다는 음주·촬영·복장에 관한 현지 법규가 한국과 다를 수 있어 사전에 기본 규정을 확인하는 것이 좋다."
      },
      "transportation": {
        "title": "교통",
        "content": "캐나다의 대중교통은 대체로 안전하지만 야간 이동 시에는 인증된 택시 앱이나 공식 대중교통을 이용하는 것을 권장한다."
      },
      "disasterClimate": {
        "title": "재난·기후",
        "content": "캐나다는 계절별 기상 변화가 있을 수 있으므로 방문 전 현지 기상특보와 재난 안전 정보를 확인한다."
      },
      "health": {
        "title": "보건",
        "content": "캐나다 여행 전 상비약과 여행자보험을 준비하고, 필요한 예방접종이 있는지 질병관리청 해외여행질병정보센터에서 확인한다."
      },
      "cultureDressCode": {
        "title": "문화·복장",
        "content": "캐나다의 종교시설이나 공공장소 방문 시에는 현지 문화와 복장 예절을 존중하는 것이 좋다."
      },
      "emergencyContacts": {
        "title": "긴급연락처",
        "content": "캐나다 현지 긴급전화와 재외공관 연락처를 여행 전 미리 저장해 두는 것을 권장한다."
      }
    },
    "emergencyContactInfo": {
      "localEmergencyPhone": "경찰·구급·소방 911",
      "koreanConsulateOrCallCenter": "주캐나다 대한민국대사관 +1-613-244-5010, 영사콜센터 +82-2-3210-0404",
      "source": "외교부 해외안전여행",
      "checkedAt": "2026-01-05"
    },
    "officialSource": {
      "name": "외교부 해외안전여행",
      "url": "https://www.0404.go.kr/dev/country_view.mofa?idx=29",
      "lastCheckedAt": "2026-01-05",
      "editor": "관리자C"
    }
  },
  {
    "id": "호주",
    "country": "호주",
    "alertLevel": "여행유의",
    "scopeType": "country",
    "scopeText": "국가 전역",
    "categories": {
      "security": {
        "title": "치안",
        "content": "호주의 주요 관광지는 전반적으로 치안이 양호하나 혼잡한 관광지·대중교통에서는 소매치기에 유의해야 한다."
      },
      "scams": {
        "title": "흔한 사기",
        "content": "호주에서는 과도하게 친절한 호객, 부당 요금 택시, 가짜 티켓 판매 등 관광객 대상 사기 사례가 보고되므로 공식 판매처를 이용한다."
      },
      "localLaws": {
        "title": "현지 법규",
        "content": "호주는 음주·촬영·복장에 관한 현지 법규가 한국과 다를 수 있어 사전에 기본 규정을 확인하는 것이 좋다."
      },
      "transportation": {
        "title": "교통",
        "content": "호주의 대중교통은 대체로 안전하지만 야간 이동 시에는 인증된 택시 앱이나 공식 대중교통을 이용하는 것을 권장한다."
      },
      "disasterClimate": {
        "title": "재난·기후",
        "content": "호주는 계절별 기상 변화가 있을 수 있으므로 방문 전 현지 기상특보와 재난 안전 정보를 확인한다."
      },
      "health": {
        "title": "보건",
        "content": "호주 여행 전 상비약과 여행자보험을 준비하고, 필요한 예방접종이 있는지 질병관리청 해외여행질병정보센터에서 확인한다."
      },
      "cultureDressCode": {
        "title": "문화·복장",
        "content": "호주의 종교시설이나 공공장소 방문 시에는 현지 문화와 복장 예절을 존중하는 것이 좋다."
      },
      "emergencyContacts": {
        "title": "긴급연락처",
        "content": "호주 현지 긴급전화와 재외공관 연락처를 여행 전 미리 저장해 두는 것을 권장한다."
      }
    },
    "emergencyContactInfo": {
      "localEmergencyPhone": "경찰·구급·소방 000",
      "koreanConsulateOrCallCenter": "주호주 대한민국대사관 +61-2-6270-4100, 영사콜센터 +82-2-3210-0404",
      "source": "외교부 해외안전여행",
      "checkedAt": "2026-01-05"
    },
    "officialSource": {
      "name": "외교부 해외안전여행",
      "url": "https://www.0404.go.kr/dev/country_view.mofa?idx=60",
      "lastCheckedAt": "2026-01-05",
      "editor": "관리자C"
    }
  },
  {
    "id": "뉴질랜드",
    "country": "뉴질랜드",
    "alertLevel": "여행유의",
    "scopeType": "country",
    "scopeText": "국가 전역",
    "categories": {
      "security": {
        "title": "치안",
        "content": "뉴질랜드의 주요 관광지는 전반적으로 치안이 양호하나 혼잡한 관광지·대중교통에서는 소매치기에 유의해야 한다."
      },
      "scams": {
        "title": "흔한 사기",
        "content": "뉴질랜드에서는 과도하게 친절한 호객, 부당 요금 택시, 가짜 티켓 판매 등 관광객 대상 사기 사례가 보고되므로 공식 판매처를 이용한다."
      },
      "localLaws": {
        "title": "현지 법규",
        "content": "뉴질랜드는 음주·촬영·복장에 관한 현지 법규가 한국과 다를 수 있어 사전에 기본 규정을 확인하는 것이 좋다."
      },
      "transportation": {
        "title": "교통",
        "content": "뉴질랜드의 대중교통은 대체로 안전하지만 야간 이동 시에는 인증된 택시 앱이나 공식 대중교통을 이용하는 것을 권장한다."
      },
      "disasterClimate": {
        "title": "재난·기후",
        "content": "뉴질랜드는 계절별 기상 변화가 있을 수 있으므로 방문 전 현지 기상특보와 재난 안전 정보를 확인한다."
      },
      "health": {
        "title": "보건",
        "content": "뉴질랜드 여행 전 상비약과 여행자보험을 준비하고, 필요한 예방접종이 있는지 질병관리청 해외여행질병정보센터에서 확인한다."
      },
      "cultureDressCode": {
        "title": "문화·복장",
        "content": "뉴질랜드의 종교시설이나 공공장소 방문 시에는 현지 문화와 복장 예절을 존중하는 것이 좋다."
      },
      "emergencyContacts": {
        "title": "긴급연락처",
        "content": "뉴질랜드 현지 긴급전화와 재외공관 연락처를 여행 전 미리 저장해 두는 것을 권장한다."
      }
    },
    "emergencyContactInfo": {
      "localEmergencyPhone": "경찰·구급·소방 111",
      "koreanConsulateOrCallCenter": "주뉴질랜드 대한민국대사관 +64-4-473-9073, 영사콜센터 +82-2-3210-0404",
      "source": "외교부 해외안전여행",
      "checkedAt": "2026-01-05"
    },
    "officialSource": {
      "name": "외교부 해외안전여행",
      "url": "https://www.0404.go.kr/dev/country_view.mofa?idx=62",
      "lastCheckedAt": "2026-01-05",
      "editor": "관리자C"
    }
  },
  {
    "id": "대만",
    "country": "대만",
    "alertLevel": "여행유의",
    "scopeType": "country",
    "scopeText": "국가 전역",
    "categories": {
      "security": {
        "title": "치안",
        "content": "대만의 주요 관광지는 전반적으로 치안이 양호하나 혼잡한 관광지·대중교통에서는 소매치기에 유의해야 한다."
      },
      "scams": {
        "title": "흔한 사기",
        "content": "대만에서는 과도하게 친절한 호객, 부당 요금 택시, 가짜 티켓 판매 등 관광객 대상 사기 사례가 보고되므로 공식 판매처를 이용한다."
      },
      "localLaws": {
        "title": "현지 법규",
        "content": "대만는 음주·촬영·복장에 관한 현지 법규가 한국과 다를 수 있어 사전에 기본 규정을 확인하는 것이 좋다."
      },
      "transportation": {
        "title": "교통",
        "content": "대만의 대중교통은 대체로 안전하지만 야간 이동 시에는 인증된 택시 앱이나 공식 대중교통을 이용하는 것을 권장한다."
      },
      "disasterClimate": {
        "title": "재난·기후",
        "content": "대만는 계절별 기상 변화가 있을 수 있으므로 방문 전 현지 기상특보와 재난 안전 정보를 확인한다."
      },
      "health": {
        "title": "보건",
        "content": "대만 여행 전 상비약과 여행자보험을 준비하고, 필요한 예방접종이 있는지 질병관리청 해외여행질병정보센터에서 확인한다."
      },
      "cultureDressCode": {
        "title": "문화·복장",
        "content": "대만의 종교시설이나 공공장소 방문 시에는 현지 문화와 복장 예절을 존중하는 것이 좋다."
      },
      "emergencyContacts": {
        "title": "긴급연락처",
        "content": "대만 현지 긴급전화와 재외공관 연락처를 여행 전 미리 저장해 두는 것을 권장한다."
      }
    },
    "emergencyContactInfo": {
      "localEmergencyPhone": "경찰 110 / 구급·소방 119",
      "koreanConsulateOrCallCenter": "주타이베이 한국대표부 +886-2-2758-8320, 영사콜센터 +82-2-3210-0404",
      "source": "외교부 해외안전여행",
      "checkedAt": "2026-01-05"
    },
    "officialSource": {
      "name": "외교부 해외안전여행",
      "url": "https://www.0404.go.kr/dev/country_view.mofa?idx=71",
      "lastCheckedAt": "2026-01-05",
      "editor": "관리자A"
    }
  },
  {
    "id": "그리스",
    "country": "그리스",
    "alertLevel": "여행유의",
    "scopeType": "country",
    "scopeText": "국가 전역",
    "categories": {
      "security": {
        "title": "치안",
        "content": "그리스의 주요 관광지는 전반적으로 치안이 양호하나 혼잡한 관광지·대중교통에서는 소매치기에 유의해야 한다."
      },
      "scams": {
        "title": "흔한 사기",
        "content": "그리스에서는 과도하게 친절한 호객, 부당 요금 택시, 가짜 티켓 판매 등 관광객 대상 사기 사례가 보고되므로 공식 판매처를 이용한다."
      },
      "localLaws": {
        "title": "현지 법규",
        "content": "그리스는 음주·촬영·복장에 관한 현지 법규가 한국과 다를 수 있어 사전에 기본 규정을 확인하는 것이 좋다."
      },
      "transportation": {
        "title": "교통",
        "content": "그리스의 대중교통은 대체로 안전하지만 야간 이동 시에는 인증된 택시 앱이나 공식 대중교통을 이용하는 것을 권장한다."
      },
      "disasterClimate": {
        "title": "재난·기후",
        "content": "그리스는 계절별 기상 변화가 있을 수 있으므로 방문 전 현지 기상특보와 재난 안전 정보를 확인한다."
      },
      "health": {
        "title": "보건",
        "content": "그리스 여행 전 상비약과 여행자보험을 준비하고, 필요한 예방접종이 있는지 질병관리청 해외여행질병정보센터에서 확인한다."
      },
      "cultureDressCode": {
        "title": "문화·복장",
        "content": "그리스의 종교시설이나 공공장소 방문 시에는 현지 문화와 복장 예절을 존중하는 것이 좋다."
      },
      "emergencyContacts": {
        "title": "긴급연락처",
        "content": "그리스 현지 긴급전화와 재외공관 연락처를 여행 전 미리 저장해 두는 것을 권장한다."
      }
    },
    "emergencyContactInfo": {
      "localEmergencyPhone": "경찰 100 / 구급 166 / 통합긴급 112",
      "koreanConsulateOrCallCenter": "주그리스 대한민국대사관 +30-210-698-4080, 영사콜센터 +82-2-3210-0404",
      "source": "외교부 해외안전여행",
      "checkedAt": "2026-01-05"
    },
    "officialSource": {
      "name": "외교부 해외안전여행",
      "url": "https://www.0404.go.kr/dev/country_view.mofa?idx=20",
      "lastCheckedAt": "2026-01-05",
      "editor": "관리자B"
    }
  },
  {
    "id": "튀르키예",
    "country": "튀르키예",
    "alertLevel": "여행유의",
    "scopeType": "region",
    "scopeText": "시리아·이라크 접경 남동부 일부 주는 여행자제~철수권고 지역",
    "categories": {
      "security": {
        "title": "치안",
        "content": "튀르키예의 주요 관광지는 전반적으로 치안이 양호하나 혼잡한 관광지·대중교통에서는 소매치기에 유의해야 한다."
      },
      "scams": {
        "title": "흔한 사기",
        "content": "튀르키예에서는 과도하게 친절한 호객, 부당 요금 택시, 가짜 티켓 판매 등 관광객 대상 사기 사례가 보고되므로 공식 판매처를 이용한다."
      },
      "localLaws": {
        "title": "현지 법규",
        "content": "튀르키예는 음주·촬영·복장에 관한 현지 법규가 한국과 다를 수 있어 사전에 기본 규정을 확인하는 것이 좋다."
      },
      "transportation": {
        "title": "교통",
        "content": "튀르키예의 대중교통은 대체로 안전하지만 야간 이동 시에는 인증된 택시 앱이나 공식 대중교통을 이용하는 것을 권장한다."
      },
      "disasterClimate": {
        "title": "재난·기후",
        "content": "튀르키예는 계절별 기상 변화가 있을 수 있으므로 방문 전 현지 기상특보와 재난 안전 정보를 확인한다."
      },
      "health": {
        "title": "보건",
        "content": "튀르키예 여행 전 상비약과 여행자보험을 준비하고, 필요한 예방접종이 있는지 질병관리청 해외여행질병정보센터에서 확인한다."
      },
      "cultureDressCode": {
        "title": "문화·복장",
        "content": "튀르키예의 종교시설이나 공공장소 방문 시에는 현지 문화와 복장 예절을 존중하는 것이 좋다."
      },
      "emergencyContacts": {
        "title": "긴급연락처",
        "content": "튀르키예 현지 긴급전화와 재외공관 연락처를 여행 전 미리 저장해 두는 것을 권장한다."
      }
    },
    "emergencyContactInfo": {
      "localEmergencyPhone": "경찰 155 / 구급 112",
      "koreanConsulateOrCallCenter": "주튀르키예 대한민국대사관 +90-312-468-4822, 영사콜센터 +82-2-3210-0404",
      "source": "외교부 해외안전여행",
      "checkedAt": "2026-01-05"
    },
    "officialSource": {
      "name": "외교부 해외안전여행",
      "url": "https://www.0404.go.kr/dev/country_view.mofa?idx=42",
      "lastCheckedAt": "2026-01-05",
      "editor": "관리자A"
    }
  }
];
