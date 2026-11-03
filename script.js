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
    const path = window.location.pathname.replace(/\/+$/, "") || "/";
    const isHome = path === "/" || path === "/index.html";
    const isBlog = path === "/blog" || path.indexOf("/blog/") === 0;

    const desktop = document.querySelectorAll(".desktop-nav .nav-link");
    const mobile = document.querySelectorAll(".mobile-nav .mobile-nav-link");

    let activeSection = "home";

    if (isBlog) {
        // Blog is a separate destination, not a scroll section.
        activeSection = null;
    } else if (isHome) {
        const pageSections = document.querySelectorAll("#home, #about, #services, #contact");
        const activationLine = 170;
        let found = false;

        pageSections.forEach(function (section) {
            const position = section.getBoundingClientRect();
            if (position.top <= activationLine) {
                activeSection = section.id;
                found = true;
            }
        });

        // At the very bottom, keep Contact active even if its section is short.
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
            activeSection = "contact";
        }

        if (!found && window.scrollY < 10) activeSection = "home";
    } else {
        activeSection = "services";
    }

    function linkSection(link) {
        const href = link.getAttribute("href") || "";
        if (href === "/blog/" || href === "/blog") return "blog";
        if (href === "/" || href === "../" || href === "/index.html") return "home";
        const hashPosition = href.indexOf("#");
        if (hashPosition !== -1) return href.slice(hashPosition + 1);
        return null;
    }

    function applyActiveState(links) {
        links.forEach(function (link) {
            const selected = linkSection(link) === activeSection;
            link.classList.toggle("active", selected);
            if (selected) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    applyActiveState(desktop);
    applyActiveState(mobile);
}

let activeNavigationFrame = null;

function scheduleActiveNavigationUpdate() {
    if (activeNavigationFrame !== null) {
        window.cancelAnimationFrame(activeNavigationFrame);
    }
    activeNavigationFrame = window.requestAnimationFrame(function () {
        activeNavigationFrame = null;
        updateActiveLink();
    });
}

window.addEventListener("scroll", scheduleActiveNavigationUpdate, { passive: true });
window.addEventListener("resize", scheduleActiveNavigationUpdate);
window.addEventListener("hashchange", scheduleActiveNavigationUpdate);
window.addEventListener("load", updateActiveLink);
document.addEventListener("DOMContentLoaded", updateActiveLink);
updateActiveLink();


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

