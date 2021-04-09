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
import {CumRap} from '../models';
import {CumRapRepository} from '../repositories';

export class CumRapController {
  constructor(
    @repository(CumRapRepository)
    public cumRapRepository : CumRapRepository,
  ) {}

  @post('/cum-raps')
  @response(200, {
    description: 'CumRap model instance',
    content: {'application/json': {schema: getModelSchemaRef(CumRap)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CumRap, {
            title: 'NewCumRap',

          }),
        },
      },
    })
    cumRap: CumRap,
  ): Promise<CumRap> {
    return this.cumRapRepository.create(cumRap);
  }

  @get('/cum-raps/count')
  @response(200, {
    description: 'CumRap model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(CumRap) where?: Where<CumRap>,
  ): Promise<Count> {
    return this.cumRapRepository.count(where);
  }

  @get('/cum-raps')
  @response(200, {
    description: 'Array of CumRap model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(CumRap, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(CumRap) filter?: Filter<CumRap>,
  ): Promise<CumRap[]> {
    return this.cumRapRepository.find(filter);
  }

  @patch('/cum-raps')
  @response(200, {
    description: 'CumRap PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CumRap, {partial: true}),
        },
      },
    })
    cumRap: CumRap,
    @param.where(CumRap) where?: Where<CumRap>,
  ): Promise<Count> {
    return this.cumRapRepository.updateAll(cumRap, where);
  }

  @get('/cum-raps/{id}')
  @response(200, {
    description: 'CumRap model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(CumRap, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(CumRap, {exclude: 'where'}) filter?: FilterExcludingWhere<CumRap>
  ): Promise<CumRap> {
    return this.cumRapRepository.findById(id, filter);
  }

  @patch('/cum-raps/{id}')
  @response(204, {
    description: 'CumRap PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CumRap, {partial: true}),
        },
      },
    })
    cumRap: CumRap,
  ): Promise<void> {
    await this.cumRapRepository.updateById(id, cumRap);
  }

  @put('/cum-raps/{id}')
  @response(204, {
    description: 'CumRap PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() cumRap: CumRap,
  ): Promise<void> {
    await this.cumRapRepository.replaceById(id, cumRap);
  }

  @del('/cum-raps/{id}')
  @response(204, {
    description: 'CumRap DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.cumRapRepository.deleteById(id);
  }
}
