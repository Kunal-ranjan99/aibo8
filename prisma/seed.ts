import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { SEED_CATEGORIES, SEED_COUPONS, SEED_COURSES, SEED_USERS } from "../src/lib/seed-data";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Aibo8 LMS database...");

  for (const u of SEED_USERS) {
    const passwordHash = await bcrypt.hash(u.passwordPlain, 10);
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        id: u.id,
        name: u.name,
        email: u.email,
        passwordHash,
        role: u.role,
        bio: u.bio,
      },
    });
  }

  for (const cat of SEED_CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
      },
    });
  }

  for (const c of SEED_COURSES) {
    const cat = SEED_CATEGORIES.find((x) => x.slug === c.categorySlug)!;
    await prisma.course.upsert({
      where: { slug: c.slug },
      update: {},
      create: {
        id: c.id,
        title: c.title,
        slug: c.slug,
        shortDescription: c.shortDescription,
        description: c.description,
        thumbnail: c.thumbnail,
        level: c.level,
        price: c.price,
        discountPrice: c.discountPrice ?? null,
        isFree: c.isFree,
        duration: c.duration,
        hardwareTags: c.hardwareTags,
        outcomes: c.outcomes,
        requirements: c.requirements,
        status: c.status,
        featured: c.featured,
        categoryId: cat.id,
        instructorId: c.instructorId,
        sections: {
          create: c.sections.map((s) => ({
            id: s.id,
            title: s.title,
            order: s.order,
            lessons: {
              create: s.lessons.map((l) => ({
                id: l.id,
                title: l.title,
                type: l.type,
                duration: l.duration,
                order: l.order,
                isPreview: Boolean(l.isPreview),
                videoUrl: l.videoUrl ?? null,
                content: l.content ?? null,
                codeSnippet: l.codeSnippet ?? null,
                codeLang: l.codeLang ?? null,
                quizData: l.quizData ? (l.quizData as object) : undefined,
              })),
            },
          })),
        },
      },
    });
  }

  for (const cp of SEED_COUPONS) {
    await prisma.coupon.upsert({
      where: { code: cp.code },
      update: {},
      create: {
        code: cp.code,
        discountType: cp.discountType,
        discountValue: cp.discountValue,
        discountPercent: cp.discountPercent,
        active: cp.active,
        expiresAt: cp.expiresAt ? new Date(`${cp.expiresAt}T23:59:59Z`) : null,
      },
    });
  }

  console.log("Aibo8 LMS seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
