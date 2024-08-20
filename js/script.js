let leaderboardData = [];

async function loadConfig() {
    try {
        const response = await fetch('assets/config.json');
        if (!response.ok) throw new Error('Failed to load configuration file');
        const data = await response.json();
        leaderboardData = data.users;
        if (leaderboardData.length === 0) {
            throw new Error('No user data found in the configuration file');
        }
        renderLeaderboard();
        populateUserSelect();
    } catch (error) {
        console.error('Error loading config:', error.message);
        showNoUserDataAlert();
    }
}

function renderLeaderboard() {
    const tbody = document.getElementById('leaderboard');
    tbody.innerHTML = ''; // Clear current rows

    if (leaderboardData.length === 0) {
        showNoUserDataAlert();
        return;
    }

    leaderboardData.sort((a, b) => b.todaySales - a.todaySales);

    leaderboardData.forEach((entry, index) => {
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>
                    <img src="assets/user_photos/${entry.photo}" alt="${entry.name}">
                    ${entry.name}
                </td>
                <td>RM${entry.todaySales.toFixed(2)}</td>
                <td>RM${entry.target.toFixed(2)}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });

    updateTotalSalesAlert();
}

function populateUserSelect() {
    const userSelect = document.getElementById('user');
    userSelect.innerHTML = '';

    if (leaderboardData.length === 0) {
        showNoUserDataAlert();
        return;
    }

    leaderboardData.forEach(user => {
        const option = document.createElement('option');
        option.value = user.name;
        option.textContent = user.name;
        userSelect.appendChild(option);
    });

    document.getElementById('updateSalesBtn').disabled = false; // Enable the update button
}

function showNoUserDataAlert() {
    document.getElementById('noUserDataAlert').classList.remove('d-none');
    document.getElementById('updateSalesBtn').disabled = true; // Disable the update button
}

function updateSales() {
    const user = document.getElementById('user').value;
    const sales = parseFloat(document.getElementById('sales').value);
    const target = parseFloat(document.getElementById('target').value);

    const entry = leaderboardData.find(item => item.name === user);
    if (entry) {
        entry.todaySales += sales;
        if (!isNaN(target)) entry.target = target;
        const timestamp = new Date().toLocaleString();
        console.log(`Updated ${user} with RM${sales.toFixed(2)} sales and target RM${target.toFixed(2)} on ${timestamp}`);
    }

    renderLeaderboard();
    const modal = bootstrap.Modal.getInstance(document.getElementById('updateModal'));
    modal.hide();
}

function resetLeaderboard() {
    leaderboardData = leaderboardData.map(entry => ({
        ...entry,
        todaySales: 0,
        target: entry.target // Keep the target the same
    }));
    renderLeaderboard();
}

function updateTotalSalesAlert() {
    const totalSales = leaderboardData.reduce((sum, entry) => sum + entry.todaySales, 0);
    const totalSalesAlert = document.getElementById('totalSalesAlert');
    totalSalesAlert.innerText = `Total Sales for Today: RM${totalSales.toFixed(2)}`;
}

function exportData() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Rank,Name,Daily Sales,Target Sales\n";

    leaderboardData.forEach((entry, index) => {
        const row = `${index + 1},${entry.name},RM${entry.todaySales.toFixed(2)},RM${entry.target.toFixed(2)}`;
        csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "daily_achievement_leaderboard.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function updateClock() {
    const clockElement = document.getElementById('clock');
    const now = new Date();
    clockElement.innerText = now.toLocaleString();
}

function filterByDate(period) {
    alert(`Filtering leaderboard by: ${period}`); // Placeholder for the actual filter logic
    // Implement actual filtering logic based on the selected period
}

// Load the configuration and render the leaderboard
loadConfig();
updateClock();
setInterval(updateClock, 1000); // Update the clock every second
