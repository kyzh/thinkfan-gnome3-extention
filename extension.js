// Drive menu extension
const Gio = imports.gi.Gio;
const Lang = imports.lang;
const St = imports.gi.St;
const Shell = imports.gi.Shell;

const Gettext = imports.gettext.domain('gnome-shell-extensions');
const _ = Gettext.gettext;

const Main = imports.ui.main;
const Panel = imports.ui.panel;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Util = imports.misc.util;


// Create a function as a class 
// When ivoked, an Menu will be instancied
function Menu() {
  this._init()
}
// Instanciation of an Menu
Menu.prototype = {
	// Menu inherite from a System Status Button 
    __proto__: PanelMenu.SystemStatusButton.prototype,

    _init: function() {
		
	// Define the button's icon 
	// (from /usr/share/icons/gnome/scalable/<>_scalable)
	PanelMenu.SystemStatusButton.prototype._init.call(this, 'computer');
	
	// Create a switch to enable full-speed
	this._killswitch = new PopupMenu.PopupSwitchMenuItem(_('Enable full-speed'), false);
	
	// Action taken upon switch
	this._killswitch.connect('toggled', Lang.bind(this, function() {
	  // We ensure thinkfan is not running
	  // #FIXME killall is probably not very clean
	  Util.trySpawnCommandLine('killall thinkfan')
		
	  // States are true or false
	  // set Toggle State to !current is done automagically
	  if (this._killswitch.state == true ){
          // We launch thinkfan with agressive 
		  Util.trySpawnCommandLine('thinkfan -c /etc/thinkfan.conf.fullspeed')
	  } else
          // We launch thinkfan with agressive 
		  Util.trySpawnCommandLine('thinkfan -c /etc/thinkfan.conf')
        }));
        
    // Add the killswitch to the menu
    this.menu.addMenuItem(this._killswitch);
    // Add a separator to the menu
	//this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
    },

}
// Put your extension initialization code here
function main(metadata) {
    imports.gettext.bindtextdomain('gnome-shell-extensions', metadata.localedir);

    Panel.STANDARD_TRAY_ICON_ORDER.unshift('fan');
    Panel.STANDARD_TRAY_ICON_SHELL_IMPLEMENTATION['fan'] = Menu;
}
