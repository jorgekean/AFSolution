
// dark mode setup
document.addEventListener("DOMContentLoaded", function () {
   /* const darkModeToggle = document.getElementById("darkModeToggle");*/

    // Check local storage for dark mode preference
    if (localStorage.getItem("darkMode") === "enabled") {
        document.documentElement.classList.add("dark");
    }

    //// Toggle dark mode on button click
    //darkModeToggle.addEventListener("click", function () {
    //    toggleDarkMode();
    //});
});


function toggleDarkMode() {
    document.documentElement.classList.toggle("dark");

    localStorage.setItem("darkMode", document.documentElement.classList.contains("dark") ? "enabled" : "disabled");
    // showToast(document.documentElement.classList.contains("dark") ? "Dark mode enabled" : "Light mode enabled");
}