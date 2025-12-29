-- BCGAMING Player List Client Script

RegisterNetEvent('openPlayerList')
AddEventHandler('openPlayerList', function(data)
    SetNuiFocus(true, true)
    SendNUIMessage({
        type = 'open',
        players = data.players,
        totals = data.totals,
        logo = data.logo,
        serverName = data.serverName
    })
end)

-- NUI Callback to close the player list
RegisterNUICallback('close', function(data, cb)
    SetNuiFocus(false, false)
    cb('ok')
end)

-- NUI Callback to refresh the player list
RegisterNUICallback('refresh', function(data, cb)
    TriggerServerEvent('requestPlayerList')
    cb('ok')
end)

-- NUI Callback for admin actions
RegisterNUICallback('adminAction', function(data, cb)
    if data.action == 'kick' then
        TriggerServerEvent('adminKick', data.targetId, data.reason)
    elseif data.action == 'ban' then
        TriggerServerEvent('adminBan', data.targetId, data.reason)
    end
    cb('ok')
end)