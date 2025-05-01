function toggleMenu() {
  const $navMenu = document.getElementById('nav__menu');
  $navMenu.classList.toggle('show');
}

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

function init() {
  const $navToggle = document.getElementById('nav-toggle');
  $navToggle.addEventListener('click', () => {
    // Menu Toggle
    toggleMenu();
  });

  const $navLinkList = document.querySelectorAll('.nav__link');
  $navLinkList.forEach((el) => el.addEventListener('click', toggleMenu));

  handleFloatingButton();
}

init();

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id;

        const activeLink = document.querySelector(
          `.nav__link[href="#${sectionId}"]`,
        );

        if (activeLink) {
          document.querySelectorAll('.nav__link').forEach((link) => {
            link.classList.remove('active-link');
          });

          activeLink.classList.add('active-link');
        }
      }
    });
  },
  {
    threshold: 0.2,
    rootMargin: '-50px 0px -100px 0px',
  },
);

document.querySelectorAll('.section').forEach((section) => {
  observer.observe(section);
});

const scrollReveal = ScrollReveal({
  origin: 'top',
  distance: '60px',
  duration: 2000,
  delay: 200,
});
scrollReveal.reveal(
  '.home__data, .about__img, .skills__subtitle, .skills__text',
);
scrollReveal.reveal('.home__img, .about__data, .skills__img', { delay: 400 });
scrollReveal.reveal('.skills__category, .education__item', {
  interval: 200,
});

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

// // 이메일
// const $contactForm = document.getElementById('contactForm');

// $contactForm.addEventListener('submit', function (event) {
//   event.preventDefault();
//   console.dir(event);
//   console.log(event);
// });
