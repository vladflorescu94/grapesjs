define(['backbone'],
  function (Backbone) {
    /**
     * @class RemoteStorage
     * */
    return Backbone.Model.extend({

      defaults: {
        urlStore: '',
        urlLoad: '',
        params: {},
        beforeSend: function(){},
        onComplete: function(){},
        contentTypeJson: false
      },

      /**
       * @private
       */
      store: function(data, clb) {
        var fd = {},
        params = this.get('params');

        for(var k in data)
          fd[k] = data[k];

        for(var key in params)
          fd[key] = params[key];

        $.ajax({
          url: this.get('urlStore'),
          beforeSend: this.get('beforeSend'),
          complete: this.get('onComplete'),
          method: 'POST',
          dataType: 'json',
          contentType: this.get('contentTypeJson') ? 'application/json; charset=utf-8': 'x-www-form-urlencoded',
          data: this.get('contentTypeJson') ? JSON.stringify(fd): fd,
        }).always(function(){
          if (typeof clb == 'function') {
            clb();
          }
        });
      },

      /**
       * @private
       */
      load: function(keys){
        var result = {},
        fd = {},
        params = this.get('params');

        for(var key in params)
          fd[key] = params[key];

        fd.keys = keys;

        $.ajax({
          url: this.get('urlLoad'),
          beforeSend: this.get('beforeSend'),
          complete: this.get('onComplete'),
          data: fd,
          async: false,
          method: 'GET',
        }).done(function(d){
          result = d;
        });
        return result;
      },

    });
});
