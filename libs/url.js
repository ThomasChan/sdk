import _ from 'lodash';

export default (route, locals) => {
  _.templateSettings.interpolate = /{{([\s\S]+?)}}/g; // cipher
  return _.template(route)(locals)
}
