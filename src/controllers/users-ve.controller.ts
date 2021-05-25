import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Users,
  Ve,
} from '../models';
import {UsersRepository} from '../repositories';

export class UsersVeController {
  constructor(
    @repository(UsersRepository) protected usersRepository: UsersRepository,
  ) { }

  @get('/users/{id}/ves', {
    responses: {
      '200': {
        description: 'Array of Users has many Ve',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Ve)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Ve>,
  ): Promise<Ve[]> {
    return this.usersRepository.veNguoiDung(id).find(filter);
  }

  @post('/users/{id}/ves', {
    responses: {
      '200': {
        description: 'Users model instance',
        content: {'application/json': {schema: getModelSchemaRef(Ve)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Users.prototype.taiKhoan,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ve, {
            title: 'NewVeInUsers',
            exclude: ['maVe'],
            optional: ['taiKhoan']
          }),
        },
      },
    }) ve: Omit<Ve, 'maVe'>,
  ): Promise<Ve> {
    return this.usersRepository.veNguoiDung(id).create(ve);
  }

  @patch('/users/{id}/ves', {
    responses: {
      '200': {
        description: 'Users.Ve PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ve, {partial: true}),
        },
      },
    })
    ve: Partial<Ve>,
    @param.query.object('where', getWhereSchemaFor(Ve)) where?: Where<Ve>,
  ): Promise<Count> {
    return this.usersRepository.veNguoiDung(id).patch(ve, where);
  }

  @del('/users/{id}/ves', {
    responses: {
      '200': {
        description: 'Users.Ve DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Ve)) where?: Where<Ve>,
  ): Promise<Count> {
    return this.usersRepository.veNguoiDung(id).delete(where);
  }
}
