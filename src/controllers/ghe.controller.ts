import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Ghe} from '../models';
import {GheRepository} from '../repositories';

export class GheController {
  constructor(
    @repository(GheRepository)
    public gheRepository : GheRepository,
  ) {}

  @post('/ghe')
  @response(200, {
    description: 'Ghe model instance',
    content: {'application/json': {schema: getModelSchemaRef(Ghe)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ghe, {
            title: 'NewGhe',
            
          }),
        },
      },
    })
    ghe: Ghe,
  ): Promise<Ghe> {
    return this.gheRepository.create(ghe);
  }

  @get('/ghe/count')
  @response(200, {
    description: 'Ghe model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Ghe) where?: Where<Ghe>,
  ): Promise<Count> {
    return this.gheRepository.count(where);
  }

  @get('/ghe')
  @response(200, {
    description: 'Array of Ghe model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Ghe, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Ghe) filter?: Filter<Ghe>,
  ): Promise<Ghe[]> {
    return this.gheRepository.find(filter);
  }

  @patch('/ghe')
  @response(200, {
    description: 'Ghe PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ghe, {partial: true}),
        },
      },
    })
    ghe: Ghe,
    @param.where(Ghe) where?: Where<Ghe>,
  ): Promise<Count> {
    return this.gheRepository.updateAll(ghe, where);
  }

  @get('/ghe/{id}')
  @response(200, {
    description: 'Ghe model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Ghe, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Ghe, {exclude: 'where'}) filter?: FilterExcludingWhere<Ghe>
  ): Promise<Ghe> {
    return this.gheRepository.findById(id, filter);
  }

  @patch('/ghe/{id}')
  @response(204, {
    description: 'Ghe PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ghe, {partial: true}),
        },
      },
    })
    ghe: Ghe,
  ): Promise<void> {
    await this.gheRepository.updateById(id, ghe);
  }

  @put('/ghe/{id}')
  @response(204, {
    description: 'Ghe PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() ghe: Ghe,
  ): Promise<void> {
    await this.gheRepository.replaceById(id, ghe);
  }

  @del('/ghe/{id}')
  @response(204, {
    description: 'Ghe DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.gheRepository.deleteById(id);
  }
}
