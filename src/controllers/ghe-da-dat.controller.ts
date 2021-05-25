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
import {GheDaDat} from '../models';
import {GheDaDatRepository} from '../repositories';

export class GheDaDatController {
  constructor(
    @repository(GheDaDatRepository)
    public gheDaDatRepository : GheDaDatRepository,
  ) {}

  @post('/ghe-da-dat')
  @response(200, {
    description: 'GheDaDat model instance',
    content: {'application/json': {schema: getModelSchemaRef(GheDaDat)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(GheDaDat, {
            title: 'NewGheDaDat',
            
          }),
        },
      },
    })
    gheDaDat: GheDaDat,
  ): Promise<GheDaDat> {
    return this.gheDaDatRepository.create(gheDaDat);
  }

  @get('/ghe-da-dat/count')
  @response(200, {
    description: 'GheDaDat model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(GheDaDat) where?: Where<GheDaDat>,
  ): Promise<Count> {
    return this.gheDaDatRepository.count(where);
  }

  @get('/ghe-da-dat')
  @response(200, {
    description: 'Array of GheDaDat model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(GheDaDat, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(GheDaDat) filter?: Filter<GheDaDat>,
  ): Promise<GheDaDat[]> {
    return this.gheDaDatRepository.find(filter);
  }

  @patch('/ghe-da-dat')
  @response(200, {
    description: 'GheDaDat PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(GheDaDat, {partial: true}),
        },
      },
    })
    gheDaDat: GheDaDat,
    @param.where(GheDaDat) where?: Where<GheDaDat>,
  ): Promise<Count> {
    return this.gheDaDatRepository.updateAll(gheDaDat, where);
  }

  @get('/ghe-da-dat/{id}')
  @response(200, {
    description: 'GheDaDat model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(GheDaDat, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(GheDaDat, {exclude: 'where'}) filter?: FilterExcludingWhere<GheDaDat>
  ): Promise<GheDaDat> {
    return this.gheDaDatRepository.findById(id, filter);
  }

  @patch('/ghe-da-dat/{id}')
  @response(204, {
    description: 'GheDaDat PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(GheDaDat, {partial: true}),
        },
      },
    })
    gheDaDat: GheDaDat,
  ): Promise<void> {
    await this.gheDaDatRepository.updateById(id, gheDaDat);
  }

  @put('/ghe-da-dat/{id}')
  @response(204, {
    description: 'GheDaDat PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() gheDaDat: GheDaDat,
  ): Promise<void> {
    await this.gheDaDatRepository.replaceById(id, gheDaDat);
  }

  @del('/ghe-da-dat/{id}')
  @response(204, {
    description: 'GheDaDat DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.gheDaDatRepository.deleteById(id);
  }
}
