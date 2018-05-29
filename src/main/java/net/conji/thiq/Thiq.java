/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package net.conji.thiq;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.logging.Level;
import javax.script.*;

import jdk.nashorn.api.scripting.NashornScriptEngine;
import jdk.nashorn.api.scripting.NashornScriptEngineFactory;
import org.apache.commons.io.IOUtils;
import org.bukkit.Server;
import org.bukkit.command.Command;
import org.bukkit.command.CommandSender;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.server.PluginEnableEvent;
import org.bukkit.plugin.java.JavaPlugin;

/**
 *
 * @author Conji
 */
public class Thiq extends JavaPlugin implements Listener {
    boolean isRunningES6 = false;

    public ScriptEngine js;
    public void onEnable() {
        reload();
    }
    public boolean isES6() {
        return this.isRunningES6;
    }

    @EventHandler
    public void onPluginEnabled(PluginEnableEvent event) {
        Thread current = Thread.currentThread();
        ClassLoader pClassLoader = event.getPlugin().getClass().getClassLoader();
        current.setContextClassLoader(pClassLoader);
    }
    
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        reload();
        sender.sendMessage("JavaScript has been reloaded");
        return true;
    }

    public void log(Level level, String content) {
        getLogger().log(level, content);
    }

    void initializeJsEngine() {
        try {
            try {
                js = new NashornScriptEngineFactory().getScriptEngine("--language=es6");
                this.isRunningES6 = true;
                log(Level.INFO, "Detected Java version higher than 8. Using ES6 engine.");
            } catch (Exception ex) {
                // this will throw if we're on Java 1.8, so lets fallback to the default JS engine
                this.js = new ScriptEngineManager().getEngineByName("JavaScript");
                this.isRunningES6 = false;
                log(Level.INFO, "Java version lower than 9 detected. ECMAScript 2015 features will be disabled.");
            }
            this.js.put("loader", new ScriptLoader(js));
            this.js.put("engine", this.js);
            this.js.put("isES6", this.isES6());
            try {
                this.js.eval("function eval(input) { return engine.eval(input); }");
            } catch (ScriptException ex) {
                // fail quietly
            }
            this.js.eval("function load(file){return loader.load(file);}function getServer(){return loader.getServer();}");
            this.js.put("ThiqListener", ThiqListener.class);
            this.js.eval("load('lib/internal/bootstrap/loader.js')");
        } catch (ScriptException ex) {
            this.getLogger().log(Level.SEVERE, "An error occurred when initializing the JavaScript engine.", ex);
        }
    }
    
    void reload() {
        this.initializeJsEngine();
    }
    
    public JsCommandExecutor createCommand(String name, String description, String usage, List<String> aliases, JsCommand command) {
        return new JsCommandExecutor(name, description, usage, aliases, command);
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
        public Server getServer() { return Thiq.this.getServer(); }
        public Object load(String file) throws ScriptException {
            file = file.replace('\\', '/');
            try {
                String pFile = "./plugins/Thiq/" + file;
                InputStreamReader stream = new InputStreamReader(new FileInputStream(pFile), StandardCharsets.UTF_8);
                BufferedReader buffer = new BufferedReader(stream);
                String line;
                String result = "";
                while ((line = buffer.readLine()) != null) {
                    result += line + "\r\n";
                }
                Object output = js.eval(result);
                return output;
            } catch (FileNotFoundException ex) {
                try {
                    file = removePrefixSlashes(file);
                    InputStream resx = getResource(file);
                    if (resx == null) throw new IOException("Resource doesn't exist: " + file);
                    String result = IOUtils.toString(resx);
                    return js.eval(result);
                } catch (IOException io) {
                    return null;
                }
            } catch (Exception ex) {
                return null;
            }
        }

        String removePrefixSlashes(String input) {
            int startIndex = 0;
            for (int i = 0; i < input.length(); i++) {
                if (input.charAt(i) == '/') startIndex++;
                else return input.substring(startIndex);
            }
            return "";
        }
    }
}