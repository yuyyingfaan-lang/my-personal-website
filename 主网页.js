/* 生成水下颗粒 */
const particleBox = document.getElementById("particles");
for (let i = 0; i < 32; i++) {
  const p = document.createElement("span");
  p.className = "particle";
  p.style.left = Math.random() * 100 + "%";
  p.style.top = Math.random() * 100 + "%";
  p.style.animationDelay = Math.random() * 8 + "s";
  p.style.animationDuration = (7 + Math.random() * 7) + "s";
  particleBox.appendChild(p);
}

/* 滚动控制场景与视差 */
const surface = document.getElementById("surface");
const underwater = document.getElementById("underwater");
const lightRays = document.getElementById("light-rays");
const particles = document.getElementById("particles");
const nav = document.getElementById("nav");
const backTop = document.getElementById("back-top");
let scheduled = false;
function updateScene() {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? Math.min(1, y / max) : 0;

  /*背景缓慢移动，速度低于页面内容。不使用滤镜模糊，也不持续大幅放大图片。*/
  surface.style.transform =
    `translate3d(0, ${-y * 0.10}px, 0)`;

  /*
    下潜进度：从关于我开始，深海逐渐覆盖海面背景。*/
const dive = Math.max(
  0,
  Math.min(1, (progress - 0.12) / 0.40)
);

underwater.style.opacity = dive.toFixed(3);
  /*光束只在中段轻微出现，深海越深，光束越弱。*/
  const rays = Math.max(
    0,
    Math.sin(dive * Math.PI) * 0.5
  );

  lightRays.style.opacity = rays.toFixed(3);
  lightRays.style.transform =
    `translate3d(0, ${-y * 0.035}px, 0)`;

  particles.style.opacity =
    Math.max(0, Math.min(0.65, (dive - 0.15) * 0.8));

  nav.classList.toggle("scrolled", y > 50);
  backTop.classList.toggle("show", y > 450);

  scheduled = false;
}

window.addEventListener("scroll", () => {
  if (!scheduled) {
    window.requestAnimationFrame(updateScene);
    scheduled = true;
  }
}, { passive: true });

window.addEventListener("resize", updateScene);
updateScene();

/* 内容滚动出现 */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, {
  threshold: 0.14
});

document.querySelectorAll(".reveal:not(.visible)").forEach(el => {
  revealObserver.observe(el);
});

/* 导航高亮当前章节*/

const navLinks = document.querySelectorAll('nav ul a[href^="#"]');
const chapterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === "#" + entry.target.id
        );
      });
    }
  });
}, {
  rootMargin: "-35% 0px -55% 0px"
});

document.querySelectorAll("section[id]").forEach(section => {
  chapterObserver.observe(section);
});

/*  返回顶部*/

backTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});
function toggleAboutLetter() {
    const container = document.getElementById("aboutLetter");
    const button = container.querySelector(".envelope-trigger");

    container.classList.toggle("is-open");

    const isOpen = container.classList.contains("is-open");
    button.setAttribute("aria-expanded", isOpen);
}

function showResearch(chapterId, button) {
    // 隐藏所有章节内容
    document.querySelectorAll(".research-content").forEach(function (item) {
        item.classList.remove("active");
    });

    // 取消所有入口的选中状态
    document.querySelectorAll(".research-chapter").forEach(function (item) {
        item.classList.remove("active");
    });

    // 显示当前章节
    document.getElementById(chapterId).classList.add("active");

    // 高亮当前入口
    button.classList.add("active");
}
const researchContent = {
  social: {
    title: "社会排斥与人际信任",
    text: "我参与了关于社会排斥与人际信任关系的实验研究，关注个体经历不同程度的社会排斥后，对陌生对象的信任判断会如何变化。",
    bullets: ["参与实验设计与实验材料制作", "参与数据收集与统计分析", "在动态互动情境中思考信任如何形成与变化"],
    footer: "KEY QUESTION · 社会互动经历会如何影响我们对他人的判断？"
  },
  product: {
    title: "心理健康产品设计",
    text: "我尝试把心理学理论与现实需求结合，设计一款面向心理咨询等待用户的应用程序，从用户体验、行为特点与心理机制等角度思考功能设计。",
    bullets: ["从用户需求出发梳理使用情境", "思考心理机制如何转化为产品功能", "探索心理学知识在真实服务中的应用"],
    footer: "KEY QUESTION · 怎样让心理学知识更贴近真实的生活需求？"
  },
  future: {
    title: "未来探索",
    text: "未来，我希望继续关注社会互动过程中个体的心理变化及其影响机制，也想探索心理学研究成果在心理健康服务中的应用。",
    bullets: ["社会关系经历如何影响情绪、认知与行为？", "个体如何建立并维持积极的人际联结？", "如何让研究与现实需求发生联系？"],
    footer: "IN PROGRESS · 方向还在生长，问题也可以不断更新。"
  }
};

const panel = document.getElementById("researchPanel");

document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    // 更新当前选中的章节
    document.querySelectorAll(".tab-btn").forEach(b => {
      b.setAttribute("aria-selected", String(b === btn));
    });

    const data = researchContent[btn.dataset.panel];

    // 更新正文内容
    panel.innerHTML = `
      <h3>${data.title}</h3>
      <p>${data.text}</p>
      <ul>${data.bullets.map(item => `<li>${item}</li>`).join("")}</ul>
      <div class="research-footer">${data.footer}</div>
    `;

    // 重新触发纸片淡入动画
    panel.classList.remove("panel-changing");
    void panel.offsetWidth;
    panel.classList.add("panel-changing");
  });
});
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
        }
    });
}, {
    threshold: 0.1
});

document.querySelectorAll(".reveal").forEach(section => {
    observer.observe(section);
});
document.querySelectorAll('.confusion-note').forEach(note => {
  note.addEventListener('click', () => {
    const isOpen = note.getAttribute('aria-expanded') === 'true';
    note.setAttribute('aria-expanded', String(!isOpen));
    note.querySelector('.note-more').textContent = isOpen ? '展开便签 ＋' : '收起便签 −';
  });
});
