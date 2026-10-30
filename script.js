// =========================
// MOBILE MENU
// =========================

const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");
const mobileLinks = document.querySelectorAll(".mobile-nav-link");

if (menuToggle && mobileMenu) {

    // Open / close menu
    menuToggle.addEventListener("click", (event) => {
        event.stopPropagation();

        menuToggle.classList.toggle("active");
        mobileMenu.classList.toggle("open");
    });


    // Close menu when a link is clicked
    mobileLinks.forEach((link) => {

        link.addEventListener("click", () => {
            menuToggle.classList.remove("active");
            mobileMenu.classList.remove("open");
        });

    });


    // Close menu when clicking outside
    document.addEventListener("click", (event) => {

        if (
            !mobileMenu.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            menuToggle.classList.remove("active");
            mobileMenu.classList.remove("open");
        }

    });

}


// =========================
// ACTIVE NAVIGATION LINK
// =========================

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

function updateActiveLink() {

    let currentSection = "";

    sections.forEach((section) => {

        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.offsetHeight;

        if (
            window.scrollY >= sectionTop &&
            window.scrollY < sectionTop + sectionHeight
        ) {
            currentSection = section.getAttribute("id");
        }

    });


    navLinks.forEach((link) => {

        link.classList.remove("active");

        if (link.getAttribute("href") === `#${currentSection}`) {
            link.classList.add("active");
        }

    });

}

window.addEventListener("scroll", updateActiveLink);
window.addEventListener("load", updateActiveLink);


// =========================
// HEADER + SCROLL PROGRESS
// =========================

const header = document.querySelector(".header");
const progressBar = document.querySelector(".scroll-progress");

function handleScroll() {

    const scrollTop = window.scrollY;


    // Header background
    if (header) {

        if (scrollTop > 10) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

    }


    // Scroll progress
    if (progressBar) {

        const documentHeight =
            document.documentElement.scrollHeight - window.innerHeight;

        const scrollPercentage =
            documentHeight > 0
                ? (scrollTop / documentHeight) * 100
                : 0;

        progressBar.style.width = `${scrollPercentage}%`;

    }

}

window.addEventListener("scroll", handleScroll);

handleScroll();


// =========================
// SERVICE TABS
// =========================

const serviceTabs = document.querySelectorAll(".service-tab");
const servicePanels = document.querySelectorAll(".service-panel");

serviceTabs.forEach((tab) => {

    tab.addEventListener("click", () => {

        const target = tab.dataset.service;


        // Remove active state from tabs
        serviceTabs.forEach((item) => {

            item.classList.remove("active");
            item.setAttribute("aria-selected", "false");

        });


        // Hide all panels
        servicePanels.forEach((panel) => {
            panel.classList.remove("active");
        });


        // Activate clicked tab
        tab.classList.add("active");
        tab.setAttribute("aria-selected", "true");


        // Show matching panel
        const targetPanel = document.querySelector(
            `.service-panel[data-panel="${target}"]`
        );

        if (targetPanel) {
            targetPanel.classList.add("active");
        }

    });

});

// =========================
// CLEAN SECTION NAVIGATION
// Keep section scrolling without leaving #fragments in the URL.
// Also supports links arriving from dedicated service pages.
// =========================

document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;

    const hash = link.getAttribute("href");
    if (!hash || hash === "#") {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
    }

    const target = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
});

function cleanIncomingSectionHash() {
    if (!window.location.hash) return;

    const targetId = decodeURIComponent(window.location.hash.slice(1));
    const target = document.getElementById(targetId);
    if (!target) return;

    target.scrollIntoView({ behavior: "auto", block: "start" });
    window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
    );
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", cleanIncomingSectionHash, { once: true });
} else {
    cleanIncomingSectionHash();
}

