/**
 *
 * * [getConfig](#getconfig)
 * * [getHtml](#gethtml)
 * * [getCss](#getcss)
 * * [getJs](#getjs)
 * * [getComponents](#getcomponents)
 * * [setComponents](#setcomponents)
 * * [addComponents](#addcomponents)
 * * [getStyle](#getstyle)
 * * [setStyle](#setstyle)
 * * [getSelected](#getselected)
 * * [setDevice](#setdevice)
 * * [getDevice](#getdevice)
 * * [runCommand](#runcommand)
 * * [stopCommand](#stopcommand)
 * * [store](#store)
 * * [load](#load)
 * * [getContainer](#getcontainer)
 * * [refresh](#refresh)
 * * [on](#on)
 * * [trigger](#trigger)
 * * [render](#render)
 *
 * Editor class contains the top level API which you'll probably use to custom the editor or extend it with plugins.
 * You get the Editor instance on init method
 *
 * ```js
 * var editor = grapesjs.init({...});
 * ```
 *
 * **Available events**
 * component:add - Triggered when a new component is added to the editor, the model is passed as an argument to the callback
 * component:update - Triggered when a component is, generally, updated (moved, styled, etc.)
 * component:update:{propertyName} - Listen any property change
 * component:styleUpdate - Triggered when the style of the component is updated
 * component:styleUpdate:{propertyName} - Listen for a specific style property change
 * canvasScroll - Triggered when the canvas is scrolled
 * run:{commandName} - Triggered when some command is called to run (eg. editor.runCommand('preview'))
 * stop:{commandName} - Triggered when some command is called to stop (eg. editor.stopCommand('preview'))
 * load - When the editor is loaded
 *
 * @module Editor
 * @param {Object} config Configurations
 * @param {string} config.container='' Selector for the editor container, eg. '#myEditor'
 * @param {string|Array<Object>} [config.components=''] HTML string or object of components
 * @param {string|Array<Object>} [config.style=''] CSS string or object of rules
 * @param {Boolean} [config.fromElement=false] If true, will fetch HTML and CSS from selected container
 * @param {Boolean} [config.copyPaste=true] Enable/Disable the possibility to copy(ctrl + c) & paste(ctrl + v) components
 * @param {Boolean} [config.undoManager=true] Enable/Disable undo manager
 * @param {Boolean} [config.autorender=true] If true renders editor on init
 * @param {Boolean} [config.noticeOnUnload=true] Enable/Disable alert message before unload the page
 * @param {string} [config.height='900px'] Height for the editor container
 * @param {string} [config.width='100%'] Width for the editor container
 * @param {Object} [config.storage={}] Storage manager configuration, see the relative documentation
 * @param {Object} [config.styleManager={}] Style manager configuration, see the relative documentation
 * @param {Object} [config.commands={}] Commands configuration, see the relative documentation
 * @param {Object} [config.domComponents={}] Components configuration, see the relative documentation
 * @param {Object} [config.panels={}] Panels configuration, see the relative documentation
 * @param {Object} [config.showDevices=true] If true render a select of available devices inside style manager panel
 * @param {string} [config.defaultCommand='select-comp'] Command to execute when no other command is running
 * @param {Array} [config.plugins=[]] Array of plugins to execute on start
 * @param {Object} [config.pluginsOpts={}] Custom options for plugins
 * @example
 * var editor = grapesjs.init({
 *   container : '#gjs',
 *   components: '<div class="txt-red">Hello world!</div>',
 *   style: '.txt-red{color: red}',
 * });
 */
