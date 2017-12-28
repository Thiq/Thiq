/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package net.conji.thiq;

import java.io.File;

/**
 *
 * @author Conji
 */
public class ScriptManager {
    public static Object loadScript(String file) {
        File scriptDir = new File("./scripts/");
        if (!scriptDir.exists()) {
            scriptDir.mkdir();
        }
        
        
        
        return null;
    }
}
