#!/usr/bin/ruby
# @Author: EffyGao
# @Date:   2019-07-18 17:17:40
# @Last Modified by:   effy
# @Last Modified time: 2019-08-06 17:14:07

enabled_site_setting :es_enabled

register_asset 'stylesheets/variables.scss'
register_asset 'stylesheets/es-base.scss'
register_asset 'stylesheets/es-layout.scss'
# register_asset 'stylesheets/test.scss'
register_asset 'lib/typehead.bundle-0.10.0.min.js'
register_asset 'lib/bootstrap3-typeahead.js'