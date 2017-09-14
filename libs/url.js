import templateSettings from 'lodash.templatesettings'
import template from 'lodash.template'

export default (route, locals) => {
  templateSettings.interpolate = /{{([\s\S]+?)}}/g; // cipher
  return template(route)(locals)
}
