import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {authorize} from '@loopback/authorization';
import {assignProjectInstanceId} from '../components/casbin-authorization';
import {Rap} from '../models';
import {RapRepository} from '../repositories';
const RESOURCE_NAME = 'project';
const ACL_PROJECT = {
  'view-all': {
    resource: `${RESOURCE_NAME}*`,
    scopes: ['view-all'],
    allowedRoles: ['admin'],
  },
  'show-balance': {
    resource: RESOURCE_NAME,
    scopes: ['show-balance'],
    allowedRoles: ['owner', 'team'],
    voters: [assignProjectInstanceId],
  },
  donate: {
    resource: RESOURCE_NAME,
    scopes: ['donate'],
    allowedRoles: ['admin', 'owner', 'team'],
    voters: [assignProjectInstanceId],
  },
  withdraw: {
    resource: RESOURCE_NAME,
    scopes: ['withdraw'],
    allowedRoles: ['owner'],
    voters: [assignProjectInstanceId],
  },
};
export class RapController {
  constructor(
    @repository(RapRepository)
    public rapRepository: RapRepository,
  ) {}

  @post('/raps')
  @response(200, {
    description: 'Rap model instance',
    content: {'application/json': {schema: getModelSchemaRef(Rap)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Rap, {
            title: 'NewRap',
          }),
        },
      },
    })
    rap: Rap,
  ): Promise<Rap> {
    return this.rapRepository.create(rap);
  }

  @get('/raps/count')
  @response(200, {
    description: 'Rap model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Rap) where?: Where<Rap>): Promise<Count> {
    return this.rapRepository.count(where);
  }
  @get('/raps')
  @response(200, {
    description: 'Array of Rap model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Rap, {includeRelations: true}),
        },
      },
    },
  })
  @authorize(ACL_PROJECT['view-all'])
  async find(@param.filter(Rap) filter?: Filter<Rap>): Promise<Rap[]> {
    return this.rapRepository.find(filter);
  }

  @patch('/raps')
  @response(200, {
    description: 'Rap PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Rap, {partial: true}),
        },
      },
    })
    rap: Rap,
    @param.where(Rap) where?: Where<Rap>,
  ): Promise<Count> {
    return this.rapRepository.updateAll(rap, where);
  }

  @get('/raps/{id}')
  @response(200, {
    description: 'Rap model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Rap, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Rap, {exclude: 'where'}) filter?: FilterExcludingWhere<Rap>,
  ): Promise<Rap> {
    return this.rapRepository.findById(id, filter);
  }

  @patch('/raps/{id}')
  @response(204, {
    description: 'Rap PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Rap, {partial: true}),
        },
      },
    })
    rap: Rap,
  ): Promise<void> {
    await this.rapRepository.updateById(id, rap);
  }

  @put('/raps/{id}')
  @response(204, {
    description: 'Rap PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() rap: Rap,
  ): Promise<void> {
    await this.rapRepository.replaceById(id, rap);
  }

  @del('/raps/{id}')
  @response(204, {
    description: 'Rap DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.rapRepository.deleteById(id);
  }
}
