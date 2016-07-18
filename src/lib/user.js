import usersModel from '../app/users/users.model';
import utils from './utils';

export default (req, res, next) => {
  res.profileAllowed = profileAllowed;

  next();

  function profileAllowed(callback) {
    const connectedUser = res.session('user');

    if (utils.Type.isDefined(connectedUser) && utils.Type.isDefined(res.session('oauth'))) {
      usersModel.getPrivilege({
        network: connectedUser.network,
        networkId: connectedUser.networkId,
        username: connectedUser.username,
        password: false
      }, (userInfo) => {
        if (userInfo) {
          callback(userInfo[0].privilege !== 'user' ? connectedUser : false);
        } else {
          res.redirect('/');
        }
      });
    } else {
      callback(false);
    }
  }
};
