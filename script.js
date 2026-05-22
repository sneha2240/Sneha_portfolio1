/**
 * ==========================================================================
 * Sneha Singh Portfolio - Interactive Functionality Engine
 * ==========================================================================
 */

// 1. REELS & VIDEO DATA CONFIGURATION
// Customize your edited reels here! Update the fields below to add your own video URLs.
const reelData = [
  {
    id: "reel-1",
    title: "Cinematic Transitions & Trending Audio Sync",
    category: "reels",
    tools: ["CapCut Pro", "Adobe Premiere Pro", "DaVinci Resolve"],
    thumbnail: "assets/cinematic_timeline_thumb.png",
    videoUrl: "https://drive.google.com/file/d/1I4xT9HJkCsIUuh8m8YGuBaMiPs0TtrDt/view?usp=drive_link"
  },

  {
    id: "reel-2",
    title: "Instagram Reel - Brand Promo & Motion Graphics",
    category: "reels",
    tools: ["DaVinci Resolve", "Canva", "CapCut Pro"],
    thumbnail: "assets/audio_waves_thumb.png",
    videoUrl: "https://drive.google.com/file/d/16H9d_WqaEUtADMTc1v0HrfRxHTzuqXeV/view?usp=drive_link"
  },

  {
    id: "reel-3",
    title: "Short-form Vlog - Advanced Color Grading",
    category: "vlogs",
    tools: ["Adobe Premiere Pro", "DaVinci Resolve"],
    thumbnail: "assets/color_grading_thumb.png",
    videoUrl: "https://drive.google.com/file/d/12pY2Ooz_TPaQqskH46z3s3zfzo0QvKPH/view?usp=drive_link"
  }
];

// 2. DESIGN & PHOTOS CONFIGURATION
// Customize your poster designs, logos, and edited photos here!
// (All designs and photography are now directly edited inside index.html!)

document.addEventListener("DOMContentLoaded", () => {
  initTypingAnimation();
  initVideoShowcase();
  initDesignGallery();
  initSkillBarsObserver();
  initActiveNavHighlight();
  initMobileMenu();
});

/* ==========================================================================
   Typing Animation (Hero Section)
   ========================================================================== */
function initTypingAnimation() {
  const targetElement = document.querySelector(".hero-roles");
  if (!targetElement) return;

  const roles = ["BCA Student", "Software Developer", "Video Editor"];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentRole = roles[roleIndex];
    if (isDeleting) {
      charIndex--;
      typingSpeed = 50;
    } else {
      charIndex++;
      typingSpeed = 120;
    }

    targetElement.innerHTML = `I'm a <span style="color: var(--purple-accent); font-weight: 700;">${currentRole.substring(0, charIndex)}</span><span class="typing-cursor">|</span>`;

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typingSpeed = 2000; // Pause at full word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500; // Pause before typing next
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   Video Showcase Category Filter & Custom Lightbox Player
   ========================================================================== */
function initVideoShowcase() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const videoGrid = document.querySelector(".video-grid");
  const videoModal = document.getElementById("video-modal");
  const modalClose = document.querySelector(".modal-close");
  const simulatedPlayer = document.querySelector(".simulated-player");

  if (!videoGrid || !videoModal) return;

  // Render video cards
  function renderVideos(categoryFilter = "all") {
    videoGrid.innerHTML = "";
    const filtered = categoryFilter === "all"
      ? reelData
      : reelData.filter(v => v.category === categoryFilter);

    filtered.forEach(video => {
      const card = document.createElement("div");
      card.className = "video-card glass-card";
      card.dataset.id = video.id;

      const tagsHTML = video.tools.map(t => `<span class="video-tag">${t}</span>`).join("");

      card.innerHTML = `
        <img class="video-thumbnail" src="${video.thumbnail}" alt="${video.title}">
        <div class="video-play-btn">
          <i class="fas fa-play"></i>
        </div>
        <div class="video-overlay">
          <h3 class="video-title">${video.title}</h3>
          <div class="video-tags">${tagsHTML}</div>
        </div>
      `;

      card.addEventListener("click", () => openVideoPlayer(video));
      videoGrid.appendChild(card);
    });
  }

  // Filter tabs click
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderVideos(btn.dataset.filter);
    });
  });

  // Open video modal
  function openVideoPlayer(video) {

    const mainView = simulatedPlayer.querySelector(".player-main-view");

    // Clear previous video
    mainView.innerHTML = "";

    if (video.videoUrl && video.videoUrl.trim() !== "") {
      simulatedPlayer.classList.add("has-real-video");

      const isYoutube =
        video.videoUrl.includes("youtube.com") ||
        video.videoUrl.includes("youtu.be");

      const isDrive =
        video.videoUrl.includes("drive.google.com");

      // YOUTUBE
      if (isYoutube) {

        let embedUrl = video.videoUrl;

        if (video.videoUrl.includes("watch?v=")) {
          embedUrl = video.videoUrl.replace(
            "watch?v=",
            "embed/"
          );
        }

        mainView.innerHTML = `
            <iframe
                width="100%"
                height="100%"
                src="${embedUrl}?autoplay=1"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                style="border:none;">
            </iframe>
            `;

      }

      // GOOGLE DRIVE
      else if (isDrive) {

        let fileId = video.videoUrl.match(/\/d\/(.*?)\//)?.[1];

        let embedUrl =
          `https://drive.google.com/file/d/${fileId}/preview`;

        mainView.innerHTML = `
            <iframe
                width="100%"
                height="100%"
                src="${embedUrl}"
                frameborder="0"
                allow="autoplay"
                allowfullscreen
                style="border:none;">
            </iframe>
            `;
      }

      // NORMAL MP4
      else {

        mainView.innerHTML = `
            <video width="100%"
                    height="100%"
                    controls
                    autoplay
                    style="object-fit:contain;">

                <source src="${video.videoUrl}" type="video/mp4">

                Your browser does not support video.

            </video>
            `;
      }
    } else {
      simulatedPlayer.classList.remove("has-real-video");
    }

    videoModal.classList.add("active");
  }
  function closeVideoPlayer() {
    videoModal.classList.remove("active");
    // Clear iframe/video content to stop audio playback
    setTimeout(() => {
      simulatedPlayer.querySelector(".player-main-view").innerHTML = "";
      simulatedPlayer.classList.remove("has-real-video");
    }, 400);
  }

  modalClose.addEventListener("click", closeVideoPlayer);
  videoModal.addEventListener("click", (e) => {
    if (e.target === videoModal) closeVideoPlayer();
  });

  // Initial render
  renderVideos();
}

