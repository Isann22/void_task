// Real-time clock update
function updateClock() {
    const now = new Date();
    document.getElementById('current-time').textContent =
        now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
setInterval(updateClock, 1000);
updateClock(); // Initial call