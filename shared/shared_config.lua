-- BCGAMING Player List Shared Config

Config = {
    Framework = 'qbcore', -- 'qbcore' or 'esx'
    AdminAce = 'playerlist.admin',
    WhitelistedJobs = {
        ['police'] = true,
        ['ambulance'] = true,
        ['realestate'] = true
    },
    LogoURL = 'https://i.imgur.com/placeholder.png', -- Replace with your server logo URL
    ServerName = 'BCGAMING Server',
    DiscordWebhook = '', -- Optional: Discord webhook URL for logging admin actions
    AllowAdminActions = true, -- Enable/disable admin action buttons
    AutoRefreshInterval = 30000 -- Auto-refresh interval in milliseconds
}