/**
 * Nature Green Wedding Invitation Configuration
 *
 * 이 파일에서 청첩장의 모든 정보를 수정할 수 있습니다.
 * 이미지는 설정이 필요 없습니다. 아래 폴더에 순번 파일명으로 넣으면 자동 감지됩니다.
 *
 * 이미지 폴더 구조 (파일명 규칙):
 *   images/hero/1.jpg      - 메인 사진 (1장, 필수)
 *   images/gallery/1.jpg, 2.jpg, ... - 갤러리 사진들 (순번, 자동 감지)
 *   images/location/1.jpg  - 약도/지도 이미지 (1장)
 *   images/og/1.jpg        - 카카오톡 공유 썸네일 (1장)
 */

const CONFIG = {
  // ── 초대장 열기 ──
  useCurtain: false,  // 초대장 열기 화면 사용 여부 (true: 사용, false: 바로 본문 표시)

  // ── 메인 (히어로) ──
  groom: {
    name: "유정원",
    nameEn: "Groom",
    father: "유용근",
    mother: "임애경",
    fatherDeceased: false,
    motherDeceased: false
  },

  bride: {
    name: "김우영",
    nameEn: "Bride",
    father: "김종만",
    mother: "마남숙",
    fatherDeceased: false,
    motherDeceased: false
  },

  wedding: {
    date: "2027-03-07",
    time: "12:00",
    venue: "더파티움 여의도",
    hall: "2층 파티움홀",
    address: "서울특별시 영등포구 은행로 30",
    tel: "02-784-0000",
    mapLinks: {
      kakao: "https://kko.to/B9qaW_Ru0X",
      naver: "https://naver.me/FlBIW5PC"
    }
  },

  // ── 인사말 ──
  // content 백업1 : "제주에서는 '정원'을 '우영'이라 부릅니다\n 서로 다른 이름으로 같은 뜻을 품고 살아온 두 사람이\n이제 하나의 정원을 가꾸려고 합니다.\n\n 두 사람의 우정이\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0 \n \u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0영원을 약속하는 오늘,\n 가까이에서 축복해 주시면 감사하겠습니다."
  // content 백업2 : content: "제주에서는 '정원'을 '우영'이라 부릅니다\n 서로 다른 이름으로 같은 뜻을 품고 살아온 두 사람이\n이제 하나의 정원을 가꾸려고 합니다.\n\n 두 사람의 영원을 약속하는 오늘,\n 가까이에서 축복해 주시면 감사하겠습니다."
  greeting: {
    title: "정원 우영 결혼합니다",
    content: "제주에서는 '정원'을 '우영'이라 부릅니다.\n 서로 다른 이름으로 같은 뜻을 품고 살아온 두 사람이\n이제 하나의 정원을 가꾸려고 합니다.\n\n 봄이 오는 길목에 첫 씨앗을 심는 날,\n 저희 정원의 손님이 되어 주세요."

  },
  
  // ── 오시는 길 ──
  // (mapLinks와 캘린더는 location 섹션 내에 포함)

  // ── 마음 전하실 곳 ──
  accounts: {
    groom: [
      { role: "신랑", name: "유정원", bank: "우리은행", number: "000-000-000000" },
      { role: "아버지", name: "유용근", bank: "신한은행", number: "000-000-000000" },
      { role: "어머니", name: "임애경", bank: "우리은행", number: "000-000-000000" }
    ],
    bride: [
      { role: "신부", name: "김우영", bank: "하나은행", number: "000-000-000000" },
      { role: "아버지", name: "김종만", bank: "기업은행", number: "000-000-000000" },
      { role: "어머니", name: "마남숙", bank: "농협은행", number: "000-000-000000" }
    ]
  },

  // ── 하객 사진·영상 업로드 (하단 고정 버튼) ──
  // 백엔드 설정 방법: apps-script/README.md
  interact: {
    endpoint: "https://script.google.com/macros/s/AKfycbylszZYkT7Mc9SesbNilCvBtMXdoswxwCVwRzB8NbndBOrRz-zIBiGprQ9QCn4P3LB5/exec",  // Apps Script 웹 앱 URL (https://script.google.com/macros/s/.../exec). 비어 있으면 '준비 중' 안내만 표시
    upload: {
      enabled: true,
      maxFileMB: 2048,        // 파일당 최대 크기 (Apps Script의 MAX_FILE_MB와 맞추기)
      openFrom: ""            // 예: "2026-03-07" → 이 날짜부터 업로드 가능 (빈 문자열이면 항상 가능)
    }
  },

  // ── 링크 공유 시 나타나는 문구 ──
  meta: {
    title: "정원 ♥ 우영 결혼합니다",
    description: "2026년 5월 9일, 소중한 분들을 초대합니다."
  }
};
