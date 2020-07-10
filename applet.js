const Applet = imports.ui.applet;
const Lang = imports.lang;
const St = imports.gi.St;
const Main = imports.ui.main;
const PopupMenu = imports.ui.popupMenu;
const UUID = 'spawn-cmd@aussedatlo';
const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;
const Util = imports.misc.util;
const APPLET_PATH = imports.ui.appletManager.appletMeta["spawn-cmd@aussedatlo"].path

function ConfirmDialog(){
  this._init();
}

function MyApplet(orientation, panelHeight, instanceId) {
  this._init(orientation, panelHeight, instanceId);
}

MyApplet.prototype = {
  __proto__: Applet.IconApplet.prototype,

  _init: function(orientation, panelHeight, instanceId) {
    Applet.IconApplet.prototype._init.call(this, orientation, panelHeight, instanceId);

    try {
      this.set_applet_icon_name("icons8-go-40-blue");
      this.set_applet_tooltip("Spawn shell command");

      this.menuManager = new PopupMenu.PopupMenuManager(this);
      this.menu = new Applet.AppletPopupMenu(this, orientation);
      this.menuManager.addMenu(this.menu);

      this._contentSection = new PopupMenu.PopupMenuSection();
      this.menu.addMenuItem(this._contentSection);

      // First item: Turn on
      let item = new PopupMenu.PopupIconMenuItem("sync", "icons8-go-40-blue", St.IconType.FULLCOLOR);
      item.connect('activate', Lang.bind(this, this.on_menu_clicked));
      this.menu.addMenuItem(item);

      // Second item: Turn off
      item = new PopupMenu.PopupIconMenuItem("Menu 2", "icons8-go-40-blue", St.IconType.FULLCOLOR);
      item.connect('activate', Lang.bind(this, this.on_menu_clicked));
      this.menu.addMenuItem(item);

      command = {id: 1, name:"sync", command: ["sync"], icon: "icons8-go-40-blue"}
      item = this._make_menu_item(command)
      this.menu.addMenuItem(item)

      command = {id: 2, name:"Command test (echo hello)", command: ["echo", "hello"], icon: "icons8-go-40-green"}
      item = this._make_menu_item(command)
      this.menu.addMenuItem(item)
    }
    catch (e) {
      global.logError(e);
    }
  },

  on_applet_clicked: function(event) {
    this.menu.toggle();
  },

  on_menu_clicked: function(actor, event) {
    // Main.Util.spawnCommandLine(APPLET_PATH + "/spawn_then_notify.py test 1");
    Util.spawn_async(["sync"], Lang.bind(this, this.on_result));
    global.log("on_menu_clicked: Spawning command")
    // global.log(actor)
    global.log(event)
  },

  on_result: function(out) {
    global.log("on_result")
    global.log(out)
    Util.spawn_async(["notify-send", "-i", APPLET_PATH + "/icons/tick.png", "command", out]);
  },

  _make_menu_item: function(item) {
    let ni = new PopupMenu.PopupIconMenuItem('' + item.name, item.icon, St.IconType.SYMBOLIC);
    global.log("creating menu item")
    global.log(item)
    ni.connect('activate', Lang.bind(this, function() {
        global.log("click " + item.command)
        Util.spawn_async(item.command, Lang.bind(this, function(out) {
          global.log("result command "+item.name+": "+out)
          Util.spawn_async(["notify-send", "-i", APPLET_PATH + "/icons/tick.png", item.name, out]);
        }));

    }));
    // this.menuItems[note.id] = ni;
    return ni;
  },
};

function main(metadata, orientation, panelHeight, instanceId) {
  let myApplet = new MyApplet(orientation, panelHeight, instanceId);
  return myApplet;
}

// cinnamon spicy applet git