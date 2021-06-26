/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  authenticate,
  TokenService,
  UserService,
} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  Filter,
  FilterExcludingWhere,
  model,
  property,
  repository,
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  Request,
  requestBody,
  RequestBodyObject,
  response,
  Response,
  RestBindings,
  SchemaObject,
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import axios from 'axios';
import {compare, genSalt, hash} from 'bcryptjs';
import FormData from 'form-data';
import {
  Credentials,
  TokenServiceBindings,
  UserServiceBindings,
} from '../components/jwt-authentication';
import {doiPasswordRequest} from '../dto/user.dto';
import {FILE_UPLOAD_SERVICE} from '../keys';
import {Users} from '../models';
import {UsersRepository} from '../repositories';
import {FileUploadHandler} from '../types';
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
    @inject(FILE_UPLOAD_SERVICE) private handler: FileUploadHandler,
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
  ): Promise<any> {
    // ensure the user exists, and the password is correct
    const user = await this.userService.verifyCredentials(credentials);
    // convert a Users object into a UserProfile object (reduced set of properties)
    const userProfile = this.userService.convertToUserProfile(user);

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);
    return {token, ...userProfile};
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
  ): Promise<any> {
    const password = await hash(newUserRequest.password, await genSalt(10));
    const savedUser = await this.userRepository.create({
      ...newUserRequest,
      password,
    });
    const userProfile = this.userService.convertToUserProfile(savedUser);
    const token = await this.jwtService.generateToken(userProfile);
    await this.userRepository
      .userCredentials(savedUser.taiKhoan)
      .create({password});

    return {token, ...userProfile};
  }
  // @authenticate('jwt')
  @get('/users')
  @response(200, {
    description: 'Array of User instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Users),
        },
      },
    },
  })
  async find(@param.filter(Users) filter?: Filter<Users>): Promise<Users[]> {
    return this.userRepository.find(filter);
  }

  @get('/user/{id}')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Users),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Users, {exclude: 'where'})
    filter?: FilterExcludingWhere<Users>,
  ): Promise<Users> {
    return this.userRepository.findById(id, filter);
  }

  @patch('/user/{id}')
  @response(204, {
    description: 'User PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      description: 'Update User Information by Id',
      content: {
        'application/json': {
          schema: getModelSchemaRef(Users, {
            partial: true,
            exclude: ['taiKhoan', 'password'],
          }),
        },
      },
    })
    user: Omit<Users, 'taiKhoan' | 'password'>,
  ): Promise<void> {
    await this.userRepository.updateById(id, user);
  }
  @patch('/user/{id}/avatar')
  @response(204, {
    description: 'Update Avatar User imgur',
  })
  async updateAvatar(
    @param.path.number('id') id: number,
    @requestBody.file()
    req: Request,
    @inject(RestBindings.Http.RESPONSE) res: Response,
  ): Promise<object> {
    // console.log(request);
    const file = await new Promise<object>((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.handler(req, res, (err: any) => {
        if (err) reject(err);
        else {
          const value = resolve(UserController.getFilesAndFields(req));
          return value;
        }
      });
    });
    console.log(file);
    try {
      /* REQUEST TOKEN FOR USER'S IMGUR ACCOUNT

      // const requestAccessTokenData = new FormData();
      // requestAccessTokenData.append('refresh_token', process.env.REFRESH_TOKEN);
      // requestAccessTokenData.append('client_id', process.env.IMGUR_CLIENT_ID);
      // requestAccessTokenData.append(
      //   'client_secret',
      //   process.env.IMGUR_CLIENT_SECRET,
      // );
      // requestAccessTokenData.append('grant_type', 'refresh_token');

      // const requestTokenConfig = {
      //   headers: {
      //     ...requestAccessTokenData.getHeaders(),
      //   },
      // };

      // const data = await axios.post(
      //   'https://api.imgur.com/oauth2/token',
      //   requestAccessTokenData,
      //   requestTokenConfig,
      // );
      // // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // const token = data.data.access_token;

      */
      // https://github.com/expressjs/multer/issues/898
      // console.log((<any>file).files[0]?.stream);
      // Any cast
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const buffer = (<any>file).files[0]?.buffer;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fileName = (<any>file).files[0]?.originalname;
      const imgurForm = new FormData();
      imgurForm.append('image', buffer, {filename: fileName});
      imgurForm.append('type', 'file');
      const result = await axios.post(
        'https://api.imgur.com/3/upload',
        imgurForm,
        {
          headers: {
            Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
            ...imgurForm.getHeaders(),
          },
        },
      );
      const imageLink = result.data.data.link;
      await this.userRepository.updateById(id, {
        avatar: imageLink,
      });
      return {imageUrl: imageLink};
    } catch (e) {
      console.log(e.response);
      return {message: 'Failed to upload image'};
    }
  }
  private static getFilesAndFields(request: Request) {
    const uploadedFiles = request.files;
    const mapper = (f: globalThis.Express.Multer.File) => ({
      fieldname: f.fieldname,
      originalname: f.originalname,
      encoding: f.encoding,
      mimetype: f.mimetype,
      size: f.size,
      path: f.path,
      buffer: f.buffer,
      stream: f.stream,
    });
    let files: object[] = [];
    if (Array.isArray(uploadedFiles)) {
      files = uploadedFiles.map(mapper);
    } else {
      for (const filename in uploadedFiles) {
        files.push(...uploadedFiles[filename].map(mapper));
      }
    }
    return {files, fields: request.body};
  }

  @get('/user/{id}/birthday-and-points')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Users),
      },
    },
  })
  async isBirthDayMotnhUser(
    @param.path.number('id') id: number,
  ): Promise<{isBirthday: boolean; points: number}> {
    const user = await this.userRepository.findById(id);
    const points = user.diemTichLuy;
    const birthday: Date = (user.ngaySinh as unknown) as Date;
    console.log('Sinh nhat', birthday, birthday.getMonth());
    const finalParam =
      birthday.getMonth() + 1 < 10
        ? `0${birthday.getMonth() + 1}`
        : birthday.getMonth() + 1;
    const sql = `
    select call_proc_isBirthday(:p1) as checkResult from dual
    `;
    console.log(finalParam);
    const result = (await this.userRepository.execute(sql, [
      finalParam,
    ])) as any;
    console.log(result[0]['CHECKRESULT']);
    return {isBirthday: result[0]['CHECKRESULT'] === 1, points};
  }
}