/* ==========================================================================
   Graphic Design & Edited Photos Lightbox Gallery
   ========================================================================== */
function initDesignGallery() {
  const designCards = document.querySelectorAll(".design-grid .design-card");
  const lightbox = document.getElementById("image-lightbox");

  if (designCards.length === 0 || !lightbox) return;

  const lightboxImg = lightbox.querySelector(".lightbox-img");
  const lightboxCaption = lightbox.querySelector(".lightbox-caption");
  const lightboxSubcaption = lightbox.querySelector(".lightbox-subcaption");

  // Loop through each HTML card and bind the Lightbox modal trigger automatically!
  designCards.forEach(card => {
    card.addEventListener("click", (e) => {
      // SNEHA: If the card is still an empty placeholder, show a helpful pop-up instruction!
      if (card.classList.contains("empty-placeholder")) {
        e.stopPropagation();
        alert("This is an empty photo slot!\n\nTo insert your own photo here:\n1. Copy your picture from your Desktop into the 'assets/' folder.\n2. Open 'index.html' in your code editor.\n3. Delete the class 'empty-placeholder' from the card's <div> element.\n4. Change src=\"\" to link to your photo (e.g. assets/my_picture.jpg)!\n\nOnce done, your own picture will display beautifully here!");
        return;
      }

      const img = card.querySelector(".design-img");
      const title = card.querySelector(".design-hover-overlay h4");
      const desc = card.querySelector(".design-hover-overlay p");

      if (img) {
        lightboxImg.src = img.getAttribute("src");
        lightboxImg.alt = img.getAttribute("alt") || "View Image";
      }
      if (title) {
        lightboxCaption.textContent = title.textContent;
      }
      if (desc) {
        lightboxSubcaption.textContent = desc.textContent;
      }

      lightbox.classList.add("active");
    });
  });

  // Close Lightbox
  lightbox.addEventListener("click", (e) => {
    if (e.target !== lightboxImg) {
      lightbox.classList.remove("active");
    }
  });
}

/* ==========================================================================
   Interactive Skill Bars Animate-on-Scroll Trigger
   ========================================================================== */
function initSkillBarsObserver() {
  const skillBars = document.querySelectorAll(".skill-bar-inner");
  if (skillBars.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const targetPercent = bar.dataset.width;
        bar.style.width = targetPercent + "%";
        // Unobserve once animated
        observer.unobserve(bar);
      }
    });
  }, {
    threshold: 0.2
  });

  skillBars.forEach(bar => observer.observe(bar));
}

/* ==========================================================================
   Active Navigation Link Highlighting on Scroll
   ========================================================================== */
function initActiveNavHighlight() {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll("nav ul li a");

  window.addEventListener("scroll", () => {
    let currentSection = "";
    const scrollPos = window.scrollY + 120; // offset for nav header height

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSection = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("active");
      }
    });
  });
}

/* ==========================================================================
   Mobile Responsive Navigation Hamburger Menu
   ========================================================================== */
function initMobileMenu() {
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const navMenu = document.querySelector("nav ul");
  const navLinks = document.querySelectorAll("nav ul li a");

  if (!mobileMenuBtn || !navMenu) return;

  mobileMenuBtn.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    const icon = mobileMenuBtn.querySelector("i");
    if (navMenu.classList.contains("active")) {
      icon.className = "fas fa-times";
    } else {
      icon.className = "fas fa-bars";
    }
  });

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      mobileMenuBtn.querySelector("i").className = "fas fa-bars";
    });
  });
}
