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
import org.bukkit.event.block.*;

/**
 *
 * @author Conji
 */
public class BlockListener implements Listener {
    Thiq plugin;
    public BlockListener(Thiq plugin) {
        this.plugin = plugin;
        plugin.getServer().getPluginManager().registerEvents(this, plugin);
    }
    
    void RaiseEvent(String event, BlockEvent arg) {
        Object handler = plugin.js.get("block");
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
    public void Break(BlockBreakEvent event) {
        RaiseEvent("bbreak", event);
    }
    @EventHandler
    public void Burn(BlockBurnEvent event) {
        RaiseEvent("burn", event);
    }
    @EventHandler
    public void CanBuild(BlockCanBuildEvent event) {
        RaiseEvent("canBuild", event);
    }
    @EventHandler
    public void Damage(BlockDamageEvent event) {
        RaiseEvent("damage", event);
    }
    @EventHandler
    public void Dispense(BlockDispenseEvent event) {
        RaiseEvent("dispense", event);
    }
    @EventHandler
    public void Exp(BlockExpEvent event) { RaiseEvent("exp", event); }
    @EventHandler
    public void Explode(BlockExplodeEvent event) { RaiseEvent("explode", event); }
    @EventHandler
    public void Fade(BlockFadeEvent event) {
        RaiseEvent("fade", event);
    }
    @EventHandler
    public void Form(BlockFormEvent event) {
        RaiseEvent("form", event);
    }
    @EventHandler
    public void FromTo(BlockFromToEvent event) { RaiseEvent("fromTo", event); }
    @EventHandler
    public void Grow(BlockGrowEvent event) {
        RaiseEvent("grow", event);
    }
    @EventHandler
    public void Ignite(BlockIgniteEvent event) {
        RaiseEvent("ignite", event);
    }
    @EventHandler
    public void MultiPlace(BlockMultiPlaceEvent event) { RaiseEvent("multiPlace", event); }
    @EventHandler
    public void Physics(BlockPhysicsEvent event) {
        RaiseEvent("physics", event);
    }
    @EventHandler
    public void PistonExtend(BlockPistonExtendEvent event) {
        RaiseEvent("pistonExtend", event);
    }
    @EventHandler
    public void PistonRetract(BlockPistonRetractEvent event) {
        RaiseEvent("pistonRetract", event);
    }
    @EventHandler
    public void Place(BlockPlaceEvent event) {
        RaiseEvent("place", event);
    }
    @EventHandler
    public void Redstone(BlockRedstoneEvent event) {
        RaiseEvent("redstone", event);
    }
    @EventHandler
    public void Spread(BlockSpreadEvent event) {
        RaiseEvent("spread", event);
    }
    @EventHandler
    public void CauldronLevelChange(CauldronLevelChangeEvent event) { RaiseEvent("cauldronLevelChange", event); }
    @EventHandler
    public void EntityForm(EntityBlockFormEvent event) {
        RaiseEvent("entityForm", event);
    }
    @EventHandler
    public void LeavesDecay(LeavesDecayEvent event) {
        RaiseEvent("leavesDecay", event);
    }
    @EventHandler
    public void NotePlay(NotePlayEvent event) { RaiseEvent("notePlay", event); }
    @EventHandler
    public void SignChange(SignChangeEvent event) {
        RaiseEvent("signChange", event);
    }
}