define(function (require){

    var Editor = function(config) {
      var c = config || {},
      defaults = require('./config/config'),
      EditorModel = require('./model/Editor'),
      EditorView = require('./view/EditorView');

      for (var name in defaults) {
        if (!(name in c))
          c[name] = defaults[name];
      }
      c.pStylePrefix = c.stylePrefix;

      var em = new EditorModel(c);

      var editorView = new EditorView({
          model: em,
          config: c,
      });

      return {

        /**
         * @property {EditorModel}
         * @private
         */
        editor: em,

        /**
         * @property {DomComponents}
         */
        DomComponents: em.get('DomComponents'),

        /**
         * @property {CssComposer}
         */
        CssComposer: em.get('CssComposer'),

        /**
         * @property {StorageManager}
         */
        StorageManager: em.get('StorageManager'),

        /**
         * @property {AssetManager}
         */
        AssetManager: em.get('AssetManager'),

        /**
         * @property {BlockManager}
         */
        BlockManager: em.get('BlockManager'),

        /**
         * @property {TraitManager}
         */
        TraitManager: em.get('TraitManager'),

        /**
         * @property {SelectorManager}
         */
        SelectorManager: em.get('SelectorManager'),

        /**
         * @property {CodeManager}
         */
        CodeManager: em.get('CodeManager'),

        /**
         * @property {Commands}
         */
        Commands: em.get('Commands'),

        /**
         * @property {Modal}
         */
        Modal: em.get('Modal'),

        /**
         * @property {Panels}
         */
        Panels: em.get('Panels'),

        /**
         * @property {StyleManager}
         */
        StyleManager: em.get('StyleManager'),

        /**
         * @property {Canvas}
         */
        Canvas: em.get('Canvas'),

        /**
         * @property {UndoManager}
         */
        UndoManager: em.get('UndoManager'),

        /**
         * @property {DeviceManager}
         */
        DeviceManager: em.get('DeviceManager'),

        /**
         * @property {RichTextEditor}
         */
        RichTextEditor: em.get('rte'),

        /**
         * @property {Utils}
         */
        Utils: em.get('Utils'),

        /**
         * @property {Utils}
         */
        Config: em.get('Config'),

        /**
         * Initialize editor model
         * @return {this}
         * @private
         */
        init: function(){
          em.init(this);
          return this;
        },

        /**
         * Returns configuration object
         * @return {Object}
         */
        getConfig: function(){
          return c;
        },

        /**
         * Returns HTML built inside canvas
         * @return {string} HTML string
         */
        getHtml: function(){
          return em.getHtml();
        },

        /**
         * Returns CSS built inside canvas
         * @return {string} CSS string
         */
        getCss: function(){
          return em.getCss();
        },

        /**
         * Returns JS of all components
         * @return {string} JS string
         */
        getJs: function(){
          return em.getJs();
        },

        /**
         * Returns components in JSON format object
         * @return {Object}
         */
        getComponents: function(){
          return em.get('DomComponents').getComponents();
        },

        /**
         * Set components inside editor's canvas. This method overrides actual components
         * @param {Array<Object>|Object|string} components HTML string or components model
         * @return {this}
         * @example
         * editor.setComponents('<div class="cls">New component</div>');
         * // or
         * editor.setComponents({
         *  type: 'text',
         *   classes:['cls'],
         *   content: 'New component'
         * });
         */
        setComponents: function(components){
          em.setComponents(components);
          return this;
        },

        /**
         * Add components
         * @param {Array<Object>|Object|string} components HTML string or components model
         * @return {Model|Array<Model>}
         * @example
         * editor.addComponents('<div class="cls">New component</div>');
         * // or
         * editor.addComponents({
         *  type: 'text',
         *   classes:['cls'],
         *   content: 'New component'
         * });
         */
        addComponents: function(components) {
          return this.getComponents().add(components);
        },

        /**
         * Returns style in JSON format object
         * @return {Object}
         */
        getStyle: function(){
          return em.get('CssComposer').getAll();
        },

        /**
         * Set style inside editor's canvas. This method overrides actual style
         * @param {Array<Object>|Object|string} style CSS string or style model
         * @return {this}
         * @example
         * editor.setStyle('.cls{color: red}');
         * //or
         * editor.setStyle({
         *   selectors: ['cls']
         *   style: { color: 'red' }
         * });
         */
        setStyle: function(style){
          em.setStyle(style);
          return this;
        },

        /**
         * Returns selected component, if there is one
         * @return {grapesjs.Component}
         */
        getSelected: function(){
          return em.getSelected();
        },

        /**
         * Set device to the editor. If the device exists it will
         * change the canvas to the proper width
         * @return {this}
         * @example
         * editor.setDevice('Tablet');
         */
        setDevice: function(name){
          return em.set('device', name);
        },

        /**
         * Return the actual active device
         * @return {string} Device name
         * @example
         * var device = editor.getDevice();
         * console.log(device);
         * // 'Tablet'
         */
        getDevice: function(){
          return em.get('device');
        },

        /**
         * Execute command
         * @param {string} id Command ID
         * @param {Object} options Custom options
         * @return {*} The return is defined by the command
         * @example
         * editor.runCommand('myCommand', {someValue: 1});
         */
        runCommand: function(id, options) {
          var result;
          var command = em.get('Commands').get(id);

          if(command){
            result = command.run(this, this, options);
            this.trigger('run:' + id);
          }
          return result;
        },

        /**
         * Stop the command if stop method was provided
         * @param {string} id Command ID
         * @param {Object} options Custom options
         * @return {*} The return is defined by the command
         * @example
         * editor.stopCommand('myCommand', {someValue: 1});
         */
        stopCommand: function(id, options) {
          var result;
          var command = em.get('Commands').get(id);

          if(command){
            result = command.stop(this, this, options);
            this.trigger('stop:' + id);
          }
          return result;
        },

        /**
         * Store data to the current storage
         * @param {Function} clb Callback function
         * @return {Object} Stored data
         */
        store: function(clb) {
          return em.store(clb);
        },

        /**
         * Load data from the current storage
         * @return {Object} Stored data
         */
        load: function() {
          return em.load();
        },

        /**
         * Returns container element. The one which was indicated as 'container'
         * on init method
         * @return {HTMLElement}
         */
        getContainer: function(){
          return c.el;
        },

        /**
         * Update editor dimensions and refresh data useful for positioning of tools
         *
         * This method could be useful when you update, for example, some position
         * of the editor element (eg. canvas, panels, etc.) with CSS, where without
         * refresh you'll get misleading position of tools (eg. rich text editor,
         * component highlighter, etc.)
         *
         * @private
         */
        refresh: function () {
          em.refreshCanvas();
        },

        /**
         * Replace the built-in Rich Text Editor with a custom one.
         * @param {Object} obj Custom RTE Interface
         * @example
         * editor.setCustomRte({
         *   // Function for enabling custom RTE
         *   // el is the HTMLElement of the double clicked Text Component
         *   // rte is the same instance you have returned the first time you call
         *   // enable(). This is useful if need to check if the RTE is already enabled so
         *   // ion this case you'll need to return the RTE and the end of the function
         *   enable: function(el, rte) {
         *     rte = new MyCustomRte(el, {}); // this depends on the Custom RTE API
         *     ...
         *     return rte; // return the RTE instance
         *   },
         *
         *   // Disable the editor, called for example when you unfocus the Text Component
         *  disable: function(el, rte) {
         *     rte.blur(); // this depends on the Custom RTE API
         *  }
         *
         * // Called when the Text Component is focused again. If you returned the RTE instance
         * // from the enable function, the enable won't be called again instead will call focus,
         * // in this case to avoid double binding of the editor
         *  focus: function (el, rte) {
         *   rte.focus(); // this depends on the Custom RTE API
         *  }
         * });
         */
        setCustomRte: function (obj) {
          this.RichTextEditor.customRte = obj;
        },

        /**
         * Attach event
         * @param  {string} event Event name
         * @param  {Function} callback Callback function
         * @return {this}
         */
        on: function(event, callback){
          return em.on(event, callback);
        },

        /**
         * Trigger event
         * @param  {string} event Event to trigger
         * @return {this}
         */
        trigger: function(event){
          return em.trigger(event);
        },

        /**
         * Returns editor element
         * @return {HTMLElement}
         * @private
         */
        getEl: function(){
          return editorView.el;
        },

        /**
         * Returns editor model
         * @return {Model}
         * @private
         */
        getModel: function(){
          return em;
        },

        /**
         * Render editor
         * @return {HTMLElement}
         */
        render: function() {
          return  editorView.render().el;
        },

      };

    };

    return Editor;
});
