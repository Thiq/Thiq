package net.conji.thiq.listeners;

import java.util.logging.Level;
import java.util.logging.Logger;
import javax.script.Invocable;
import javax.script.ScriptException;

import net.conji.thiq.Thiq;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.hanging.*;
import org.bukkit.event.Event;

public class HangingListener implements Listener {
    Thiq plugin;

    public HangingListener(Thiq plugin) {
        this.plugin = plugin;
        plugin.getServer().getPluginManager().registerEvents(this, plugin);
    }

    void RaiseEvent(String event, HangingEvent args) {
        Object handler = plugin.js.get("hanging");
        if (handler == null) return;
        Invocable jsI = (Invocable) plugin.js;
        try {
            jsI.invokeMethod(handler, event, args);
        } catch (ScriptException ex) {
            Logger.getLogger(HangingListener.class.getName()).log(Level.SEVERE, null, ex);
        } catch (NoSuchMethodException ex) {

        }
    }

    @EventHandler
    public void BreakByEntity(HangingBreakByEntityEvent event) {
        RaiseEvent("breakByEntity", event);
    }

    @EventHandler
    public void Break(HangingBreakEvent event) {
        RaiseEvent("break", event);
    }

    @EventHandler
    public void Place(HangingPlaceEvent event) {
        RaiseEvent("place", event);
    }
}
