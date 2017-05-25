define(['backbone'],
  function (Backbone) {
  return Backbone.View.extend({

    tagName: 'style',

    initialize: function(o) {
      this.config = o.config || {};
      this.listenTo(this.model, 'change:style', this.render);
      this.listenTo(this.model, 'change:state', this.render);
      this.listenTo(this.model, 'destroy remove', this.remove);
      this.listenTo(this.model, 'change:mediaText', this.render);
      this.listenTo(this.model.get('selectors'), 'change', this.selChanged);
    },

    /**
     * Triggered when some selector is changed
     * @private
     */
    selChanged: function(){
      this.selStr = this.renderSelectors();
      this.render();
    },

    /**
     * Returns string of selectors
     * @return {String}
     * @private
     */
    renderSelectors: function() {
      var sel = [];
      var model = this.model;
      var add = model.get('selectorsAdd');
      model.get('selectors').each(function(m){
        sel.push('.' + m.get('name'));
      });
      var sels = sel.join('');
      return sels + (sels && add ? ', ' : '') + add;
    },

    /**
     * Returns string of properties
     * @return {String}
     * @private
     */
    renderProperties: function(){
      var sel = [],
        props = this.model.get('style');
      for (var prop in props){
        sel.push(prop + ':' + props[prop] + ';');
      }
      return sel.join('');
    },

    render : function(){
      var block = '',
        selStr = '';
        o = '';
      if(!this.selStr)
        this.selStr = this.renderSelectors();
      var prpStr = this.renderProperties();
      var stateStr = this.model.get('state');
      var mediaText = this.model.get('mediaText');
      if(this.selStr){
        stateStr = stateStr ? ':' + stateStr : '';
        block = prpStr !== '' ? '{' + prpStr + '}' : '';
      }
      o = this.selStr && block ? this.selStr + stateStr + block : '';

      if(mediaText && o)
        o = '@media ' + mediaText + '{' + o + '}';

      this.$el.html(o);
      return this;
    },

  });
});
