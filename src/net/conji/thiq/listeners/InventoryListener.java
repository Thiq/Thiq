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
import org.bukkit.event.inventory.*;

/**
 *
 * @author Conji
 */
public class InventoryListener implements Listener {
    Thiq plugin;
    public InventoryListener(Thiq plugin) {
        this.plugin = plugin;
        plugin.getServer().getPluginManager().registerEvents(this, plugin);
    }
    
    void RaiseEvent(String event, Event arg) {
        Object handler = plugin.js.get("inventory");
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
    public void Brew(BrewEvent event) {
        RaiseEvent("brew", event);
    }
    
    @EventHandler
    public void CraftItem(CraftItemEvent event) {
        RaiseEvent("craft", event);
    }
    
    @EventHandler
    public void FurnaceBurn(FurnaceBurnEvent event) {
        RaiseEvent("burn", event);
    }
    
    @EventHandler
    public void FurnaceSmelt(FurnaceSmeltEvent event) {
        RaiseEvent("smelt", event);
    }
    
    @EventHandler
    public void Click(InventoryClickEvent event) {
        RaiseEvent("click", event);
    }
    
    @EventHandler
    public void Close(InventoryCloseEvent event) {
        RaiseEvent("close", event);
    }
    
    @EventHandler
    public void Open(InventoryOpenEvent event) {
        RaiseEvent("open", event);
    }
    
    @EventHandler
    public void PrepareItemCraft(PrepareItemCraftEvent event) {
        RaiseEvent("prepareCraft", event);
    }
}
