import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('开始种子数据...');

  // 创建默认管理员
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      passwordHash: adminPassword,
    },
  });
  console.log('✅ 创建管理员:', admin.username);

  // 创建游戏
  const starrail = await prisma.game.upsert({
    where: { slug: 'starrail' },
    update: {},
    create: {
      name: '崩坏：星穹铁道',
      slug: 'starrail',
      sortOrder: 1,
      isActive: true,
    },
  });
  console.log('✅ 创建游戏:', starrail.name);

  const genshin = await prisma.game.upsert({
    where: { slug: 'genshin' },
    update: {},
    create: {
      name: '原神',
      slug: 'genshin',
      sortOrder: 2,
      isActive: false, // 暂未开放
    },
  });
  console.log('✅ 创建游戏:', genshin.name);

  const zzz = await prisma.game.upsert({
    where: { slug: 'zzz' },
    update: {},
    create: {
      name: '绝区零',
      slug: 'zzz',
      sortOrder: 3,
      isActive: false, // 暂未开放
    },
  });
  console.log('✅ 创建游戏:', zzz.name);

  // 创建星铁的分类
  const categories = [
    { name: '角色语音', slug: 'character-voice', sortOrder: 1 },
    { name: 'BGM音乐', slug: 'bgm', sortOrder: 2 },
    { name: '战斗音效', slug: 'battle-sound', sortOrder: 3 },
    { name: '角色立绘', slug: 'character-art', sortOrder: 4 },
    { name: '场景原画', slug: 'scene-art', sortOrder: 5 },
    { name: 'UI素材', slug: 'ui-assets', sortOrder: 6 },
    { name: '过场动画', slug: 'cutscene', sortOrder: 7 },
    { name: '其他', slug: 'other', sortOrder: 8 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: {
        gameId_slug: {
          gameId: starrail.id,
          slug: cat.slug,
        },
      },
      update: {},
      create: {
        gameId: starrail.id,
        name: cat.name,
        slug: cat.slug,
        sortOrder: cat.sortOrder,
      },
    });
    console.log('✅ 创建分类:', cat.name);
  }

  // 创建标签
  const tags = [
    // 角色标签
    { name: '开拓者', slug: 'trailblazer', type: 'CHARACTER' },
    { name: '三月七', slug: 'march-7th', type: 'CHARACTER' },
    { name: '丹恒', slug: 'dan-heng', type: 'CHARACTER' },
    { name: '姬子', slug: 'himeko', type: 'CHARACTER' },
    { name: '瓦尔特', slug: 'welt', type: 'CHARACTER' },
    // 稀有度
    { name: '五星', slug: '5-star', type: 'RARITY' },
    { name: '四星', slug: '4-star', type: 'RARITY' },
    // 元素
    { name: '物理', slug: 'physical', type: 'ELEMENT' },
    { name: '火', slug: 'fire', type: 'ELEMENT' },
    { name: '冰', slug: 'ice', type: 'ELEMENT' },
    { name: '雷', slug: 'thunder', type: 'ELEMENT' },
    { name: '风', slug: 'wind', type: 'ELEMENT' },
    { name: '量子', slug: 'quantum', type: 'ELEMENT' },
    { name: '虚数', slug: 'imaginary', type: 'ELEMENT' },
  ];

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: {
        name: tag.name,
        slug: tag.slug,
        type: tag.type as any,
      },
    });
    console.log('✅ 创建标签:', tag.name);
  }

  console.log('✨ 种子数据完成！');
  console.log('');
  console.log('📝 默认管理员账号:');
  console.log('   用户名: admin');
  console.log('   密码: admin123');
  console.log('');
  console.log('⚠️  请在生产环境中修改默认密码！');
}

main()
  .catch((e) => {
    console.error('❌ 种子数据失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

