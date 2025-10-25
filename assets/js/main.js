const docReady = (fn) => {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
        fn();
    }
};

docReady(() => {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: "0px 0px -60px 0px",
    };

    const revealElements = document.querySelectorAll(".reveal");

    const onIntersect = (entries, observer) => {
        entries.forEach((entry) => {
            const target = entry.target;
            if (entry.isIntersecting) {
                const delay = parseInt(target.dataset.delay || "0", 10);
                setTimeout(() => target.classList.add("is-visible"), delay);
                observer.unobserve(target);
            }
        });
    };

    const observer = new IntersectionObserver(onIntersect, observerOptions);
    revealElements.forEach((element) => observer.observe(element));

    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".site-nav");
    const navLinks = nav?.querySelectorAll("a") || [];
    let navOpen = false;

    const closeNav = () => {
        nav?.classList.remove("is-open");
        toggle?.setAttribute("aria-expanded", "false");
        navOpen = false;
    };

    const openNav = () => {
        nav?.classList.add("is-open");
        toggle?.setAttribute("aria-expanded", "true");
        navOpen = true;
    };

    toggle?.addEventListener("click", () => {
        navOpen ? closeNav() : openNav();
    });

    navLinks?.forEach((link) =>
        link.addEventListener("click", () => {
            if (navOpen) {
                closeNav();
            }
        }),
    );

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && navOpen) {
            closeNav();
        }
    });

    const yearSpan = document.getElementById("year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear().toString();
    }
});
