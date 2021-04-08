import {TokenService, UserService} from '@loopback/authentication';
import {BindingKey} from '@loopback/core';
// The User model is imported from the application,
// which makes the component not entirely independent
import {Users} from '../../models/users.model';
import {Credentials} from './services/users.service';

export namespace TokenServiceConstants {
  export const TOKEN_SECRET_VALUE = 'myjwts3cr3t';
  export const TOKEN_EXPIRES_IN_VALUE = '21600';
}

export namespace TokenServiceBindings {
  export const TOKEN_SECRET = BindingKey.create<string>(
    'authentication.jwt.secret',
  );
  export const TOKEN_EXPIRES_IN = BindingKey.create<string>(
    'authentication.jwt.expires.in.seconds',
  );
  export const TOKEN_SERVICE = BindingKey.create<TokenService>(
    'services.authentication.jwt.tokenservice',
  );
}

export namespace UserServiceBindings {
  export const USER_SERVICE = BindingKey.create<
    UserService<Users, Credentials>
  >('services.user.service');
}
