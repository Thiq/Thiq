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
    public ScriptEngine js;
    
    public void onEnable() {
        reload(true);
    }

    @EventHandler
    public void onPluginEnabled(PluginEnableEvent event) {
        Thread current = Thread.currentThread();
        ClassLoader pClassLoader = event.getPlugin().getClass().getClassLoader();
        current.setContextClassLoader(pClassLoader);

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
                getLogger().log(Level.SEVERE, ex.getMessage() + getStackTrace(ex));
            }
            js.eval("function __global__(key, value) { engine.put(key, value); }");
            js.eval("function load(file){return loader.load(file);}function getServer(){return loader.getServer();}");
            js.put("$DIR", "./plugins/Thiq/");
            js.put("$FILE", false);
            js.put("ThiqListener", ThiqListener.class);
            js.eval("load('plugin.js')");
        } catch (ScriptException ex) {
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


     String getStackTrace(Exception ex) {
        String result = "\r\n[BEGIN STACKTRACE]\r\nReading file '" + js.get("$FILE") + "'\r\n";
        StackTraceElement[] trace = ex.getStackTrace();
        for (StackTraceElement line: trace) {
            result += line.getClassName() + "." + line.getMethodName() + " (line:" + line.getLineNumber() + ")\r\n";
        }
        result += "[END STACKTRACE]\r\n";
        return result;
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
        public Server getServer() {return Thiq.this.getServer();}
        public Object load(String file) throws FileNotFoundException, ScriptException {
            file = file.replace('\\', '/');
            try {
                String pFile = "./plugins/Thiq/" + file;
                InputStreamReader stream = new InputStreamReader(new FileInputStream(pFile), StandardCharsets.UTF_8);
                BufferedReader buffer = new BufferedReader(stream);
                String line = null;
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

                    getLogger().log(Level.SEVERE, io.getMessage() + getStackTrace(io));
                    return null;
                }
            } catch (Exception ex) {
                getLogger().log(Level.SEVERE, ex.getMessage() + getStackTrace(ex));
                return null;
            }
        }

        public Object loadCoreFile(String name) throws ScriptException, IOException {
            return load("/core/" + name + ".js");
        }

        public void loadCoreData() throws ScriptException, IOException {
            String contents = IOUtils.toString(getResource("core/data.json"));
            engine.eval("global.__blockdata = " + contents);
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