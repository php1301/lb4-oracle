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
import {HeThongRap} from '../models';
import {HeThongRapRepository} from '../repositories';

export class HeThongRapController {
  constructor(
    @repository(HeThongRapRepository)
    public heThongRapRepository : HeThongRapRepository,
  ) {}

  @post('/he-thong-raps')
  @response(200, {
    description: 'HeThongRap model instance',
    content: {'application/json': {schema: getModelSchemaRef(HeThongRap)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(HeThongRap, {
            title: 'NewHeThongRap',

          }),
        },
      },
    })
    heThongRap: HeThongRap,
  ): Promise<HeThongRap> {
    return this.heThongRapRepository.create(heThongRap);
  }

  @get('/he-thong-raps/count')
  @response(200, {
    description: 'HeThongRap model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(HeThongRap) where?: Where<HeThongRap>,
  ): Promise<Count> {
    return this.heThongRapRepository.count(where);
  }

  @get('/he-thong-raps')
  @response(200, {
    description: 'Array of HeThongRap model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(HeThongRap, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(HeThongRap) filter?: Filter<HeThongRap>,
  ): Promise<HeThongRap[]> {
    return this.heThongRapRepository.find(filter);
  }

  @patch('/he-thong-raps')
  @response(200, {
    description: 'HeThongRap PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(HeThongRap, {partial: true}),
        },
      },
    })
    heThongRap: HeThongRap,
    @param.where(HeThongRap) where?: Where<HeThongRap>,
  ): Promise<Count> {
    return this.heThongRapRepository.updateAll(heThongRap, where);
  }

  @get('/he-thong-raps/{id}')
  @response(200, {
    description: 'HeThongRap model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(HeThongRap, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(HeThongRap, {exclude: 'where'}) filter?: FilterExcludingWhere<HeThongRap>
  ): Promise<HeThongRap> {
    return this.heThongRapRepository.findById(id, filter);
  }

  @patch('/he-thong-raps/{id}')
  @response(204, {
    description: 'HeThongRap PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(HeThongRap, {partial: true}),
        },
      },
    })
    heThongRap: HeThongRap,
  ): Promise<void> {
    await this.heThongRapRepository.updateById(id, heThongRap);
  }

  @put('/he-thong-raps/{id}')
  @response(204, {
    description: 'HeThongRap PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() heThongRap: HeThongRap,
  ): Promise<void> {
    await this.heThongRapRepository.replaceById(id, heThongRap);
  }

  @del('/he-thong-raps/{id}')
  @response(204, {
    description: 'HeThongRap DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.heThongRapRepository.deleteById(id);
  }
}
