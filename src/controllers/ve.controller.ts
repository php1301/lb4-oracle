/* eslint-disable @typescript-eslint/no-explicit-any */
import {inject} from '@loopback/context';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  IsolationLevel,
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
  Response,
  RestBindings,
} from '@loopback/rest';
import {VeResponse} from '../@types/ve-response';
import {datVeRequest} from '../dto/ve.dto';
import {EmailManagerBindings} from '../keys';
import {Ghe, Ve} from '../models';
import {
  DatVeRepository,
  GheDaDatRepository,
  UsersRepository,
  VeRepository,
} from '../repositories';
import {EmailManager} from '../services/send-email.service';

export class VeController {
  constructor(
    @repository(VeRepository)
    public veRepository: VeRepository,
    @repository(DatVeRepository)
    public datVeRepository: DatVeRepository,
    @repository(UsersRepository)
    public userRepository: UsersRepository,
    @repository(GheDaDatRepository)
    public gheDaDatRepository: GheDaDatRepository,
    @inject(RestBindings.Http.RESPONSE) private res: Response,
    @inject(EmailManagerBindings.SEND_MAIL) public emailManager: EmailManager,
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
  ): Promise<VeResponse | Response<{message?: string}>> {
    // ACID Properties
    const {ghe} = veGhe;
    const enumBonusCharge: {
      [key: string]: number;
    } = {
      T1: 0,
      T2: 40000,
      T3: 50000,
    };
    let tongTienVe: any = 0;
    const sql = `
    select VE_TINHTIEN(:p1, :p2) as tong from dual
    `;
    const transaction = await this.veRepository.dataSource.beginTransaction(
      IsolationLevel.READ_COMMITTED,
    );
    let res: VeResponse = {};
    let finalKhuyenMai = '';
    let finalTongTienVe = 0;
    try {
      // T??nh ti???n t???ng gh???
      const isValidPointUsage = await this.isUsingPointValid(
        veGhe.taiKhoan,
        veGhe.diemTichLuySuDung,
      );
      console.log(isValidPointUsage);
      if (!isValidPointUsage)
        throw new Error('Point error - ??i???m t??ch l??y kh??ng ?????');
      await Promise.all(
        ghe.map(async (i: Ghe) => {
          const tien = (await this.veRepository.execute(
            sql,
            [i.maGhe, veGhe.giaVe],
            {
              transaction,
            },
          )) as any;
          console.log(tien[0].TONG, i.maGhe);
          const chargeMore = enumBonusCharge[veGhe.loaiVe];
          tongTienVe += tien[0].TONG + chargeMore;
        }),
      );

      // Ki???m tra xem ph???i th??ng sinh nh???t kh??ng
      const isBirthday = await this.isBirthDayMonth(veGhe.taiKhoan);
      console.log(tongTienVe);
      console.log('Tam tinh');
      const birthdayString = isBirthday
        ? '????y l?? th??ng sinh nh???t c???a b???n n??n b???n khuy???n m??i 10% t???ng h??a ????n'
        : '';
      // Quy ?????i ??i???m
      const soDiemQuyDoi: string =
        veGhe.diemTichLuySuDung > 0
          ? `B???n ???? s??? d???ng ${
              veGhe.diemTichLuySuDung
            } ??i???m t??ch l??y t????ng ???ng v???i gi???m ${
              veGhe.diemTichLuySuDung * 10
            } VN?? tr??n t???ng h??a ????n`
          : '';
      if (!isBirthday && soDiemQuyDoi === '') {
        finalKhuyenMai = '';
      } else if (isBirthday && soDiemQuyDoi !== '') {
        finalKhuyenMai = `${birthdayString} - ${soDiemQuyDoi} `;
      } else {
        finalKhuyenMai = `${birthdayString}${soDiemQuyDoi} `;
      }
      // if (veGhe.giamGia > 0) {
      //   finalKhuyenMai += `- M?? gi???m gi??? coupon NOEL gi???m ${veGhe.giamGia}`;
      // }
      console.log(finalKhuyenMai);
      finalTongTienVe =
        tongTienVe -
          veGhe.giamGia -
          veGhe.diemTichLuySuDung * 10 -
          (isBirthday ? Math.floor((tongTienVe * 10) / 100) : 0) <
        0
          ? 0
          : tongTienVe -
            veGhe.giamGia -
            veGhe.diemTichLuySuDung * 10 -
            (isBirthday ? Math.floor((tongTienVe * 10) / 100) : 0);
      console.log('T???ng t??nh', finalTongTienVe);
      // V?? data - ch??a commit n??n v???n rollback ???????c n???u c?? l???i
      const veData = {
        ngayDat: new Date().toDateString(),
        giaVe: finalTongTienVe,
        maLichChieu: veGhe.maLichChieu,
        giamGia: veGhe.giamGia,
        loaiVe: veGhe.loaiVe,
        taiKhoan: veGhe.taiKhoan,
        hinhAnh: veGhe.hinhAnh,
        diemTichLuySuDung: veGhe.diemTichLuySuDung,
        khuyenMai: `${veGhe.khuyenMai || ''}${finalKhuyenMai}`,
      };
      const v = await this.veRepository.create(veData, {transaction});
      // Map v???i DatVe v?? GheDaDat
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
            {transaction},
          );
        }),
      );
      const userBeforeCommit = await this.userRepository.findById(
        veGhe.taiKhoan,
      );
      console.log('M?? lo???i c??', userBeforeCommit.maLoaiNguoiDung);
      await transaction.commit();
      const userAfterCommit = await this.userRepository.findById(
        veGhe.taiKhoan,
      );
      console.log('M?? lo???i m???i', userAfterCommit.maLoaiNguoiDung);
      console.log(userAfterCommit.tongDiemTichLuy);
      console.log(
        this.handleUpgradeMessage(
          userAfterCommit.tongDiemTichLuy,
          userBeforeCommit.maLoaiNguoiDung,
        ),
      );
      res = {
        ve: v,
        ghe,
        upgradeMessage: this.handleUpgradeMessage(
          userAfterCommit.tongDiemTichLuy,
          userBeforeCommit.maLoaiNguoiDung,
        ),
      };
    } catch (e) {
      await transaction.rollback();
      if (e.message.split(' - ')[0] === 'Point error') {
        const err = {message: e.message.split(' - ')[1]};
        return this.res.status(400).json({err});
      } else {
        const err = {message: '?????t gh??? l???i' + ' ' + e.message};
        return this.res.status(400).json({err});
      }
      // throw Error('?????t gh??? kh??ng th??nh kh??ng' + ' ' + e.message);
    }
    return res;
  }

  @post('/gui-email-hoa-don')
  @response(200, {
    description: 'Ve model instance',
    content: {'application/json': {schema: getModelSchemaRef(Ve)}},
  })
  async guiEmailHoaDon(
    @requestBody({})
    ve: any,
  ): Promise<{message: string}> {
    try {
      await this.emailManager.sendMail(ve);
      return {
        message: 'Send email sucesss',
      };
    } catch (e) {
      return {
        message: 'Error occurred ' + e.message,
      };
    }
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
  @get('/ve/doanh-thu-theo-he-thong-rap')
  @response(200, {
    description: 'Doanh thu cac he thong rap',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Ve, {includeRelations: true}),
        },
      },
    },
  })
  async doanhThuHeThongRap(): Promise<any[]> {
    const sql = `
    select JSON_ARRAY(callProcedure3()) as final from dual
    `;
    try {
      const result = await this.veRepository.execute(sql);
      console.log(JSON.parse(result[0]['FINAL']));
      return JSON.parse(result[0]['FINAL']);
    } catch (e) {
      console.log(e.message);
      return [];
    }
  }
  @get('/ve/doanh-thu-theo-thang')
  @response(200, {
    description: 'Doanh thu theo thang',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Ve, {includeRelations: true}),
        },
      },
    },
  })
  async doanhThuTheoThang(): Promise<any[]> {
    const sql = `
    select JSON_ARRAY(callProcedure2()) as final from dual
    `;
    try {
      const result = await this.veRepository.execute(sql);
      console.log(JSON.parse(result[0]['FINAL']));
      return JSON.parse(result[0]['FINAL']);
    } catch (e) {
      console.log(e.message);
      return [];
    }
  }
  @get('/ve/doanh-thu-theo-phim/{soLuong}')
  @response(200, {
    description: 'Doanh thu cac phim',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Ve, {includeRelations: true}),
        },
      },
    },
  })
  async doanhThuTheoPhim(
    @param.path.number('soLuong') soLuong: number,
  ): Promise<any[]> {
    const sql = `
    select JSON_ARRAY(callProcedure4(:p1)) as final from dual
    `;
    try {
      const result = await this.veRepository.execute(sql, [soLuong]);
      console.log(JSON.parse(result[0]['FINAL']));
      return JSON.parse(result[0]['FINAL']);
    } catch (e) {
      console.log(e.message);
      return [];
    }
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
  async isBirthDayMonth(id: number): Promise<boolean> {
    const user = await this.userRepository.findById(id);
    const birthday: Date = user.ngaySinh as unknown as Date;
    console.log('Sinh nhat', birthday, birthday.getMonth());
    const finalParam =
      birthday.getMonth() + 1 < 10
        ? `0${birthday.getMonth() + 1}`
        : birthday.getMonth() + 1;
    const sql = `
    select call_proc_isBirthday(:p1) as checkResult from dual
    `;
    console.log(finalParam);
    const result = (await this.veRepository.execute(sql, [finalParam])) as any;
    console.log(result[0]['CHECKRESULT']);
    return result[0]['CHECKRESULT'] === 1;
  }
  async isUsingPointValid(id: number, point: number): Promise<boolean> {
    const user = await this.userRepository.findById(id);
    return user.diemTichLuy >= point;
  }
  handleUpgradeMessage(points: number, maLoaiNguoiDung: number): string {
    if (points >= 400 && points <= 600) {
      return 'Ch??c m???ng b???n ???? ???????c th??ng c???p l??n h???i vi??n th??n thi???t';
    } else if (points > 600 && points <= 800) {
      return 'Ch??c m???ng b???n ???? ???????c th??ng c???p l??n h???i vi??n b???c';
    } else if (points > 800 && points <= 1000) {
      return 'Ch??c m???ng b???n ???? ???????c th??ng c???p l??n h???i vi??n v??ng';
    } else if (points >= 1000 && points <= 1200) {
      return 'Ch??c m???ng b???n ???? ???????c th??ng c???p l??n h???i vi??n kim c????ng';
    } else if (
      points > 1200 &&
      maLoaiNguoiDung !== 6 &&
      maLoaiNguoiDung !== 1
    ) {
      return 'Ch??c m???ng b???n ???? ???????c th??ng c???p l??n h???i vi??n kim c????ng';
    }
    return '';
  }
}
