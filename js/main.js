/**
 * 네비게이션 메뉴 관리 및 스크롤 인터랙션 스크립트
 * - 모바일 메뉴 토글 기능
 * - 스크롤에 따른 네비게이션 active 상태 관리
 * - PDF 다운로드 기능
 * - 부드러운 스크롤 기능
 */

// ========================================
// 유틸리티 함수들
// ========================================

/**
 * 모바일 메뉴 토글 함수
 */
function toggleMenu() {
  const $navMenu = document.getElementById('nav__menu');
  $navMenu.classList.toggle('show');
}

/**
 * 페이지 상단으로 이동하는 플로팅 버튼 처리
 */
function handleFloatingButton() {
  const $floatingButton = document.getElementById('floating-button');
  if ($floatingButton) {
    $floatingButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
      });
    });
  }
}

// ========================================
// 네비게이션 Active 상태 관리
// ========================================

let isClickScroll = false; // 클릭으로 인한 스크롤 여부 확인
let lastActiveSection = 'home'; // 현재 활성화된 섹션 추적
let changeTimeout = null; // 네비게이션 변경 디바운싱용 타이머

/**
 * 네비게이션 링크의 active 상태 설정
 * @param {string} sectionId - 활성화할 섹션 ID
 */
function setActiveNavLink(sectionId) {
  // 모든 네비게이션 링크에서 active 클래스 제거
  document.querySelectorAll('.nav__menu .nav__link').forEach((link) => {
    link.classList.remove('active-link');
  });

  // 해당 섹션의 링크에 active 클래스 추가
  const activeLink = document.querySelector(
    `.nav__menu .nav__link[href="#${sectionId}"]`,
  );
  if (activeLink) {
    activeLink.classList.add('active-link');
  }
}

/**
 * 페이지 로드 시 초기 active 상태 설정 (Home 섹션)
 */
function setInitialActiveState() {
  if (window.scrollY < 100) {
    setActiveNavLink('home');
  }
}

/**
 * 네비게이션 변경에 디바운싱을 적용하여 안정성 향상
 * @param {string} sectionId - 활성화할 섹션 ID
 */
function debouncedSetActiveNavLink(sectionId) {
  if (changeTimeout) {
    clearTimeout(changeTimeout);
  }

  changeTimeout = setTimeout(() => {
    if (sectionId !== lastActiveSection) {
      setActiveNavLink(sectionId);
      lastActiveSection = sectionId;
    }
    changeTimeout = null;
  }, 150); // 150ms 지연으로 불필요한 변경 방지
}

// ========================================
// 스크롤 기능
// ========================================

/**
 * 클릭한 섹션으로 부드럽게 스크롤하는 함수
 * @param {string} sectionId - 스크롤할 섹션 ID
 */
function smoothScrollToSection(sectionId) {
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    isClickScroll = true;

    // 클릭 시에는 즉시 변경 (디바운싱 없이)
    if (changeTimeout) {
      clearTimeout(changeTimeout);
      changeTimeout = null;
    }
    setActiveNavLink(sectionId);
    lastActiveSection = sectionId;

    // 부드러운 스크롤 실행
    targetSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    // 스크롤 완료 후 클릭 플래그 리셋
    setTimeout(() => {
      isClickScroll = false;
    }, 1000);
  }
}

// ========================================
// PDF 다운로드 기능
// ========================================

/**
 * 포트폴리오를 PDF로 다운로드하는 함수
 * 헤더와 푸터를 숨기고 브라우저 프린트 기능 실행
 */
function downloadPDF() {
  document.body.classList.add('pdf-mode');

  // 헤더와 푸터 임시 숨기기
  const header = document.querySelector('.header');
  const footer = document.querySelector('.footer');
  const originalHeaderDisplay = header.style.display;
  const originalFooterDisplay = footer.style.display;

  header.style.display = 'none';
  footer.style.display = 'none';

  // 브라우저 프린트 다이얼로그 열기
  window.print();

  // 원래 상태로 복원
  setTimeout(() => {
    header.style.display = originalHeaderDisplay;
    footer.style.display = originalFooterDisplay;
    document.body.classList.remove('pdf-mode');
  }, 100);
}

// ========================================
// 이벤트 초기화
// ========================================

/**
 * 모든 이벤트 리스너 초기화
 */
function init() {
  // 모바일 메뉴 토글 버튼 이벤트
  const $navToggle = document.getElementById('nav-toggle');
  $navToggle.addEventListener('click', () => {
    toggleMenu();
  });

  // 네비게이션 링크 클릭 이벤트 (PDF 버튼 제외)
  const $navLinkList = document.querySelectorAll('.nav__menu .nav__link');
  $navLinkList.forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault(); // 기본 앵커 링크 동작 방지

      toggleMenu(); // 모바일에서 메뉴 닫기

      // 클릭된 섹션으로 부드럽게 스크롤
      const href = e.target.getAttribute('href');
      if (href && href.startsWith('#')) {
        const sectionId = href.substring(1);
        smoothScrollToSection(sectionId);
      }
    });
  });

  handleFloatingButton();
  setInitialActiveState();
}

