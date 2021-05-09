import {
  authenticate,
  TokenService,
  UserService,
} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {model, property, repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  HttpErrors,
  post,
  requestBody,
  RequestBodyObject,
  SchemaObject,
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {genSalt, hash, compare} from 'bcryptjs';
import {
  Credentials,
  TokenServiceBindings,
  UserServiceBindings,
} from '../components/jwt-authentication';
import {Users} from '../models';
import {UsersRepository} from '../repositories';
import {doiPasswordRequest} from './dto/user.dto';

@model()
export class NewUserRequest extends Users {
  @property({
    type: 'string',
    required: true,
  })
  password: string;
}

const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
  },
};

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};

export class UserController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<Users, Credentials>,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    @repository(UsersRepository) protected userRepository: UsersRepository,
  ) {}
  // Dang le xe su ly trong service
  // Nhung service cua loopback bind singleton - User
  // Oracle ko cho table User
  @post('/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{token: string}> {
    // ensure the user exists, and the password is correct
    const user = await this.userService.verifyCredentials(credentials);
    // convert a Users object into a UserProfile object (reduced set of properties)
    const userProfile = this.userService.convertToUserProfile(user);

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);
    return {token};
  }
  @authenticate('jwt')
  @get('/whoAmI', {
    responses: {
      '200': {
        description: 'Return current user',
        content: {
          'application/json': {
            schema: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  async whoAmI(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<string> {
    console.log(currentUserProfile);
    return currentUserProfile[securityId];
  }
  @authenticate('jwt')
  @post('/change-password', {
    responses: {
      '200': {
        description: 'Message',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async doiMatKhau(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @requestBody(doiPasswordRequest)
    request: RequestBodyObject,
  ): Promise<{message: string}> {
    const invalidCredentialsError = 'Invalid email or password.';
    console.log(request);
    try {
      const user = await this.userRepository.find({
        where: {
          email: currentUserProfile.email,
        },
      });
      const passwordMatched = await compare(
        request.oldPassword,
        user[0].password,
      );
      console.log(passwordMatched);

      if (!passwordMatched) {
        throw new HttpErrors.Unauthorized(invalidCredentialsError);
      }
      const newPassword = await hash(request.newPassword, await genSalt(10));

      await this.userRepository
        .userCredentials(user[0].taiKhoan)
        .patch({password: newPassword});
      return {
        message: 'Password changed',
      };
    } catch (e) {
      console.log(e);
      return {
        message: 'Failed to change password',
      };
    }
    // const validate = await hash(request.password, await genSalt(10));
    // const savedUser = await this.userRepository.create(newUserRequest);
    // await this.userRepository
    //   .userCredentials(savedUser.taiKhoan)
    //   .create({password});

    // return savedUser;
  }
  @post('/signup', {
    responses: {
      '200': {
        description: 'Users',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': Users,
            },
          },
        },
      },
    },
  })
  async signUp(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewUserRequest, {
            title: 'NewUser',
          }),
        },
      },
    })
    newUserRequest: NewUserRequest,
  ): Promise<Users> {
    const password = await hash(newUserRequest.password, await genSalt(10));
    const savedUser = await this.userRepository.create(newUserRequest);
    await this.userRepository
      .userCredentials(savedUser.taiKhoan)
      .create({password});

    return savedUser;
  }
}
