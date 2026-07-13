const timerElement = document.getElementById('timer');
const startPauseButton = document.getElementById('startPause');
const skipButton = document.getElementById('skip');

let isRunning = false;
let remainingTime = 1500; // 25 minutes in seconds
let breakCount = 0;
let interval;

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function startPauseTimer() {
    if (isRunning) {
        clearInterval(interval);
    } else {
        interval = setInterval(updateTimer, 1000);
    }
    isRunning = !isRunning;
    updateButtonLabel();
}

function skipBlock() {
    remainingTime = 0; // Skip to the end of the current block
}

function updateTimer() {
    if (remainingTime <= 0) {
        clearInterval(interval);
        breakCount++;
        let message, title;

        if (breakCount % 3 === 0) {
            remainingTime = 900; // 15 minutes in seconds for long break
            title = "Long Break";
            message = "Let's take a long break!";
        } else {
            remainingTime = 300; // 5 minutes in seconds for short break
            title = "Break Over";
            message = "Time to get productive!";
        }

        sendNotification(title, message);
        isRunning = false;
    } else {
        remainingTime--;
    }
    timerElement.textContent = formatTime(remainingTime);
}

function updateButtonLabel() {
    startPauseButton.textContent = isRunning ? 'Pause' : (interval ? 'Resume' : 'Start');
}

function sendNotification(title, message) {
    if (!("Notification" in window)) {
        console.log("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
        new Notification(title, { body: message });
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification(title, { body: message });
            }
        });
    }
}

startPauseButton.addEventListener('click', startPauseTimer);
skipButton.addEventListener('click', skipBlock);

// Request permission for notifications when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (!("Notification" in window)) {
        console.log("This browser does not support desktop notification");
    } else if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                // Permission was granted
            }
        });
    }
});

// Optional: Add service worker for PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
            console.log('Service Worker registered with scope:', registration.scope);
        }, function(err) {
            console.log('Service Worker registration failed:', err);
        });
    });
}
