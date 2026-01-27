
const ballContainer = document.querySelector(".ball-container");
const drawButton = document.getElementById("draw-button");
const themeToggleButton = document.getElementById("theme-toggle");

// Function to apply the theme
const applyTheme = (theme) => {
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }

    // Reload Disqus to match the new theme
    if (typeof DISQUS !== 'undefined') {
        DISQUS.reset({
            reload: true,
            config: function () {
                this.page.identifier = document.title;
                this.page.url = window.location.href;
            }
        });
    }
};

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);


// Theme toggle button event listener
themeToggleButton.addEventListener("click", () => {
    let currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        localStorage.setItem('theme', 'light');
        applyTheme('light');
    } else {
        localStorage.setItem('theme', 'dark');
        applyTheme('dark');
    }
});


drawButton.addEventListener("click", () => {
    ballContainer.innerHTML = ""; // Clear previous balls

    const numbers = [];
    while (numbers.length < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        if (!numbers.includes(randomNumber)) {
            numbers.push(randomNumber);
        }
    }

    numbers.sort((a, b) => a - b);

    numbers.forEach(number => {
        const ball = document.createElement("div");
        ball.classList.add("ball");
        ball.textContent = number;
        ball.style.backgroundColor = getLottoColor(number);
        ballContainer.appendChild(ball);
    });
});

function getLottoColor(number) {
    if (number <= 10) return "#fbc400"; // Yellow
    if (number <= 20) return "#69c8f2"; // Blue
    if (number <= 30) return "#ff7272"; // Red
    if (number <= 40) return "#aaaaaa"; // Gray
    return "#b0d840"; // Green
}
