import { h } from 'virtual-dom';
import { on } from 'ember-addons/ember-computed-decorators';
import DiscourseURL from 'discourse/lib/url';
import { withPluginApi } from 'discourse/lib/plugin-api';
import discourseAutocomplete from './discourse-autocomplete';

export default {
  name : "discourse-ubnt-elk",
  initialize(container) {
  console.log("es-enabled");
  console.log(container.siteSettings.es_enabled);
    withPluginApi('0.8.8', (api) => {
    console.log("es-enabled");

      api.modifyClass('component:site-header', {
        @on("didInsertElement")
        initializeElk() {
          this._super();
          if (this.siteSettings.es_enabled) {
            $("body").addClass("es-enabled");
            setTimeout(() => {
              discourseAutocomplete._initialize({});
            }, 100);
          }
        }
      });

      api.createWidget('es', {
        tagName: 'li.es-holder',
        html() {
          return [
            h('form', {
              action: '/search',
              method: 'GET'
            }, [
              h('input.es-input#search-box', {
                name: "q",
                placeholder: "Search the forum...",
                autocomplete: "off"
              })
            ])
          ];
        }
      });

      api.decorateWidget('header-icons:before', function(helper) {
        if (helper.widget.siteSettings.es_enabled) {
          return helper.attach('es');
        }
      });

    });
  }
}
