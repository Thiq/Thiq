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

            String main;
            if (new File("./plugins/Thiq/plugin.js").exists()) {
                main = getScript("plugin.js");
            } else {
                main = IOUtils.toString(getResource("plugin.js")).replace('\t', ' ');
            }
            js.eval(main);
        } catch (ScriptException ex) {
            getLogger().log(Level.SEVERE, null, ex);
        } catch (IOException ex) {
            getLogger().log(Level.SEVERE, null, ex);
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
                engine.eval("$DIR = " + file.substring(0, file.lastIndexOf("/")));
                engine.eval("$FILE = " + file);
                return js.eval(result);
            } catch (Exception ex) {
                getLogger().log(Level.SEVERE, ex.toString());
                return null;
            }
        }

        public void loadCoreFile(String name) throws ScriptException, IOException {
            String contents = "";
            File coreFile = new File("./plugins/Thiq/core/" + name + ".js");
            // this allows us to use local core files instead of embedded ones for debugging purposes.
            if (coreFile.exists() && coreFile.isFile()) {
                contents = getScript("core/" + name + ".js");
                engine.eval("$DIR = " + "./plugins/Thiq/core/");
                engine.eval("$FILE = " + "./plugins/Thiq/core/" + name + ".js");
            } else {
                contents = IOUtils.toString(getResource("core/" + name + ".js"));
            }
            engine.eval(contents);
        }

        public void loadCoreData() throws ScriptException, IOException {
            String contents = IOUtils.toString(getResource("core/data.json"));
            engine.eval("global.__blockdata = " + contents);
        }
    }
}