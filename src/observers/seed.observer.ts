import {
  Application,
  CoreBindings,
  inject,
  lifeCycleObserver,
  LifeCycleObserver
} from '@loopback/core';
// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-access-control-migration
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
import {genSalt, hash} from 'bcryptjs';
import {
  CumRapRepository,
  GheRepository,
  HeThongRapRepository,
  LichChieuRepository,
  LoaiGheRepository,
  LoaiNguoiDungRepository,
  PhimRepository,
  PhimTheLoaiRepository,
  RapRepository,
  TheLoaiRepository,
  UsersRepository
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
    @inject('repositories.GheRepository')
    private gheRepo: GheRepository,
    @inject('repositories.LoaiGheRepository')
    private loaiGheRepo: LoaiGheRepository,
    @inject('repositories.TheLoaiRepository')
    private theLoaiRepo: TheLoaiRepository,
    @inject('repositories.PhimRepository')
    private phimRepo: PhimRepository,
    @inject('repositories.PhimTheLoaiRepository')
    private phimTheLoaiRepo: PhimTheLoaiRepository,
    @inject('repositories.LichChieuRepository')
    private lichChieuRepo: LichChieuRepository,
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
      await this.createLoaiGhe();
      await this.createGhe();
      await this.createTheLoai();
      await this.createPhim();
      await this.createPhimTheLoai();
      await this.createLichChieu();
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
      const hashedPassword = await this.hashPassword('test12345', 10);
      const users = [
        {
          username: 'php1301',
          email: 'test12345@gmail.com',
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
          tenCumRap: 'BHDStar Kinh Duong Vuong',
          thongTin: 'blabla',
          maHeThongRap: 'BHDStar',
        },
        {
          maCumRap: 'bhd-hvt',
          tenCumRap: 'BHDStar Hoang Van Thu',
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
            'https://i.imgur.com/SrTrhaq.png',
        },
        {
          maHeThongRap: 'CGV',
          tenHeThongRap: 'cgv',
          biDanh: 'bhd-star-cineplex',
          logo: 'https://i.imgur.com/9pXuk9f.png',
        },
        {
          maHeThongRap: 'CineStar',
          tenHeThongRap: 'CineStar',
          biDanh: 'cinestar',
          logo: 'https://i.imgur.com/GSw0tHJ.png',
        },
        {
          maHeThongRap: 'GalaxyCinema',
          tenHeThongRap: 'Galaxy Cinema',
          biDanh: 'galaxy-cinema',
          logo: 'https://i.imgur.com/GWImlrr.png',
        },
        // {
        //   maHeThongRap: 'LotteCinema',
        //   tenHeThongRap: 'LotteCinema',
        //   biDanh: 'lotte-cinema',
        //   logo: 'http://movie0706.cybersoft.edu.vn/hinhanh/LotteCinema.png',
        // },
        {
          maHeThongRap: 'MegaGS',
          tenHeThongRap: 'MegaGS',
          biDanh: 'megags',
          logo: 'https://i.imgur.com/fCA12OC.png',
        },
      ];
      for (const h of heThongRap) {
        await this.heThongRapRepo.create(h);
      }
      console.log('HeThongRap Seeded');
    }
  }
  async createLoaiGhe(): Promise<void> {
    const existed = await this.loaiGheRepo.find({
      where: {
        maLoaiGhe: 1,
      },
    });
    if (existed.length === 0) {
      const loaiGhe = [
        {
          tenLoaiGhe: 'Ghe Thuong',
          moTa: 'Ghế thường, không có khuyến mãi',
          chietKhau: 0,
        },
        {
          tenLoaiGhe: 'Ghe VIP',
          moTa: 'Ghế VIP, có khuyến mãi',
          chietKhau: 50,
        },
      ];
      for (const lg of loaiGhe) {
        await this.loaiGheRepo.create(lg);
      }
      console.log('LoaiGhe Seeded');
    }
  }
  async createGhe(): Promise<void> {
    const existed = await this.gheRepo.find({
      where: {
        maGhe: 1,
      },
    });
    if (existed.length === 0) {
      const arr = [...Array(7)];
      const maLoaiGheArr = [1, 2];
      arr.map((value, index) => {
        // inti stt mỗi rạp
        let stt = 0;
        const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I','J'];
        alphabet.map(alpha => {
          // Có thể random seat số lượng ghế mỗi hàng từ 10 ~ 12
          // const arrSeats = [...Array(Math.floor(Math.random() * 15) + 1)]; // random từ 1 đến 15
          const arrSeats = [...Array(12)];
          return arrSeats.map(async (seat, seatIndex) => {
            stt += 1;
            try {
              await this.gheRepo.create({
                // seed 7 rạp 0->6 => +1
                maRap: index + 1,
                // Tên ghế là chữ + số ghế hàng đó
                tenGhe: `${alpha}${seatIndex + 1}`,
                stt: stt,
                // Random maLoaiGhe
                maLoaiGhe:
                  maLoaiGheArr[Math.floor(Math.random() * maLoaiGheArr.length)],
                // kichHoat: false,
              });
            } catch (e) {
              console.log(e);
            }
          });
        });
      });
      console.log('Ghe Seeded');
    }
  }
  async createTheLoai(): Promise<void> {
    const existed = await this.theLoaiRepo.find({
      where: {
        maTheLoai: 1,
      },
    });
    if (existed.length === 0) {
      const theLoai = [
        {
          tenTheLoai: 'Vien Tuong',
        },
        {
          tenTheLoai: 'Hanh Dong',
        },
        {
          tenTheLoai: 'Tinh Cam',
        },
        {
          tenTheLoai: 'StoryTelling',
        },
        {
          tenTheLoai: 'Motion',
        },
      ];
      for (const tl of theLoai) {
        await this.theLoaiRepo.create(tl);
      }
      console.log('TheLoai seeded');
    }
  }
  async createPhim(): Promise<void> {
    const existed = await this.phimRepo.find({
      where: {
        maPhim: 1,
      },
    });
    if (existed.length === 0) {
      const a = [];
      const randomTenPhim = [
        '13 Reason Why',
        'The Queeen Gambit',
        'Deadpool',
        'Fast and Furious',
        'w@p',
        'La la land',
        'Doc Co Cau Bai',
        'Tam Quoc Chi',
        'Trick Or Treat',
        'Light It Up',
        'The Aquaman without Amber Heard',
        'The Boys',
        'Spider Man: Homecoming',
        'The Batman',
      ];
      const randomTrailer = [
        'https://www.youtube.com/watch?v=9jrxLF_0dKA&t=347s',
        'https://www.youtube.com/watch?v=6avJHaC3C2U',
        'https://www.youtube.com/watch?v=IlU-zDU6aQ0',
        'https://www.youtube.com/watch?v=VSceuiPBpxY',
        'https://www.youtube.com/watch?v=9QiE-M1LrZk',
        'https://www.youtube.com/watch?v=52nqjrCs57s',
        'https://www.youtube.com/watch?v=gnkrDse9QKc',
      ];
      // Random năm, tháng, ngày tới ngày hiện tại
      function randomDate(start: Date, end: Date) {
        return new Date(
          start.getTime() + Math.random() * (end.getTime() - start.getTime()),
        ).toDateString();
      }
      for (let i = 0; i < 50; i += 1) {
        // random element bất kì trong mảng
        const tenPhim =
          randomTenPhim[Math.floor(Math.random() * randomTenPhim.length)];
        const nhom = {
          tenPhim,
          trailer:
            randomTrailer[Math.floor(Math.random() * randomTrailer.length)],
          hinhAnh: `https://picsum.photos/id/${i}/200/300`, // Random image
          moTa: 'Great Film',
          ngayKhoiChieu: randomDate(new Date(2020, 1, 1), new Date(2020, 12, 31)),
          // random float 5->0 làm tròn 1 chữ số -> string
          danhGia: Math.round((Math.random() * (5 - 0) + 0) * 1e1) / 1e1,
          daXoa: false,
          biDanh: tenPhim.toLowerCase().split(' ').join('-'), // split dấu cách và nối bằng -
        };
        a.push(nhom);
      }
      await Promise.all(
        a.map(async i => {
          await this.phimRepo.create(i);
        }),
      );
      console.log('Phim Seeded');
    }
  }
  async createPhimTheLoai(): Promise<void> {
    const existed = await this.phimTheLoaiRepo.find({
      where: {
        isbn: 1,
      },
    });
    if (existed.length === 0) {
      try {
        const seededPhim = await this.phimRepo.find();
        const seededTheLoai = await this.theLoaiRepo.find();
        await Promise.all(
          seededPhim.map(async i => {
            const shuffleTheLoai = this.shuffleArray(seededTheLoai);
            const randomNumOfTheLoai = Math.floor(
              Math.random() * shuffleTheLoai.length,
            );
            const randomTheLoai = shuffleTheLoai.slice(randomNumOfTheLoai);
            await Promise.all(
              randomTheLoai.map(async tl => {
                await this.phimRepo.phimtheloai(i.maPhim).link(tl.maTheLoai);
              }),
            );
          }),
        );
        console.log('PhimTheLoai seeded');
      } catch (e) {
        console.log(e.message);
      }
    }
  }
  async createLichChieu(): Promise<void> {
    const existed = await this.lichChieuRepo.count();
    function randomDate(start: Date, end: Date) {
      return new Date(
        start.getTime() + Math.random() * (end.getTime() - start.getTime()),
      ).toDateString();
    }
    if (existed.count === 0) {
      const lichChieu = [
        {
          ngayChieuGioChieu: randomDate(new Date(2021, 1, 1), new Date()),
          giaVe: 42000,
          thoiLuong: 120,
          maRap: 3,
          maCumRap: 'cgv-ndc',
          maHeThongRap: 'CGV',
          maPhim: 30,
        },
        {
          ngayChieuGioChieu: randomDate(new Date(2021, 1, 1), new Date()),
          giaVe: 42000,
          thoiLuong: 120,
          maRap: 3,
          maCumRap: 'cgv-ndc',
          maHeThongRap: 'CGV',
          maPhim: 30,
        },
        {
          ngayChieuGioChieu: randomDate(new Date(2021, 1, 1), new Date()),
          giaVe: 50000,
          thoiLuong: 120,
          maRap: 5,
          maCumRap: 'bhd-hvt',
          maHeThongRap: 'BHDStar',
          maPhim: 12,
        },
        {
          ngayChieuGioChieu: randomDate(new Date(2021, 1, 1), new Date()),
          giaVe: 35000,
          thoiLuong: 120,
          maRap: 4,
          maCumRap: 'cgv-3/2',
          maHeThongRap: 'CGV',
          maPhim: 42,
        },
        {
          ngayChieuGioChieu: randomDate(new Date(2021, 1, 1), new Date()),
          giaVe: 40000,
          thoiLuong: 120,
          maRap: 7,
          maCumRap: 'bhd-kdv',
          maHeThongRap: 'BHDStar',
          maPhim: 30,
        },
        {
          ngayChieuGioChieu: randomDate(new Date(2021, 1, 1), new Date()),
          giaVe: 40000,
          thoiLuong: 120,
          maRap: 7,
          maCumRap: 'bhd-kdv',
          maHeThongRap: 'BHDStar',
          maPhim: 30,
        },
        {
          ngayChieuGioChieu: randomDate(new Date(2021, 1, 1), new Date()),
          giaVe: 40000,
          thoiLuong: 120,
          maRap: 7,
          maCumRap: 'bhd-kdv',
          maHeThongRap: 'BHDStar',
          maPhim: 30,
        },
        {
          ngayChieuGioChieu: randomDate(new Date(2021, 1, 1), new Date()),
          giaVe: 60000,
          thoiLuong: 120,
          maRap: 3,
          maCumRap: 'cgv-3/2',
          maHeThongRap: 'CGV',
          maPhim: 18,
        },
        {
          ngayChieuGioChieu: randomDate(new Date(2021, 1, 1), new Date()),
          giaVe: 55000,
          thoiLuong: 120,
          maRap: 1,
          maCumRap: 'megags-cao-thang',
          maHeThongRap: 'MegaGS',
          maPhim: 10,
        },
      ];
      for (const lc of lichChieu) {
        await this.lichChieuRepo.create(lc);
      }
      console.log('LichChieu seeded');
    }
  }
  async hashPassword(password: string, rounds: number): Promise<string> {
    const salt = await genSalt(rounds);
    return hash(password, salt);
  }
  shuffleArray<T>(array: T[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }
}
