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
import org.bukkit.event.world.*;

/**
 *
 * @author Conji
 */
public class WorldListener implements Listener {
    Thiq plugin;
    public WorldListener(Thiq plugin) {
        this.plugin = plugin;
        plugin.getServer().getPluginManager().registerEvents(this, plugin);
    }
    
    void RaiseEvent(String event, Event arg) {
        Object handler = plugin.js.get("world");
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
    public void ChunkLoad(ChunkLoadEvent event) {
        RaiseEvent("chunkLoad", event);
    }
    
    @EventHandler
    public void ChunkPopulate(ChunkPopulateEvent event) {
        RaiseEvent("chunkPopulate", event);
    }
    
    @EventHandler
    public void ChunkUnload(ChunkUnloadEvent event) {
        RaiseEvent("chunkUnload", event);
    }
    
    @EventHandler
    public void PortalCreate(PortalCreateEvent event) {
        RaiseEvent("portalCreate", event);
    }
    
    @EventHandler
    public void SpawnChange(SpawnChangeEvent event) {
        RaiseEvent("spawnChange", event);
    }
    
    @EventHandler
    public void StructureGrow(StructureGrowEvent event) {
        RaiseEvent("structureGrow", event);
    }
    
    @EventHandler
    public void WorldInit(WorldInitEvent event) {
        RaiseEvent("init", event);
    }
    
    @EventHandler
    public void WorldLoad(WorldLoadEvent event) {
        RaiseEvent("load", event);
    }
    
    @EventHandler
    public void WorldSave(WorldSaveEvent event) {
        RaiseEvent("save", event);
    }
    
    @EventHandler
    public void WorldUnload(WorldUnloadEvent event) {
        RaiseEvent("unload", event);
    }
}
