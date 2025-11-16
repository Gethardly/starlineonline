import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('Komsomolskaya1@', 10);

  await prisma.user.upsert({
    where: { email: 'chernyavskayayul@yandex.ru' },
    update: {},
    create: {
      email: 'chernyavskayayul@yandex.ru',
      password: hash,
      name: 'Админ',
    },
  });

  console.log('Админ создан!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
