import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Ve,
  Users,
} from '../models';
import {VeRepository} from '../repositories';

export class VeUsersController {
  constructor(
    @repository(VeRepository)
    public veRepository: VeRepository,
  ) { }

  @get('/ves/{id}/users', {
    responses: {
      '200': {
        description: 'Users belonging to Ve',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Users)},
          },
        },
      },
    },
  })
  async getUsers(
    @param.path.number('id') id: typeof Ve.prototype.maVe,
  ): Promise<Users> {
    return this.veRepository.veUser(id);
  }
}
