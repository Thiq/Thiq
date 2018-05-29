package net.conji.thiq;

import jdk.nashorn.api.scripting.ScriptObjectMirror;
import org.bukkit.Bukkit;
import org.bukkit.event.Event;
import org.bukkit.event.EventPriority;
import org.bukkit.event.Listener;
import org.bukkit.plugin.EventExecutor;

public class ThiqListener implements Listener {

    public EventExecutor getExecutor(ScriptObjectMirror jsFunction) {
        return (listener, event) -> {
            jsFunction.call(jsFunction, event);
        };
    }

    public void registerEvent(Class clazz, ScriptObjectMirror jsFunction) {
        EventExecutor exec = (listener, event) -> {
            jsFunction.call(jsFunction, event);
        };
        Class<? extends Event> eventClass = (Class<? extends Event>)clazz;
        Bukkit.getPluginManager().registerEvent(eventClass, this, EventPriority.NORMAL, exec, Bukkit.getPluginManager().getPlugin("Thiq"));
    }
}
