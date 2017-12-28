/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package net.conji.thiq.listeners;

import java.util.logging.Level;
import java.util.logging.Logger;
import javax.script.Invocable;
import javax.script.ScriptException;

import net.conji.thiq.Thiq;
import org.bukkit.event.Event;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.server.*;

/**
 *
 * @author Conji
 */
public class ServerListener implements Listener {
    Thiq plugin;
    public ServerListener(Thiq plugin) {
        this.plugin = plugin;
        plugin.getServer().getPluginManager().registerEvents(this, plugin);
    }
    
    void RaiseEvent(String event, Event arg) {
        Object handler = plugin.js.get("server");
        if (handler == null) return;
        Invocable jsI = (Invocable) plugin.js;
        try {
            jsI.invokeMethod(handler, event, arg);
        } catch (ScriptException ex) {
            Logger.getLogger(BlockListener.class.getName()).log(Level.SEVERE, null, ex);
        } catch (NoSuchMethodException ex) {
        }
    }

    @EventHandler
    public void MapInitialize(MapInitializeEvent event) {
        RaiseEvent("mapInit", event);
    }
    
    @EventHandler
    public void PluginDisable(PluginDisableEvent event) {
        RaiseEvent("pluginDisable", event);
    }
    
    @EventHandler
    public void PluginEnable(PluginEnableEvent event) {
        RaiseEvent("pluginEnable", event);
    }
    
    @EventHandler
    public void RemoteCommand(RemoteServerCommandEvent event) {
        RaiseEvent("remoteCommand", event);
    }
    
    @EventHandler
    public void ServerCommand(ServerCommandEvent event) {
        RaiseEvent("command", event);
    }
    
    @EventHandler
    public void ServerListPing(ServerListPingEvent event) {
        RaiseEvent("ping", event);
    }
    
    @EventHandler
    public void ServiceRegister(ServiceRegisterEvent event) {
        RaiseEvent("serviceRegister", event);
    }
    
    @EventHandler
    public void ServiceUnregister(ServiceUnregisterEvent event) {
        RaiseEvent("serviceUnregister", event);
    }

    @EventHandler
    public void TabComplete(TabCompleteEvent event) {
        RaiseEvent("tabComplete", event);
    }
}
