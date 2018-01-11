/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package net.conji.thiq;

import java.io.*;
import java.lang.reflect.Field;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.*;
import java.util.logging.Level;
import javax.script.*;

import net.conji.thiq.listeners.*;
import org.apache.commons.io.IOUtils;
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
    
    public void onEnable() {
        reload(true);

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
        reload(false);
        sender.sendMessage("JavaScript has been reloaded");
        return true;
    }

    void initializeJsEngine() {
        try {
            ScriptEngineManager sem = new ScriptEngineManager();
            js = sem.getEngineByName("JavaScript");
            js.put("loader", new ScriptLoader(js));
            js.put("engine", js);
            try {
                js.eval("function eval(input) { return engine.eval(input); }");
            } catch (ScriptException ex) {
                getLogger().log(Level.SEVERE, ex.getMessage());;
            }
            js.eval("function __global__(key, value) { engine.put(key, value); }");
            js.eval("function load(file){return loader.load(file);}function getServer(){return loader.getServer();}");

            String main = IOUtils.toString(getResource("plugin.js")).replace('\t', ' ');
            js.eval(main);
        } catch (FileNotFoundException ex) {
            getLogger().log(Level.SEVERE, null, ex);
        } catch (ScriptException ex) {
            getLogger().log(Level.SEVERE, null, ex);
        } catch (IOException ex) {
            getLogger().log(Level.SEVERE, "Could not locate entry JS.", ex);
        }
    }
    
    void reload(boolean fullReload) {
        if (fullReload) {
            initializeJsEngine();
        } else {
            try {
                js.eval("__reloadJs()");
            } catch (ScriptException ex) {
                getLogger().log(Level.SEVERE, null, ex);
            }
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

        public void loadCoreFile(String name) throws ScriptException, IOException {
            String contents = IOUtils.toString(getResource("core/" + name + ".js"));
            engine.eval(contents);
        }

        public void loadCoreData() throws ScriptException, IOException {
            String contents = IOUtils.toString(getResource("core/data.json"));
            engine.eval("global.__blockdata = " + contents);
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
        }
    }
}