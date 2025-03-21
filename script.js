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
            div.textContent = i < 10 ? "0" + i : i; // Add leading zero for single-digit numbers
            div.style.top = `${i * 50}px`; // Position each number vertically
            div.addEventListener("click", () => selectItem(parent, div));
            parent.appendChild(div);
        }
    }

    // Function to select an item
    function selectItem(parent, selectedDiv) {
        const items = parent.querySelectorAll("div");
        items.forEach((item) => item.classList.remove("selected"));
        selectedDiv.classList.add("selected");

        // Scroll to the selected item
        const selectedIndex = Array.from(items).indexOf(selectedDiv);
        parent.scrollTop = selectedIndex * 50; // Scroll to the selected item
    }

    // Populate the pickers
    createOptions(hours, 23); // Hours (0-23)
    createOptions(minutes, 59); // Minutes (0-59)
    createOptions(seconds, 59); // Seconds (0-59)

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

    // Add smooth scrolling for pickers
    function enableSmoothScroll(picker) {
        picker.addEventListener("wheel", (e) => {
            e.preventDefault();
            picker.scrollBy({
                top: e.deltaY < 0 ? -50 : 50, // Scroll by 50px per wheel step
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

        // Hide the start button and show pause/cancel buttons
        startBtn.classList.add("hidden");
        pauseBtn.classList.remove("hidden");
        cancelBtn.classList.remove("hidden");

        remainingTime = totalTime;
        const initialHeight = 400; // Updated to match the new height of the cup

        // Set initial liquid height without transition
        const initialLiquidHeight = (remainingTime / totalTime) * initialHeight;
        liquid.style.height = `${initialLiquidHeight}px`;

        // Add the transition after a short delay
        setTimeout(() => {
            liquid.classList.add("animate");
        }, 10); // Small delay to ensure the initial height is set first

        interval = setInterval(() => {
            if (remainingTime <= 0) {
                clearInterval(interval);
                alert("Time's up!");
                resetButtons();
                liquid.classList.remove("red"); // Reset to original color
                liquid.classList.remove("animate"); // Remove transition
                return;
            }

            if (!isPaused) {
                remainingTime--;

                // Update the liquid height
                const liquidHeight = (remainingTime / totalTime) * initialHeight;
                liquid.style.height = `${liquidHeight}px`;

                // Change liquid color to red during the last 5 seconds
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
        isPaused = !isPaused; // Toggle pause state
        pauseBtn.textContent = isPaused ? "Resume" : "Pause"; // Change button text
    });

    // Cancel the timer
    cancelBtn.addEventListener("click", function () {
        clearInterval(interval); // Stop the timer
        resetButtons(); // Reset buttons to initial state
        liquid.style.height = "0"; // Reset liquid height
    });

    // Function to reset buttons to initial state
    function resetButtons() {
        startBtn.classList.remove("hidden");
        pauseBtn.classList.add("hidden");
        cancelBtn.classList.add("hidden");
        pauseBtn.textContent = "Pause"; // Reset pause button text
        isPaused = false; // Reset pause state
    }
});