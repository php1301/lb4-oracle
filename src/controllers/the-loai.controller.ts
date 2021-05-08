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
import {TheLoai} from '../models';
import {TheLoaiRepository} from '../repositories';

export class TheLoaiController {
  constructor(
    @repository(TheLoaiRepository)
    public theLoaiRepository : TheLoaiRepository,
  ) {}

  @post('/the-loai')
  @response(200, {
    description: 'TheLoai model instance',
    content: {'application/json': {schema: getModelSchemaRef(TheLoai)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TheLoai, {
            title: 'NewTheLoai',
            
          }),
        },
      },
    })
    theLoai: TheLoai,
  ): Promise<TheLoai> {
    return this.theLoaiRepository.create(theLoai);
  }

  @get('/the-loai/count')
  @response(200, {
    description: 'TheLoai model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(TheLoai) where?: Where<TheLoai>,
  ): Promise<Count> {
    return this.theLoaiRepository.count(where);
  }

  @get('/the-loai')
  @response(200, {
    description: 'Array of TheLoai model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(TheLoai, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(TheLoai) filter?: Filter<TheLoai>,
  ): Promise<TheLoai[]> {
    return this.theLoaiRepository.find(filter);
  }

  @patch('/the-loai')
  @response(200, {
    description: 'TheLoai PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TheLoai, {partial: true}),
        },
      },
    })
    theLoai: TheLoai,
    @param.where(TheLoai) where?: Where<TheLoai>,
  ): Promise<Count> {
    return this.theLoaiRepository.updateAll(theLoai, where);
  }

  @get('/the-loai/{id}')
  @response(200, {
    description: 'TheLoai model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(TheLoai, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(TheLoai, {exclude: 'where'}) filter?: FilterExcludingWhere<TheLoai>
  ): Promise<TheLoai> {
    return this.theLoaiRepository.findById(id, filter);
  }

  @patch('/the-loai/{id}')
  @response(204, {
    description: 'TheLoai PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TheLoai, {partial: true}),
        },
      },
    })
    theLoai: TheLoai,
  ): Promise<void> {
    await this.theLoaiRepository.updateById(id, theLoai);
  }

  @put('/the-loai/{id}')
  @response(204, {
    description: 'TheLoai PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() theLoai: TheLoai,
  ): Promise<void> {
    await this.theLoaiRepository.replaceById(id, theLoai);
  }

  @del('/the-loai/{id}')
  @response(204, {
    description: 'TheLoai DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.theLoaiRepository.deleteById(id);
  }
}