init();

// ========================================
// 스크롤 감지 및 섹션 추적
// ========================================

/**
 * 스크롤 위치에 따른 섹션 감지 및 네비게이션 active 상태 자동 변경
 * IntersectionObserver를 사용하여 뷰포트에 보이는 섹션 추적
 */
const observer = new IntersectionObserver(
  (entries) => {
    // 클릭으로 인한 스크롤 중에는 자동 변경 무시
    if (isClickScroll) return;

    // 페이지 하단 확인 (Education 섹션 강제 활성화용)
    const isNearBottom =
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;

    if (isNearBottom) {
      const educationSection = document.getElementById('education');
      if (educationSection && lastActiveSection !== 'education') {
        debouncedSetActiveNavLink('education');
        return;
      }
    }

    // 현재 뷰포트에 보이는 섹션들 수집 (25% 이상 보이는 것만)
    let visibleSections = [];

    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
        visibleSections.push({
          id: entry.target.id,
          ratio: entry.intersectionRatio,
        });
      }
    });

    if (visibleSections.length === 0) return;

    // 현재 활성화된 섹션이 충분히 보이면 변경하지 않음 (안정성 확보)
    const currentActiveVisible = visibleSections.find(
      (section) => section.id === lastActiveSection,
    );
    if (currentActiveVisible && currentActiveVisible.ratio >= 0.4) {
      return;
    }

    // 새로운 활성화 섹션 결정 로직
    let newActiveSection = null;

    // Work Experience 섹션 우선 처리 (긴 섹션이므로 낮은 기준 적용)
    const workSection = visibleSections.find(
      (section) => section.id === 'work',
    );
    if (workSection && workSection.ratio >= 0.3) {
      newActiveSection = 'work';
    } else {
      // 일반 섹션들은 50% 이상 보일 때만 활성화
      const eligibleSections = visibleSections.filter(
        (section) => section.ratio >= 0.5,
      );

      if (eligibleSections.length > 0) {
        const maxSection = eligibleSections.reduce((max, current) =>
          current.ratio > max.ratio ? current : max,
        );
        newActiveSection = maxSection.id;
      }
    }

    // 새로운 섹션이 결정되면 디바운싱을 적용하여 변경
    if (newActiveSection && newActiveSection !== lastActiveSection) {
      debouncedSetActiveNavLink(newActiveSection);
    }
  },
  {
    // 다양한 가시성 비율에서 감지
    threshold: [0.25, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1.0],
    // 정확한 감지를 위해 마진 없이 설정
    rootMargin: '0px 0px 0px 0px',
  },
);

// 모든 섹션을 관찰 대상으로 등록
document.querySelectorAll('.section').forEach((section) => {
  observer.observe(section);
});

// ========================================
// 페이지 로드 및 스크롤 이벤트
// ========================================

/**
 * 페이지 완전 로드 후 초기 상태 재확인
 */
window.addEventListener('load', () => {
  setTimeout(() => {
    setInitialActiveState();
  }, 100);
});

/**
 * 스크롤 이벤트로 페이지 하단 감지 (Education 섹션 활성화)
 * IntersectionObserver와 함께 이중 안전장치 역할
 */
window.addEventListener('scroll', () => {
  if (isClickScroll) return;

  // 페이지 최하단 감지 (50px 이내)
  const isAtBottom =
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 50;

  if (isAtBottom && lastActiveSection !== 'education') {
    // 페이지 끝에서는 디바운싱 없이 즉시 Education 활성화
    if (changeTimeout) {
      clearTimeout(changeTimeout);
      changeTimeout = null;
    }
    setActiveNavLink('education');
    lastActiveSection = 'education';
  }
});

// ========================================
// 스크롤 애니메이션 효과
// ========================================

/**
 * ScrollReveal 라이브러리를 사용한 스크롤 애니메이션 설정
 */
const scrollReveal = ScrollReveal({
  origin: 'top',
  distance: '60px',
  duration: 2000,
  delay: 200,
});

// 각 섹션별 애니메이션 적용
scrollReveal.reveal(
  '.home__data, .about__img, .skills__subtitle, .skills__text',
);
scrollReveal.reveal('.home__img, .about__data, .skills__img', { delay: 400 });
scrollReveal.reveal('.skills__category, .education__item', { interval: 200 });

/**
 * TypeIt 라이브러리를 사용한 타이핑 애니메이션 (선택적)
 * 현재는 비활성화 상태
 */
const typeitElement = document.getElementById('typeit');
if (typeitElement) {
  const typeit = new TypeIt('#typeit', {
    speed: 40,
    startDelay: 1300,
    waitUntilVisible: true,
  });

  typeit
    .type(
      '<div>개발은 적절한 기술, 경험, 그리고 섬세한 감각에서 완성된다고 생각합니다.<br/>사용자, 팀, 비즈니스를 이해하며 더 나은 결과를 만드는 프론트엔드 개발자입니다.</div>',
    )
    .go();
}
