/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package net.conji.thiq;

import java.io.*;
import java.lang.reflect.Field;
import java.net.URI;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.*;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.script.*;

import com.avaje.ebean.LogLevel;
import jdk.nashorn.api.scripting.JSObject;
import net.conji.thiq.listeners.*;
import org.bukkit.Server;
import org.bukkit.command.Command;
import org.bukkit.command.CommandSender;
import org.bukkit.event.Listener;
import org.bukkit.plugin.java.JavaPlugin;
import org.jetbrains.annotations.NotNull;

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
            js.put("loader", new ScriptLoader(js));
            js.put("engine", js);
            try {
                // in order for core-js to properly load, we need to temp defined "require" to assign to global variables.
                // for now, it'll work like the essential
                String coreJsPolyfill = getScript("corejs/shim.js");
                String blobPolyfill = getScript("blob-polyfill.js");
                String globalPolyfill = getScript("global-polyfill.js");
                String babel = getScript("babel.js");
                js.eval("function require(module) { return loader.crequire(module); }");
                js.eval(blobPolyfill);
                js.eval(globalPolyfill);
                js.eval(babel);
                js.eval("function eval(input) { return engine.eval(Babel.transform(input, { presets: [ 'es2015' ] }).code); }");
                getLogger().log(Level.INFO, "Using Babel to compile ES2015.");
            } catch (IOException ex) {
                getLogger().log(Level.SEVERE, ex.getMessage());
                js.eval("function eval(input) { return engine.eval(input); }");
                getLogger().log(Level.INFO, "Could not locate ES2015 compiler. Using Nashorn's default compiler.");
            }
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

    private String getScript(String name) throws IOException {
        Path scriptLocation = Paths.get("./plugins/Thiq/" + name);
        List<String> contents = Files.readAllLines(scriptLocation);
        String result = "";
        for (String line: contents) {
            result += line + "\r\n";
        }
        return result;
    }

    public class ScriptLoader {
        ScriptEngine engine;

        public ScriptLoader(ScriptEngine engine) {
            this.engine = engine;
        }

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
            try {
                InputStreamReader stream = new InputStreamReader(new FileInputStream(file), StandardCharsets.UTF_8);
                BufferedReader buffer = new BufferedReader(stream);
                String line = null;
                String result = "";
                while ((line = buffer.readLine()) != null) {
                    result += line + "\r\n";
                }
                return js.eval(result);
            } catch (Exception ex) {
                getLogger().log(Level.SEVERE, ex.toString());
                return null;
            }
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

        public void crequire(String module) throws Exception {
            // if I ever have to hack shit like this again, I'm jumping in front of a train.
            SimpleBindings bindings = new SimpleBindings();
            String contents = getScript(module + ".js");
            engine.eval(contents, bindings);
            getLogger().log(Level.INFO, bindings.get("module").toString());
        }
    }
}