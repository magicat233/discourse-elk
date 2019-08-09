import { h } from 'virtual-dom';
import { on } from 'ember-addons/ember-computed-decorators';
import DiscourseURL from 'discourse/lib/url';
import { withPluginApi } from 'discourse/lib/plugin-api';
import discourseAutocomplete from './discourse-autocomplete';

function elk(api){
  const container = api.container;
  const siteSettings = container.lookup("site-settings:main");
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
              }),
              h('img.Typeahead-spinner',{
                src: "https://hugelolcdn.com/comments/1225799.gif"
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
}

export default {
  name : "discourse-elk",
  initialize(container) {
    withPluginApi('0.8.8', api => elk(api, container));

  }
}