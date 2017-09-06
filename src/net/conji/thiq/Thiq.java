/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package net.conji.thiq;

import java.io.*;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Vector;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.script.*;

import net.conji.thiq.listeners.*;
import org.bukkit.Server;
import org.bukkit.command.Command;
import org.bukkit.command.CommandSender;
import org.bukkit.event.Listener;
import org.bukkit.plugin.java.JavaPlugin;

/**
 *
 * @author Conji
 */
public class Thiq extends JavaPlugin {
    public ScriptEngine js;
    HashMap<String, Object> persistence;
    Listener block;
    Listener enchantment;
    Listener entity;
    Listener inventory;
    Listener painting;
    Listener player;
    Listener server;
    Listener vehicle;
    Listener weather;
    Listener world;
    Listener spout;
    
    public void onEnable() {
        Reload(true);

        block = new BlockListener(this);
        enchantment = new EnchantmentListener(this);
        entity = new EntityListener(this);
        inventory = new InventoryListener(this);
        player = new PlayerListener(this);
        server = new ServerListener(this);
        vehicle = new VehicleListener(this);
        weather = new WeatherListener(this);
        world = new WorldListener(this);
        
        if (getServer().getPluginManager().getPlugin("Spout") != null) {
            spout = new SpoutListener(this);
        }
    }
    
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        Reload(args.length > 0 && args[0].equalsIgnoreCase("-p"));
        sender.sendMessage("JavaScript has been reloaded");
        return true;
    }
    
    void Reload(boolean pers) {
        if (pers) persistence = new HashMap<String, Object>();
        try {
            ScriptEngineManager sem = new ScriptEngineManager();
            js = sem.getEngineByName("JavaScript");
            js.put("persistence", persistence);
            js.put("loader", new ScriptLoader());
            js.put("engine", js);
            js.eval("function __global__(key, value) { engine.put(key, value); }");
            js.eval("function load(file){return loader.load(file);}function getServer(){return loader.getServer();}");
            js.eval(new FileReader(getConfig().getString("script")));
        } catch (FileNotFoundException ex) {
            Logger.getLogger(Thiq.class.getName()).log(Level.SEVERE, null, ex);
        } catch (ScriptException ex) {
            Logger.getLogger(Thiq.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    
    public JsCommandExecutor createCommand(String name, String description, String usage, List<String> aliases, JsCommand command) {
        return new JsCommandExecutor(name, description, usage, aliases, command);
    }

    public class ScriptLoader {
        public void Run(Object r) {
            Invocable inv = (Invocable) js;
            Runnable runnable = inv.getInterface(r, Runnable.class);
            new Thread(runnable).start();
        }
        public Object Interface(Object o, Class i) {
            Invocable inv = (Invocable) js;
            return inv.getInterface(o, i);
        }
        public Server getServer() {return Thiq.this.getServer();}
        public Object load(String file) throws FileNotFoundException, ScriptException {
            return js.eval(new FileReader(file));
        }

        public Class<?> findClass(String className) {
            try {
                return Class.forName(className);
            } catch (Exception e) {
                return null;
            }
        }

        public List<Class<?>> find(String scannedPackage) {
            try {
                Field f = ClassLoader.class.getDeclaredField("classes");
                f.setAccessible(true);

                ClassLoader classLoader = ClassLoader.getSystemClassLoader();
                ArrayList<Class<?>> foundClasses = new ArrayList<Class<?>>();
                Vector<Class> classes =  (Vector<Class>) f.get(classLoader);
                for (Class<?> c : classes) {
                    if (c.getName().startsWith(scannedPackage)) {
                        foundClasses.add(c);
                    }
                }
                return foundClasses;
            } catch (Exception e) {
                return null;
            }

        }
    }
}