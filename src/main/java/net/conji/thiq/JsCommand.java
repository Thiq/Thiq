/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package net.conji.thiq;

import org.bukkit.command.CommandSender;

/**
 *
 * @author Conji
 */
public interface JsCommand {
    public boolean execute(CommandSender sender, String commandLabel, String[] args);
    
    public Object getState();
}
