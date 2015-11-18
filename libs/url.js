import _ from 'lodash';

export default (route, locals) => {
  return _.template(route)(locals)
}
