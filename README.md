# BCGAMING Player List

A simple and beautiful player list designed for both QBCore and ESX. At a glance see all the players currently online, their job, admin status, id and more. You can also view the current totals for configurable whitelist jobs (such as police, ambulance and real estate).

## Features

- :gem: Clean and beautiful user interface
- :video_game: View all players online + player jobs and on duty status
- :signal_strength: Player IDs and ping
- :crown: Admin identifiers
- :toolbox: Whitelisted job player totals (configurable)
- :sparkles: Highly configurable - set a custom logo and server name
- :heart: Responsive, one-to-one personal support available via Discord and updates to come!
- :mag: Real-time search and filtering
- :arrows_counterclockwise: Manual and automatic refresh
- :arrow_up_down: Sortable columns (ID, Name, Job, Ping, Admin)
- :hammer: Admin actions (Kick, Ban) with Discord logging
- :chart_with_upwards_trend: Live player count

The script is very well optimised, easy to configure and lightweight. It measures 0ms in resmon.

## Dependencies

QBCore or ESX Legacy

## Installation

1. Place the `BCGAMING-scoreboard` folder in your FiveM server's `resources` directory.
2. Add `start BCGAMING-scoreboard` to your `server.cfg`.
3. Configure the settings in `shared/shared_config.lua`:
   - Set `Framework` to 'qbcore' or 'esx'
   - Customize `WhitelistedJobs`, `LogoURL`, and `ServerName`
   - Set admin permissions with `AdminAce`

## Usage

- Type `/playerlist` in-game to open the player list.
- Use the search bar to filter players by name, job, or ID.
- Click column headers to sort the list (ascending/descending).
- Click "Refresh" to manually update the list.
- The list auto-refreshes every 30 seconds.
- Admins see action buttons (Kick/Ban) for each player.
- View all online players with their details.
- See totals for whitelisted jobs at the bottom.
- Click "Close" or press ESC to close the player list.

## Admin Actions

Admins with the configured ACE permission can:
- **Kick**: Remove a player from the server with a reason
- **Ban**: Ban a player (basic implementation - integrate with your ban system)
- All actions are logged to Discord if webhook is configured

## Configuration

Edit `shared/shared_config.lua` to customize:
- Framework (QBCore or ESX)
- Admin ACE permission
- Whitelisted jobs for totals
- Server logo URL
- Server name
- Discord webhook for admin action logging
- Enable/disable admin actions
- Auto-refresh interval