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
import org.getspout.spoutapi.event.spout.*;
import org.getspout.spoutapi.event.screen.*;
import org.getspout.spoutapi.event.slot.*;
import org.getspout.spoutapi.event.input.*;

/**
 *
 * @author Conji
 */
public class SpoutListener implements Listener {

    Thiq plugin;

    public SpoutListener(Thiq plugin) {
        this.plugin = plugin;
        plugin.getServer().getPluginManager().registerEvents(this, plugin);
    }

    void RaiseEvent(String event, String sub, Event arg) {
        String path = "spout";
        if (!sub.isEmpty()) {
            path += "." + sub;
        }
        try {
            Object handler = plugin.js.eval(path);
            if (handler == null) {
                return;
            }
            Invocable jsI = (Invocable) plugin.js;
            jsI.invokeMethod(handler, event, arg);
        } catch (ScriptException ex) {
            Logger.getLogger(BlockListener.class.getName()).log(Level.SEVERE, null, ex);
        } catch (NoSuchMethodException ex) {
        }
    }

    @EventHandler
    public void onTick(ServerTickEvent event) {
        RaiseEvent("tick", "", event);
    }

    @EventHandler
    public void onSpoutEnable(SpoutCraftEnableEvent event) {
        RaiseEvent("enable", "", event);
    }

    @EventHandler
    public void onSpoutFailed(SpoutcraftFailedEvent event) {
        RaiseEvent("failed", "", event);
    }

    @EventHandler
    public void onScreenOpen(ScreenOpenEvent event) {
        RaiseEvent("open", "screen", event);
    }

    @EventHandler
    public void onScreenClose(ScreenCloseEvent event) {
        RaiseEvent("close", "screen", event);
    }

    @EventHandler
    public void onScreenDrag(SliderDragEvent event) {
        RaiseEvent("sliderDrag", "screen", event);
    }

    @EventHandler
    public void onScreenText(TextFieldChangeEvent event) {
        RaiseEvent("textChanged", "screen", event);
    }

    @EventHandler
    public void onScreenShot(ScreenshotReceivedEvent event) {
        RaiseEvent("screenshot", "screen", event);
    }

    @EventHandler
    public void onScreenClick(ButtonClickEvent event) {
        RaiseEvent("buttonClick", "screen", event);
    }
    
    @EventHandler
    public void onSlotExchange(SlotExchangeEvent event) {
        RaiseEvent("exchange", "slot", event);
    }
    
    @EventHandler
    public void onSlotPut(SlotPutEvent event) {
        RaiseEvent("put", "slot", event);
    }
    
    @EventHandler
    public void onSlotShiftClick(SlotShiftClickEvent event) {
        RaiseEvent("shiftClick", "slot", event);
    }
    
    @EventHandler
    public void onSlotTake(SlotTakeEvent event) {
        RaiseEvent("take", "slot", event);
    }
    
    @EventHandler
    public void onKeyBind(KeyBindingEvent event) {
        RaiseEvent("bind", "key", event);
    }
    
    @EventHandler
    public void onKeyPress(KeyPressedEvent event) {
        RaiseEvent("press", "key", event);
    }
    
    @EventHandler
    public void onKeyRelease(KeyReleasedEvent event) {
        RaiseEvent("release", "key", event);
    }
    
    @EventHandler
    public void onKeyRender(RenderDistanceChangeEvent event) {
        RaiseEvent("renderDistance", "key", event);
    }
}
