/* eslint-disable @typescript-eslint/no-explicit-any */
import {inject} from '@loopback/context';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  IsolationLevel,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param,
  patch, post,
  put,
  requestBody,
  response,
  Response, RestBindings
} from '@loopback/rest';
import {VeResponse} from '../@types/ve-response';
import {Ghe, Ve} from '../models';
import {DatVeRepository, GheDaDatRepository, VeRepository} from '../repositories';
import {datVeRequest} from '../dto/ve.dto';

export class VeController {
  constructor(
    @repository(VeRepository)
    public veRepository: VeRepository,
    @repository(DatVeRepository)
    public datVeRepository: DatVeRepository,
    @repository(GheDaDatRepository)
    public gheDaDatRepository: GheDaDatRepository,
    @inject(RestBindings.Http.RESPONSE) private res: Response,

  ) {}

  @post('/ve')
  @response(200, {
    description: 'Ve model instance',
    content: {'application/json': {schema: getModelSchemaRef(Ve)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ve, {
            title: 'NewVe',
          }),
        },
      },
    })
    ve: Ve,
  ): Promise<Ve> {
    return this.veRepository.create(ve);
  }

  @post('/dat-ve')
  @response(200, {
    description: 'Dat Ve instance',
    content: {'application/json': {schema: getModelSchemaRef(Ve)}},
  })
  async datVe(
    @requestBody(datVeRequest)
    veGhe: Ve & Ghe,
  ): Promise<VeResponse> {
    // ACID Properties
    const {ghe} = veGhe;
    const enumBonusCharge:{
      [key: string]: number
    } = {
      T1: 0,
      T2: 40000,
      T3: 50000
    }
    let tongTienVe: any = 0;
    const sql = `
    select VE_TINHTIEN(:p1, :p2) as tong from dual
    `;
    const transaction = await this.veRepository.dataSource.beginTransaction(
      IsolationLevel.READ_COMMITTED,
    );
    let res: VeResponse = {};
    try {
      console.log(veGhe);
      await Promise.all(
        ghe.map(async (i: Ghe) => {
          const tien = (await this.veRepository.execute(
            sql,
            [i.maGhe, veGhe.giaVe],
            {
              transaction,
            },
          )) as any;
          console.log(tien[0].TONG)
          const chargeMore = enumBonusCharge[veGhe.loaiVe]
          tongTienVe += (tien[0].TONG + chargeMore);
        }),
      );
      const veData = {
        ngayDat: new Date().toDateString(),
        giaVe: tongTienVe - veGhe.giamGia,
        maLichChieu: veGhe.maLichChieu,
        giamGia: veGhe.giamGia,
        loaiVe: veGhe.loaiVe,
        taiKhoan: veGhe.taiKhoan,
        hinhAnh: veGhe.hinhAnh,
      };
      const v = await this.veRepository.create(veData, {transaction});
      await Promise.all(
        ghe.map(async (i: Ghe) => {
          await this.datVeRepository.create(
            {
              maGhe: i.maGhe,
              maVe: v.maVe,
            },
            {transaction},
          );
          await this.gheDaDatRepository.create(
            {
              maGhe: i.maGhe,
              maLichChieu: veData.maLichChieu,
            },
            {transaction}
          )
        }),
      );
      await transaction.commit();
      res = {
        ve: v,
        ghe,
      };
    } catch (e) {
      await transaction.rollback();
      res = {};
      throw Error("Đặt ghế lỗi")
    }
    return res;
  }
  @get('/ve/count')
  @response(200, {
    description: 'Ve model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Ve) where?: Where<Ve>): Promise<Count> {
    return this.veRepository.count(where);
  }

  @get('/ve')
  @response(200, {
    description: 'Array of Ve model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Ve, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Ve) filter?: Filter<Ve>): Promise<Ve[]> {
    return this.veRepository.find(filter);
  }

  @patch('/ve')
  @response(200, {
    description: 'Ve PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ve, {partial: true}),
        },
      },
    })
    ve: Ve,
    @param.where(Ve) where?: Where<Ve>,
  ): Promise<Count> {
    return this.veRepository.updateAll(ve, where);
  }

  @get('/ve/{id}')
  @response(200, {
    description: 'Ve model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Ve, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Ve, {exclude: 'where'}) filter?: FilterExcludingWhere<Ve>,
  ): Promise<Ve> {
    return this.veRepository.findById(id, filter);
  }

  @patch('/ve/{id}')
  @response(204, {
    description: 'Ve PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ve, {partial: true}),
        },
      },
    })
    ve: Ve,
  ): Promise<void> {
    await this.veRepository.updateById(id, ve);
  }

  @put('/ve/{id}')
  @response(204, {
    description: 'Ve PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() ve: Ve,
  ): Promise<void> {
    await this.veRepository.replaceById(id, ve);
  }

  @del('/ve/{id}')
  @response(204, {
    description: 'Ve DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.veRepository.deleteById(id);
  }
}

// {
//   "fields": {
//     "maVe": true,
//     "ngayDat": true,
//     "giaVe": true,
//     "maLichChieu": true,
//     "loaiVe": true,
//     "hinhAnh": true,
//     "taiKhoan": true
//   },
//   "include": [
//     {
//       "relation": "veLichChieu",
//       "scope":{
//         "fields": {
//           "maLichChieu": true,
//           "ngayChieuGioChieu": true,
//           "maPhim": true,
//           "maRap": true
//         },
//         "include": [
//           {
//             "relation": "lichChieuRap",
//               "scope":{
//               "fields": {
//                 "maRap": true,
//                 "tenRap": true,
//                 "maCumRap": true
//               },
//               "include": [
//                 {
//                 "relation": "rap_cumRap",
//                 "scope":{
//                   "fields":{
//                     "maCumRap": true,
//                     "tenCumRap": true
//                   }
//               }
//             }
//             ]
//           }
//           },
//           {
//             "relation": "ghedadat"
//           }
//         ]
//       }
//     }
//     ]
//   }
