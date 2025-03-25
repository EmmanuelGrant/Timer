document.addEventListener("DOMContentLoaded", function () {
    const hours = document.getElementById("hours");
    const minutes = document.getElementById("minutes");
    const seconds = document.getElementById("seconds");
    const startBtn = document.getElementById("start-btn");
    const pauseBtn = document.getElementById("pause-btn");
    const cancelBtn = document.getElementById("cancel-btn");
    const liquid = document.getElementById("liquid");

    let interval;
    let remainingTime;
    let isPaused = false;

    // Function to create number options
    function createOptions(parent, max) {
        for (let i = 0; i <= max; i++) {
            let div = document.createElement("div");
            div.textContent = i < 10 ? "0" + i : i;
            div.style.top = `${i * 50}px`;
            div.addEventListener("click", () => selectItem(parent, div));
            parent.appendChild(div);
        }
    }

    // Function to select an item
    function selectItem(parent, selectedDiv) {
        const items = parent.querySelectorAll("div");
        items.forEach((item) => item.classList.remove("selected"));
        selectedDiv.classList.add("selected");

        const selectedIndex = Array.from(items).indexOf(selectedDiv);
        parent.scrollTop = selectedIndex * 50;
    }

    // Populate the pickers
    createOptions(hours, 23);
    createOptions(minutes, 59);
    createOptions(seconds, 59);

    // Auto-select the first item
    function selectFirstItem(parent) {
        const firstItem = parent.querySelector("div");
        if (firstItem) {
            selectItem(parent, firstItem);
        }
    }

    selectFirstItem(hours);
    selectFirstItem(minutes);
    selectFirstItem(seconds);

    // Add smooth scrolling for pickers (mouse and touch)
    function enableSmoothScroll(picker) {
        let isDragging = false;
        let startY, scrollTop;

        // Mouse events
        picker.addEventListener("mousedown", (e) => {
            isDragging = true;
            startY = e.pageY - picker.offsetTop;
            scrollTop = picker.scrollTop;
        });

        picker.addEventListener("mouseleave", () => {
            isDragging = false;
        });

        picker.addEventListener("mouseup", () => {
            isDragging = false;
        });

        picker.addEventListener("mousemove", (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const y = e.pageY - picker.offsetTop;
            const walk = (y - startY) * 1;
            picker.scrollTop = scrollTop - walk;
        });

        // Touch events
        picker.addEventListener("touchstart", (e) => {
            isDragging = true;
            startY = e.touches[0].pageY - picker.offsetTop;
            scrollTop = picker.scrollTop;
        });

        picker.addEventListener("touchend", () => {
            isDragging = false;
        });

        picker.addEventListener("touchmove", (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const y = e.touches[0].pageY - picker.offsetTop;
            const walk = (y - startY) * 1;
            picker.scrollTop = scrollTop - walk;
        });

        // Wheel event (for desktop)
        picker.addEventListener("wheel", (e) => {
            e.preventDefault();
            picker.scrollBy({
                top: e.deltaY < 0 ? -30 : 30,
                behavior: "smooth",
            });
        });
    }

    enableSmoothScroll(hours);
    enableSmoothScroll(minutes);
    enableSmoothScroll(seconds);

    // Start the timer
    startBtn.addEventListener("click", function () {
        const selectedHours = parseInt(hours.querySelector(".selected").textContent);
        const selectedMinutes = parseInt(minutes.querySelector(".selected").textContent);
        const selectedSeconds = parseInt(seconds.querySelector(".selected").textContent);

        const totalTime = selectedHours * 3600 + selectedMinutes * 60 + selectedSeconds;

        if (totalTime <= 0) {
            alert("Please select a valid time!");
            return;
        }

        startBtn.classList.add("hidden");
        pauseBtn.classList.remove("hidden");
        cancelBtn.classList.remove("hidden");

        remainingTime = totalTime;
        const initialHeight = 400;

        const initialLiquidHeight = (remainingTime / totalTime) * initialHeight;
        liquid.style.height = `${initialLiquidHeight}px`;

        setTimeout(() => {
            liquid.classList.add("animate");
        }, 10);

        interval = setInterval(() => {
            if (remainingTime <= 0) {
                clearInterval(interval);
                alert("Time's up!");
                resetButtons();
                liquid.classList.remove("red");
                liquid.classList.remove("animate");
                return;
            }

            if (!isPaused) {
                remainingTime--;

                const cupHeight = document.querySelector('.cup').offsetHeight;

                const liquidHeight = (remainingTime / totalTime) * cupHeight;
                liquid.style.height = `${liquidHeight}px`;

                if (remainingTime <= 5) {
                    liquid.classList.add("red");
                } else {
                    liquid.classList.remove("red");
                }
            }
        }, 1000);
    });

    // Pause the timer
    pauseBtn.addEventListener("click", function () {
        isPaused = !isPaused;
        pauseBtn.textContent = isPaused ? "Resume" : "Pause";
    });

    // Cancel the timer
    cancelBtn.addEventListener("click", function () {
        clearInterval(interval);
        resetButtons();
        liquid.style.height = "0";
    });

    // Function to reset buttons to initial state
    function resetButtons() {
        startBtn.classList.remove("hidden");
        pauseBtn.classList.add("hidden");
        cancelBtn.classList.add("hidden");
        pauseBtn.textContent = "Pause";
        isPaused = false;
    }
});