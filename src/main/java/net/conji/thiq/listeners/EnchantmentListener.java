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
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.enchantment.*;
import org.bukkit.event.inventory.InventoryEvent;

/**
 *
 * @author Conji
 */
public class EnchantmentListener implements Listener {
    Thiq plugin;
    public EnchantmentListener(Thiq plugin) {
        this.plugin = plugin;
        plugin.getServer().getPluginManager().registerEvents(this, plugin);
    }
    
    void RaiseEvent(String event, InventoryEvent arg) {
        Object handler = plugin.js.get("enchantment");
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
    public void Enchant(EnchantItemEvent event) {
        RaiseEvent("enchant", event);
    }
    @EventHandler
    public void Prepare(PrepareItemEnchantEvent event) {
        RaiseEvent("prepare", event);
    }
}
