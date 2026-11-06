const loginForm = document.querySelector("#login-form");
const passcodeInput = document.querySelector("#passcode");
const loginStatus = document.querySelector("#login-status");
const loginScreen = document.querySelector("#login-screen");
const siteContent = document.querySelector("#site-content");

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const enteredPasscode = passcodeInput.value
        .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));

    if (enteredPasscode !== "1001") {
        loginStatus.textContent = "الرقم السري غير صحيح. حاولي مرة أخرى.";
        passcodeInput.setAttribute("aria-invalid", "true");
        passcodeInput.select();
        return;
    }

    loginStatus.textContent = "";
    passcodeInput.removeAttribute("aria-invalid");
    loginScreen.hidden = true;
    siteContent.hidden = false;
    playButton.focus();
});

passcodeInput.addEventListener("input", () => {
    loginStatus.textContent = "";
    passcodeInput.removeAttribute("aria-invalid");
});

const video = document.querySelector("#training-video");
const audio = document.querySelector("#training-audio");
const playButton = document.querySelector("#play-together");
const statusMessage = document.querySelector("#play-status");

function pauseTogether() {
    video.pause();
    audio.pause();
}

function reportPlaybackError(error) {
    pauseTogether();
    statusMessage.textContent = "تعذّر تشغيل الفيديو والصوت. تحققي من ملفات الوسائط وحاولي مرة أخرى.";
    console.error("Could not start synchronized playback:", error);
}

async function playTogether() {
    if (video.ended || audio.ended) {
        video.currentTime = 0;
        audio.currentTime = 0;
    } else {
        audio.currentTime = video.currentTime;
    }

    try {
        await Promise.all([video.play(), audio.play()]);
        statusMessage.textContent = "الفيديو والتسجيل الصوتي يعملان معًا.";
    } catch (error) {
        reportPlaybackError(error);
    }
}

playButton.addEventListener("click", () => {
    if (!video.paused || !audio.paused) {
        pauseTogether();
        statusMessage.textContent = "تم إيقاف الفيديو والصوت مؤقتًا.";
        return;
    }

    void playTogether();
});

video.addEventListener("play", () => {
    if (audio.paused) {
        audio.currentTime = video.currentTime;
        audio.play().catch(reportPlaybackError);
    }
    playButton.textContent = "إيقاف الفيديو والصوت مؤقتًا";
});

video.addEventListener("pause", () => {
    audio.pause();
    playButton.textContent = "استئناف الفيديو والصوت";
});

video.addEventListener("seeking", () => {
    audio.currentTime = video.currentTime;
});

video.addEventListener("timeupdate", () => {
    if (!audio.paused && Math.abs(audio.currentTime - video.currentTime) > 0.35) {
        audio.currentTime = video.currentTime;
    }
});

video.addEventListener("ended", () => {
    audio.pause();
    playButton.textContent = "إعادة تشغيل الفيديو والصوت";
    statusMessage.textContent = "انتهى التدريب.";
});

audio.addEventListener("ended", () => {
    if (!video.ended) {
        statusMessage.textContent = "انتهى التسجيل الصوتي، ويستمر الفيديو.";
    }
});

video.addEventListener("error", () => {
    reportPlaybackError(video.error);
});

audio.addEventListener("error", () => {
    reportPlaybackError(audio.error);
});