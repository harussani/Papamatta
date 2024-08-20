let leaderboardData = [];

async function loadConfig() {
    try {
        const response = await fetch('assets/config.json');
        if (!response.ok) throw new Error('Failed to load configuration file');
        const data = await response.json();
        leaderboardData = data.users;
        renderLeaderboard();
    } catch (error) {
        console.error('Error loading config:', error.message);
    }
}

function renderLeaderboard() {
    const table = document.querySelector('#leaderboard table');
    table.innerHTML = ''; // Clear current rows

    leaderboardData.sort((a, b) => b.todaySales - a.todaySales);

    leaderboardData.forEach((entry, index) => {
        const row = `
            <tr>
                <td class="number">${index + 1}</td>
                <td class="name">
                    <img src="assets/user_photos/${entry.photo}" alt="${entry.name}" class="user-photo">
                    ${entry.name}
                </td>
                <td class="points">
                    RM${entry.todaySales.toFixed(2)}
                    ${index === 0 ? `<img class="gold-medal" src="path/to/gold-medal.png" alt="gold medal"/>` : ''}
                </td>
            </tr>
        `;
        table.innerHTML += row;
    });
}

function exitPage() {
    alert("Exiting the page...");
    // Add functionality to exit or redirect
}

function continueGame() {
    alert("Continuing the game...");
    // Add functionality to continue the game
}

// Load the configuration and render the leaderboard
loadConfig();
