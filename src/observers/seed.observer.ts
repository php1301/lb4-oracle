import {HeThongRapRepository} from './../repositories/he-thong-rap.repository';
import {
  Application,
  CoreBindings,
  inject,
  lifeCycleObserver,
  LifeCycleObserver,
} from '@loopback/core';
// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-access-control-migration
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
import {genSalt, hash} from 'bcryptjs';
import {
  CumRapRepository,
  LoaiNguoiDungRepository,
  RapRepository,
  UsersRepository,
} from '../repositories';

/**
 * This class will be bound to the application as a `LifeCycleObserver` during
 * `boot`
 */
@lifeCycleObserver('')
export class SampleObserver implements LifeCycleObserver {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) private app: Application,
    @inject('repositories.LoaiNguoiDungRepository')
    private loaiNguoiDungRepo: LoaiNguoiDungRepository,
    @inject('repositories.UsersRepository')
    private userRepo: UsersRepository,
    @inject('repositories.RapRepository')
    private rapRepo: RapRepository,
    @inject('repositories.CumRapRepository')
    private cumRapRepo: CumRapRepository,
    @inject('repositories.HeThongRapRepository')
    private heThongRapRepo: HeThongRapRepository,
  ) {}

  /**
   * This method will be invoked when the application starts
   */
  async start(): Promise<void> {
    // Add your logic for start
    if (process.env.SEED_DATA === 'run') {
      console.log('run');
      await this.createLoaiNguoiDung();
      await this.createUsers();
      await this.createHeThongRap();
      await this.createCumRap();
      await this.createRap();
    }
  }

  /**
   * This method will be invoked when the application stops
   */
  async stop(): Promise<void> {
    // Add your logic for stop
  }

  async createUsers(): Promise<void> {
    const existed = await this.userRepo.find({
      where: {
        taiKhoan: 1,
      },
    });
    if (existed.length === 0) {
      const hashedPassword = await this.hashPassword('test1234', 10);
      const users = [
        {
          username: 'php1301',
          email: 'test1234@gmail.com',
          password: hashedPassword,
          maLoaiNguoiDung: 1,
        },
        {
          username: 'phuc',
          email: 'test123@gmail.com',
          password: hashedPassword,
          maLoaiNguoiDung: 2,
        },
        {
          username: 'Bob',
          email: 'bob@projects.com',
          password: hashedPassword,
          maLoaiNguoiDung: 3,
        },
      ];

      for (const u of users) {
        const currentUser = await this.userRepo.create(u);
        await this.userRepo
          .userCredentials(currentUser.taiKhoan)
          .create({password: u.password, taiKhoan: currentUser.taiKhoan});
      }
      console.log('Users Seeded');
    }
  }

  async createLoaiNguoiDung(): Promise<void> {
    const loaiNguoiDung = [
      {
        maLoaiNguoiDung: 1,
        tenLoai: 'Client',
      },
      {
        maLoaiNguoiDung: 2,
        tenLoai: 'Admin',
      },
      {
        maLoaiNguoiDung: 3,
        tenLoai: 'VIP',
      },
    ];
    const existed = await this.loaiNguoiDungRepo.find({
      where: {maLoaiNguoiDung: 1},
    });
    if (existed.length === 0) {
      for (const p of loaiNguoiDung) {
        await this.loaiNguoiDungRepo.create(p);
      }
      console.log('LoaiNguoiDung Seeded');
    }
  }
  async createRap(): Promise<void> {
    const existed = await this.rapRepo.find({
      where: {
        maRap: 1,
      },
    });
    if (existed.length === 0) {
      const rap = [
        {
          tenRap: 'Rap 1',
          soGhe: 40,
          maCumRap: 'megags-cao-thang',
        },
        {
          tenRap: 'Rap 2',
          soGhe: 50,
          maCumRap: 'megags-cao-thang',
        },
        {
          tenRap: 'Rap 3',
          soGhe: 60,
          maCumRap: 'cgv-ndc',
        },
        {
          tenRap: 'Rap 4',
          soGhe: 40,
          maCumRap: 'cgv-3/2',
        },
        {
          tenRap: 'Rap 5',
          soGhe: 30,
          maCumRap: 'bhd-hvt',
        },
        {
          tenRap: 'Rap 6',
          soGhe: 50,
          maCumRap: 'bhd-hvt',
        },
        {
          tenRap: 'Rap 7',
          soGhe: 40,
          maCumRap: 'bhd-kdv',
        },
      ];
      for (const r of rap) {
        await this.rapRepo.create(r);
      }
      console.log('Rap Seeded');
    }
  }
  async createCumRap(): Promise<void> {
    const existed = await this.cumRapRepo.find({
      where: {
        maCumRap: 'megags-cao-thang',
      },
    });
    if (existed.length === 0) {
      const cumRap = [
        {
          maCumRap: 'megags-cao-thang',
          tenCumRap: 'MegaGS - Cao Thắng',
          thongTin: 'blabla',
          maHeThongRap: 'MegaGS',
        },
        {
          maCumRap: 'megags-ntp',
          tenCumRap: 'MegaGS - NTP',
          thongTin: 'blabla',
          maHeThongRap: 'MegaGS',
        },
        {
          maCumRap: 'bhd-kdv',
          tenCumRap: 'BHD Kinh Duong Vuong',
          thongTin: 'blabla',
          maHeThongRap: 'BHDStar',
        },
        {
          maCumRap: 'bhd-hvt',
          tenCumRap: 'BHD Hoang Van Thu',
          thongTin: 'blabla',
          maHeThongRap: 'BHDStar',
        },
        {
          maCumRap: 'cgv-ndc',
          tenCumRap: 'CGV Nguyen Dinh Chieu',
          thongTin: 'blabla',
          maHeThongRap: 'CGV',
        },
        {
          maCumRap: 'cgv-3/2',
          tenCumRap: 'CGV 3 thang 2',
          thongTin: 'blabla',
          maHeThongRap: 'CGV',
        },
      ];
      for (const c of cumRap) {
        await this.cumRapRepo.create(c);
      }
      console.log('CumRap Seeded');
    }
  }
  async createHeThongRap(): Promise<void> {
    const existed = await this.heThongRapRepo.find({
      where: {
        maHeThongRap: 'BHDStar',
      },
    });
    if (existed.length === 0) {
      const heThongRap = [
        {
          maHeThongRap: 'BHDStar',
          tenHeThongRap: 'BHD Star Cineplex',
          biDanh: 'bhd-star-cineplex',
          logo:
            'http://movie0706.cybersoft.edu.vn/hinhanh/bhd-star-cineplex.png',
        },
        {
          maHeThongRap: 'CGV',
          tenHeThongRap: 'cgv',
          biDanh: 'bhd-star-cineplex',
          logo: 'http://movie0706.cybersoft.edu.vn/hinhanh/cgv.png',
        },
        {
          maHeThongRap: 'CineStar',
          tenHeThongRap: 'CineStar',
          biDanh: 'cinestar',
          logo: 'http://movie0706.cybersoft.edu.vn/hinhanh/cinestar.png',
        },
        {
          maHeThongRap: 'GalaxyCinema',
          tenHeThongRap: 'Galaxy Cinema',
          biDanh: 'galaxy-cinema',
          logo: 'http://movie0706.cybersoft.edu.vn/hinhanh/galaxy-cinema.png',
        },
        {
          maHeThongRap: 'LotteCinema',
          tenHeThongRap: 'LotteCinema',
          biDanh: 'lotte-cinema',
          logo: 'http://movie0706.cybersoft.edu.vn/hinhanh/LotteCinema.png',
        },
        {
          maHeThongRap: 'MegaGS',
          tenHeThongRap: 'MegaGS',
          biDanh: 'megags',
          logo: 'http://movie0706.cybersoft.edu.vn/hinhanh/megags.png',
        },
      ];
      for (const h of heThongRap) {
        await this.heThongRapRepo.create(h);
      }
      console.log('HeThongRap Seeded');
    }
  }
  async hashPassword(password: string, rounds: number): Promise<string> {
    const salt = await genSalt(rounds);
    return hash(password, salt);
  }
}
