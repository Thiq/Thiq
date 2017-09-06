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
import org.bukkit.event.vehicle.*;

/**
 *
 * @author Conji
 */
public class VehicleListener implements Listener {
    Thiq plugin;
    public VehicleListener(Thiq plugin) {
        this.plugin = plugin;
        plugin.getServer().getPluginManager().registerEvents(this, plugin);
    }
    
    void RaiseEvent(String event, Event arg) {
        Object handler = plugin.js.get("vehicle");
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
    public void BlockCollision(VehicleBlockCollisionEvent event) {
        RaiseEvent("blockCollision", event);
    }
    
    //@EventHandler
    public void Collision(VehicleCollisionEvent event) {
        RaiseEvent("collision", event);
    }
    
    @EventHandler
    public void Create(VehicleCreateEvent event) {
        RaiseEvent("create", event);
    }
    
    @EventHandler
    public void Damage(VehicleDamageEvent event) {
        RaiseEvent("damage", event);
    }
    
    @EventHandler
    public void Destroy(VehicleDestroyEvent event) {
        RaiseEvent("destroy", event);
    }
    
    @EventHandler
    public void Enter(VehicleEnterEvent event) {
        RaiseEvent("enter", event);
    }
    
    @EventHandler
    public void EntityCollision(VehicleEntityCollisionEvent event) {
        RaiseEvent("entityCollision", event);
    }
    
    @EventHandler
    public void Exit(VehicleExitEvent event) {
        RaiseEvent("exit", event);
    }
    
    @EventHandler
    public void Move(VehicleMoveEvent event) {
        RaiseEvent("move", event);
    }
}
