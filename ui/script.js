document.addEventListener('DOMContentLoaded', function() {
    const playerlist = document.getElementById('playerlist').querySelector('tbody');
    const totalsDiv = document.getElementById('totals');
    const closeBtn = document.getElementById('closeBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    const searchInput = document.getElementById('search');
    const logo = document.getElementById('logo');
    const serverName = document.getElementById('serverName');
    const playerCount = document.getElementById('playerCount');
    const headers = document.querySelectorAll('th[data-sort]');

    let allPlayers = [];
    let allTotals = {};
    let currentSort = { column: 'id', direction: 'asc' };

    closeBtn.addEventListener('click', function() {
        fetch(`https://${GetParentResourceName()}/close`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
    });

    refreshBtn.addEventListener('click', function() {
        fetch(`https://${GetParentResourceName()}/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
    });

    searchInput.addEventListener('input', function() {
        filterAndDisplayPlayers();
    });

    headers.forEach(header => {
        header.addEventListener('click', function() {
            const column = this.getAttribute('data-sort');
            if (currentSort.column === column) {
                currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
            } else {
                currentSort.column = column;
                currentSort.direction = 'asc';
            }
            updateSortIndicators();
            filterAndDisplayPlayers();
        });
    });

    window.addEventListener('message', function(event) {
        if (event.data.type === 'open') {
            logo.src = event.data.logo;
            serverName.textContent = event.data.serverName;
            allPlayers = event.data.players;
            allTotals = event.data.totals;
            playerCount.textContent = allPlayers.length;
            updateSortIndicators();
            filterAndDisplayPlayers();
            displayTotals(allTotals);
        }
    });

    function displayPlayers(players) {
        playerlist.innerHTML = '';
        players.forEach(player => {
            const row = document.createElement('tr');
            let actions = '';
            if (player.admin && Config.AllowAdminActions) {
                actions = `
                    <button class="action-btn" onclick="performAction('kick', ${player.id})">Kick</button>
                    <button class="action-btn" onclick="performAction('ban', ${player.id})">Ban</button>
                `;
            }
            row.innerHTML = `
                <td>${player.id}</td>
                <td>${player.name}</td>
                <td>${player.job}${player.onduty ? ' (On Duty)' : ''}</td>
                <td>${player.ping}ms</td>
                <td>${player.admin ? 'Yes' : 'No'}</td>
                <td>${actions}</td>
            `;
            playerlist.appendChild(row);
        });
    }

    function displayTotals(totals) {
        totalsDiv.innerHTML = '<h3>Job Totals:</h3>';
        for (const [job, count] of Object.entries(totals)) {
            const p = document.createElement('p');
            p.textContent = `${job.charAt(0).toUpperCase() + job.slice(1)}: ${count}`;
            totalsDiv.appendChild(p);
        }
    }

    function sortPlayers(players) {
        return players.sort((a, b) => {
            let aVal = a[currentSort.column];
            let bVal = b[currentSort.column];

            if (currentSort.column === 'ping') {
                aVal = parseInt(aVal);
                bVal = parseInt(bVal);
            } else if (currentSort.column === 'admin') {
                aVal = aVal ? 1 : 0;
                bVal = bVal ? 1 : 0;
            }

            if (currentSort.direction === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });
    }

    function filterAndDisplayPlayers() {
        const query = searchInput.value.toLowerCase();
        let filtered = allPlayers.filter(player =>
            player.name.toLowerCase().includes(query) ||
            player.job.toLowerCase().includes(query) ||
            player.id.toString().includes(query)
        );
        filtered = sortPlayers(filtered);
        displayPlayers(filtered);
    }

    function updateSortIndicators() {
        headers.forEach(header => {
            const column = header.getAttribute('data-sort');
            if (column === currentSort.column) {
                header.textContent = header.textContent.replace(/[▼▲]/g, '') + (currentSort.direction === 'asc' ? ' ▲' : ' ▼');
            } else {
                header.textContent = header.textContent.replace(/[▼▲]/g, '') + ' ▼';
            }
        });
    }

    window.performAction = function(action, targetId) {
        const reason = prompt(`Enter reason for ${action}:`);
        if (reason !== null) {
            fetch(`https://${GetParentResourceName()}/adminAction`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: action, targetId: targetId, reason: reason })
            });
        }
    };

    // Auto-refresh
    setInterval(function() {
        fetch(`https://${GetParentResourceName()}/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
    }, 30000); // Config.AutoRefreshInterval not available in JS, hardcoded

    // ESC to close
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            fetch(`https://${GetParentResourceName()}/close`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            });
        }
    });
});