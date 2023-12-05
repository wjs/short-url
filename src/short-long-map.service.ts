import { Inject, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { UniqueCodeService } from './unique-code.service';
import { UniqueCode } from './entities/UniqueCode';
import { ShortLongMap } from './entities/ShortLongMap';

@Injectable()
export class ShortLongMapService {
  @InjectEntityManager()
  private entityManager: EntityManager;

  @Inject(UniqueCodeService)
  private uniqueCodeService: UniqueCodeService;

  async generate(longUrl: string) {
    // 如果存在就不重新生成了
    const m = await this.entityManager.findOneBy(ShortLongMap, { longUrl });
    if (m) {
      return m.shortUrl;
    }

    let uniqueCode = await this.entityManager.findOneBy(UniqueCode, {
      status: 0,
    });
    if (!uniqueCode) {
      uniqueCode = await this.uniqueCodeService.generateCode();
    }

    const map = new ShortLongMap();
    map.shortUrl = uniqueCode.code;
    map.longUrl = longUrl;

    await this.entityManager.insert(ShortLongMap, map);
    await this.entityManager.update(
      UniqueCode,
      { id: uniqueCode.id },
      { status: 1 },
    );

    return uniqueCode.code;
  }

  async getLongUrl(code: string) {
    const map = await this.entityManager.findOneBy(ShortLongMap, {
      shortUrl: code,
    });
    if (!map) {
      return null;
    }
    return map.longUrl;
  }
}
