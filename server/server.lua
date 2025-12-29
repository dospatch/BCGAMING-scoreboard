-- BCGAMING Player List Server Script

local QBCore = nil
local ESX = nil

if Config.Framework == 'qbcore' then
    QBCore = exports['qb-core']:GetCoreObject()
elseif Config.Framework == 'esx' then
    TriggerEvent('esx:getSharedObject', function(obj) ESX = obj end)
end

function GetPlayerData(source)
    local data = {
        id = source,
        name = GetPlayerName(source),
        ping = GetPlayerPing(source),
        admin = IsPlayerAceAllowed(source, Config.AdminAce),
        job = 'Unemployed',
        onduty = false
    }

    if QBCore then
        local Player = QBCore.Functions.GetPlayer(source)
        if Player then
            data.job = Player.PlayerData.job.label
            data.onduty = Player.PlayerData.job.onduty
        end
    elseif ESX then
        local xPlayer = ESX.GetPlayerFromId(source)
        if xPlayer then
            data.job = xPlayer.job.label
            data.onduty = xPlayer.job.name ~= 'unemployed'
        end
    end

    return data
end

function SendDiscordLog(action, adminName, targetName, targetId)
    if Config.DiscordWebhook ~= '' then
        PerformHttpRequest(Config.DiscordWebhook, function(err, text, headers) end, 'POST', json.encode({
            username = 'BCGAMING Player List',
            embeds = {{
                title = 'Admin Action',
                description = string.format('**Admin:** %s\n**Action:** %s\n**Target:** %s (ID: %s)', adminName, action, targetName, targetId),
                color = 16711680,
                timestamp = os.date('!%Y-%m-%dT%H:%M:%SZ')
            }}
        }), { ['Content-Type'] = 'application/json' })
    end
end

RegisterNetEvent('adminKick')
AddEventHandler('adminKick', function(targetId, reason)
    local source = source
    if IsPlayerAceAllowed(source, Config.AdminAce) then
        local adminName = GetPlayerName(source)
        local targetName = GetPlayerName(targetId)
        DropPlayer(targetId, 'Kicked by admin: ' .. (reason or 'No reason'))
        SendDiscordLog('Kick', adminName, targetName, targetId)
        TriggerClientEvent('chat:addMessage', source, {args = {'^2Player ' .. targetName .. ' has been kicked.'}})
    end
end)

RegisterNetEvent('adminBan')
AddEventHandler('adminBan', function(targetId, reason)
    local source = source
    if IsPlayerAceAllowed(source, Config.AdminAce) then
        -- Note: This is a simple ban. For production, use a proper ban system
        local adminName = GetPlayerName(source)
        local targetName = GetPlayerName(targetId)
        -- Add to ban list (implement your ban system here)
        DropPlayer(targetId, 'Banned by admin: ' .. (reason or 'No reason'))
        SendDiscordLog('Ban', adminName, targetName, targetId)
        TriggerClientEvent('chat:addMessage', source, {args = {'^2Player ' .. targetName .. ' has been banned.'}})
    end
end)

RegisterNetEvent('requestPlayerList')
AddEventHandler('requestPlayerList', function()
    local source = source
    local players = {}
    for _, player in ipairs(GetPlayers()) do
        table.insert(players, GetPlayerData(player))
    end

    local totals = GetJobTotals()

    TriggerClientEvent('openPlayerList', source, {
        players = players,
        totals = totals,
        logo = Config.LogoURL,
        serverName = Config.ServerName
    })
end)