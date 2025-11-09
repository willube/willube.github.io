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

    const releasePlayer = document.querySelector("[data-player]");

    if (releasePlayer) {
        const audio = releasePlayer.querySelector(".player__audio");
        const playButton = releasePlayer.querySelector(".player__play");
        const muteButton = releasePlayer.querySelector(".player__mute");
        const seekSlider = releasePlayer.querySelector(".player__seek");
        const volumeSlider = releasePlayer.querySelector(".player__volume-slider");
        const currentTimeLabel = releasePlayer.querySelector(".player__time--current");
        const totalTimeLabel = releasePlayer.querySelector(".player__time--total");
        let lastVolume = 1;

        const formatTime = (seconds) => {
            if (!Number.isFinite(seconds)) {
                return "0:00";
            }
            const minutes = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60)
                .toString()
                .padStart(2, "0");
            return `${minutes}:${secs}`;
        };

        const updateSeekPosition = () => {
            if (!audio || !seekSlider || !audio.duration) {
                return;
            }
            const progress = Math.min(
                100,
                Math.max(0, (audio.currentTime / audio.duration) * 100),
            );
            seekSlider.value = progress.toString();
            seekSlider.style.setProperty("--seek-position", `${progress}%`);
            if (currentTimeLabel) {
                currentTimeLabel.textContent = formatTime(audio.currentTime);
            }
        };

        const syncPlayingState = (isPlaying) => {
            playButton?.classList.toggle("is-playing", isPlaying);
            playButton?.setAttribute(
                "aria-label",
                isPlaying ? "Pause track" : "Play track",
            );
        };

        const updateMuteState = (volume) => {
            const muted = volume === 0;
            muteButton?.classList.toggle("is-muted", muted);
            muteButton?.setAttribute("aria-label", muted ? "Unmute" : "Mute");
        };

        playButton?.addEventListener("click", () => {
            if (!audio) {
                return;
            }
            if (audio.paused) {
                void audio.play();
            } else {
                audio.pause();
            }
        });

        audio?.addEventListener("play", () => syncPlayingState(true));
        audio?.addEventListener("pause", () => syncPlayingState(false));

        audio?.addEventListener("loadedmetadata", () => {
            if (!audio || !seekSlider) {
                return;
            }
            seekSlider.disabled = false;
            if (totalTimeLabel) {
                totalTimeLabel.textContent = formatTime(audio.duration);
            }
            updateSeekPosition();
        });

        audio?.addEventListener("timeupdate", updateSeekPosition);

        audio?.addEventListener("ended", () => {
            if (!audio) {
                return;
            }
            audio.pause();
            audio.currentTime = 0;
            updateSeekPosition();
        });

        seekSlider?.addEventListener("input", (event) => {
            if (!audio || !audio.duration) {
                return;
            }
            const slider = event.target;
            if (!(slider instanceof HTMLInputElement)) {
                return;
            }
            const value = parseFloat(slider.value);
            if (!Number.isFinite(value)) {
                return;
            }
            const clamped = Math.min(100, Math.max(0, value));
            audio.currentTime = (clamped / 100) * audio.duration;
            seekSlider.style.setProperty("--seek-position", `${clamped}%`);
            if (currentTimeLabel) {
                currentTimeLabel.textContent = formatTime(audio.currentTime);
            }
        });

        volumeSlider?.addEventListener("input", (event) => {
            if (!audio) {
                return;
            }
            const slider = event.target;
            if (!(slider instanceof HTMLInputElement)) {
                return;
            }
            const value = parseFloat(slider.value);
            if (!Number.isFinite(value)) {
                return;
            }
            const clamped = Math.min(1, Math.max(0, value));
            audio.volume = clamped;
            if (clamped > 0) {
                lastVolume = clamped;
            }
            updateMuteState(clamped);
            volumeSlider.style.setProperty("--volume-level", `${clamped * 100}%`);
        });

        muteButton?.addEventListener("click", () => {
            if (!audio || !volumeSlider) {
                return;
            }
            if (audio.volume > 0) {
                lastVolume = audio.volume;
                audio.volume = 0;
                volumeSlider.value = "0";
                volumeSlider.style.setProperty("--volume-level", "0%");
                updateMuteState(0);
            } else {
                const restoredVolume = lastVolume > 0 ? lastVolume : 0.6;
                audio.volume = restoredVolume;
                volumeSlider.value = restoredVolume.toString();
                volumeSlider.style.setProperty("--volume-level", `${restoredVolume * 100}%`);
                updateMuteState(restoredVolume);
            }
        });

        if (audio) {
            const initialVolume = volumeSlider ? parseFloat(volumeSlider.value) || 1 : 1;
            audio.volume = initialVolume;
            updateMuteState(initialVolume);
            if (seekSlider) {
                seekSlider.style.setProperty("--seek-position", "0%");
            }
            if (volumeSlider) {
                volumeSlider.style.setProperty("--volume-level", `${initialVolume * 100}%`);
            }
        }
    }
});
