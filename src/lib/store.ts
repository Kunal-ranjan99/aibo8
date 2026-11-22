import bcrypt from "bcryptjs";
import { prisma, hasDatabase } from "./prisma";
import {
  SEED_CATEGORIES,
  SEED_CERTIFICATES,
  SEED_COUPONS,
  SEED_COURSES,
  SEED_ENROLLMENTS,
  SEED_USERS,
  SeedUser,
} from "./seed-data";
import {
  CategoryData,
  CertificateData,
  CouponData,
  CourseData,
  CourseStatus,
  EnrollmentData,
  LessonData,
  LessonType,
  NoteData,
  QuizQuestion,
  Role,
  UserSession,
} from "./types";

interface MemoryDB {
  users: (SeedUser & { passwordHash: string })[];
  categories: CategoryData[];
  courses: CourseData[];
  enrollments: EnrollmentData[];
  notes: NoteData[];
  certificates: CertificateData[];
  coupons: CouponData[];
}

const globalForMem = globalThis as unknown as { aibo8MemV2?: MemoryDB };

function getMem(): MemoryDB {
  if (!globalForMem.aibo8MemV2) {
    globalForMem.aibo8MemV2 = {
      users: SEED_USERS.map((u) => ({
        ...u,
        passwordHash: bcrypt.hashSync(u.passwordPlain, 8),
      })),
      categories: structuredClone(SEED_CATEGORIES),
      courses: structuredClone(SEED_COURSES),
      enrollments: structuredClone(SEED_ENROLLMENTS),
      notes: [
        {
          id: "note-1",
          userId: "user-student-1",
          lessonId: "les-1-2",
          content: "Remember to source /opt/ros/humble/setup.bash before running the RoverDriveNode.",
          createdAt: "2026-11-11T09:30:00.000Z",
        },
      ],
      certificates: structuredClone(SEED_CERTIFICATES),
      coupons: structuredClone(SEED_COUPONS),
    };
  }
  return globalForMem.aibo8MemV2;
}

export function getCategories(): CategoryData[] {
  return getMem().categories;
}

export function createCategory(name: string, description: string): CategoryData {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const cat: CategoryData = {
    id: `cat-${Date.now()}`,
    name: name.trim(),
    slug: slug || `cat-${Date.now()}`,
    description: description.trim() || "Specialized engineering track on Aibo8.",
    icon: "Cpu",
    image: "/images/track-ai.jpg",
    subCategories: [],
  };
  getMem().categories.push(cat);
  return cat;
}

export function createSubCategory(categoryId: string, name: string) {
  const cat = getMem().categories.find((c) => c.id === categoryId);
  if (!cat) throw new Error("Category not found");
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const sub = {
    id: `sub-${Date.now()}`,
    name: name.trim(),
    slug: slug || `sub-${Date.now()}`,
    categoryId,
  };
  cat.subCategories.push(sub);
  return sub;
}

export async function getAllCourses(includeUnpublished = false): Promise<CourseData[]> {
  if (hasDatabase && prisma) {
    try {
      const rows = await prisma.course.findMany({
        where: includeUnpublished ? undefined : { status: "PUBLISHED" },
        include: {
          category: true,
          instructor: true,
          sections: {
            orderBy: { order: "asc" },
            include: { lessons: { orderBy: { order: "asc" } } },
          },
          reviews: { include: { user: true }, orderBy: { createdAt: "desc" } },
          _count: { select: { enrollments: true } },
        },
        orderBy: { createdAt: "desc" },
      });
      if (rows.length > 0) {
        return rows.map((c) => {
          const avg =
            c.reviews.length > 0
              ? Number((c.reviews.reduce((a, r) => a + r.rating, 0) / c.reviews.length).toFixed(1))
              : 4.8;
          return {
            id: c.id,
            title: c.title,
            slug: c.slug,
            shortDescription: c.shortDescription,
            description: c.description,
            thumbnail: c.thumbnail,
            level: c.level,
            price: c.price,
            discountPrice: c.discountPrice,
            isFree: c.isFree,
            duration: c.duration,
            hardwareTags: c.hardwareTags,
            outcomes: c.outcomes,
            requirements: c.requirements,
            status: c.status as CourseStatus,
            featured: c.featured,
            categorySlug: c.category.slug,
            categoryName: c.category.name,
            subCategorySlug: c.category.slug,
            subCategoryName: c.category.name,
            instructorId: c.instructorId,
            instructorName: c.instructor.name,
            instructorTitle: "Aibo8 Lead Instructor",
            instructorBio: c.instructor.bio || "",
            rating: avg,
            reviewsCount: c.reviews.length,
            studentsCount: c._count.enrollments,
            sections: c.sections.map((s) => ({
              id: s.id,
              title: s.title,
              order: s.order,
              lessons: s.lessons.map((l) => ({
                id: l.id,
                title: l.title,
                type: l.type as LessonType,
                duration: l.duration,
                order: l.order,
                isPreview: l.isPreview,
                videoUrl: l.videoUrl,
                content: l.content,
                codeSnippet: l.codeSnippet,
                codeLang: l.codeLang,
                quizData: (l.quizData as unknown as QuizQuestion[]) || null,
              })),
            })),
            reviews: c.reviews.map((r) => ({
              id: r.id,
              rating: r.rating,
              comment: r.comment,
              userId: r.userId,
              userName: r.user.name,
              createdAt: r.createdAt.toISOString().slice(0, 10),
            })),
          };
        });
      }
    } catch {
      // Fallback to in-memory seed
    }
  }
  const mem = getMem();
  return includeUnpublished ? mem.courses : mem.courses.filter((c) => c.status === "PUBLISHED");
}

export async function getCourseBySlug(slug: string): Promise<CourseData | null> {
  const all = await getAllCourses(true);
  return all.find((c) => c.slug === slug) ?? null;
}

export async function authenticateUser(email: string, password: string): Promise<UserSession | null> {
  const normalized = email.trim().toLowerCase();
  if (hasDatabase && prisma) {
    try {
      const u = await prisma.user.findUnique({ where: { email: normalized } });
      if (u && (await bcrypt.compare(password, u.passwordHash))) {
        return { id: u.id, name: u.name, email: u.email, role: u.role as Role, bio: u.bio };
      }
    } catch {
      // fallback
    }
  }
  const mem = getMem();
  const found = mem.users.find((u) => u.email.toLowerCase() === normalized);
  if (!found) return null;
  const ok = found.passwordPlain === password || bcrypt.compareSync(password, found.passwordHash);
  if (!ok) return null;
  return { id: found.id, name: found.name, email: found.email, role: found.role, bio: found.bio };
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
  role: Role = "STUDENT"
): Promise<UserSession> {
  const normalized = email.trim().toLowerCase();
  const passwordHash = await bcrypt.hash(password, 10);

  if (hasDatabase && prisma) {
    try {
      const created = await prisma.user.create({
        data: { name, email: normalized, passwordHash, role },
      });
      return { id: created.id, name: created.name, email: created.email, role: created.role as Role };
    } catch (e: unknown) {
      if (typeof e === "object" && e !== null && "code" in e && (e as { code: string }).code === "P2002") {
        throw new Error("An account with this email already exists.");
      }
    }
  }

  const mem = getMem();
  if (mem.users.some((u) => u.email.toLowerCase() === normalized)) {
    throw new Error("An account with this email already exists.");
  }
  const newUser = {
    id: `user-${Date.now()}`,
    name,
    email: normalized,
    passwordPlain: password,
    passwordHash,
    role,
    bio: "Aibo8 Learner",
  };
  mem.users.push(newUser);
  return { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role };
}

export async function getUserEnrollments(userId: string): Promise<EnrollmentData[]> {
  if (hasDatabase && prisma) {
    try {
      const rows = await prisma.enrollment.findMany({ where: { userId } });
      return rows.map((e) => ({
        id: e.id,
        userId: e.userId,
        courseId: e.courseId,
        completedLessons: e.completedLessons,
        quizScores: (e.quizScores as unknown as EnrollmentData["quizScores"]) || {},
        progress: e.progress,
        enrolledAt: e.enrolledAt.toISOString(),
      }));
    } catch {
      // fallback
    }
  }
  return getMem().enrollments.filter((e) => e.userId === userId);
}

export function getAllEnrollmentsForAdmin() {
  const mem = getMem();
  return mem.enrollments.map((e) => {
    const u = mem.users.find((x) => x.id === e.userId);
    const c = mem.courses.find((x) => x.id === e.courseId);
    return {
      ...e,
      userName: u?.name || "Student",
      userEmail: u?.email || "",
      courseTitle: c?.title || "Course",
    };
  });
}

export async function enrollInCourse(userId: string, courseId: string): Promise<EnrollmentData> {
  const mem = getMem();
  const existing = mem.enrollments.find((e) => e.userId === userId && e.courseId === courseId);
  if (existing) return existing;
  const created: EnrollmentData = {
    id: `enr-${Date.now()}`,
    userId,
    courseId,
    completedLessons: [],
    quizScores: {},
    progress: 0,
    enrolledAt: new Date().toISOString(),
  };
  mem.enrollments.push(created);
  const course = mem.courses.find((c) => c.id === courseId);
  if (course) course.studentsCount += 1;
  return created;
}

export async function updateLessonProgress(
  userId: string,
  courseId: string,
  lessonId: string,
  completed: boolean,
  quizScore?: { score: number; total: number; passed?: boolean; percent?: number }
): Promise<{ enrollment: EnrollmentData; certificate?: CertificateData; examsPassed: boolean }> {
  const allCourses = await getAllCourses(true);
  const course = allCourses.find((c) => c.id === courseId);
  const allLessons = course ? course.sections.flatMap((s) => s.lessons) : [];
  const totalLessons = allLessons.length || 1;

  const mem = getMem();
  let enr = mem.enrollments.find((e) => e.userId === userId && e.courseId === courseId);
  if (!enr) {
    enr = await enrollInCourse(userId, courseId);
  }

  const set = new Set(enr.completedLessons);
  if (completed) set.add(lessonId);
  else set.delete(lessonId);
  enr.completedLessons = Array.from(set);
  if (quizScore) {
    const prevAttempts = enr.quizScores[lessonId]?.attempts || 0;
    const pct = quizScore.percent ?? Math.round((quizScore.score / Math.max(1, quizScore.total)) * 100);
    enr.quizScores = {
      ...enr.quizScores,
      [lessonId]: {
        score: quizScore.score,
        total: quizScore.total,
        percent: pct,
        passed: quizScore.passed ?? pct >= 60,
        attempts: prevAttempts + 1,
      },
    };
  }
  enr.progress = Math.min(100, Math.round((enr.completedLessons.length / Math.max(1, totalLessons)) * 100));

  // Mandatory Passing Score Gate: every QUIZ in the course must be passed to unlock certificate
  const quizLessons = allLessons.filter((l) => l.type === "QUIZ");
  const examsPassed = quizLessons.every((ql) => enr!.quizScores[ql.id]?.passed === true);

  let certificate: CertificateData | undefined;
  if (enr.progress >= 100 && examsPassed && course) {
    const existingCert = mem.certificates.find((c) => c.userId === userId && c.courseId === courseId);
    if (existingCert) {
      certificate = existingCert;
    } else {
      const userObj = mem.users.find((u) => u.id === userId);
      certificate = {
        id: `cert-${Date.now()}`,
        verifyCode: `AIBO8-${course.categorySlug.toUpperCase().slice(0, 3)}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
        userId,
        userName: userObj?.name || "Aibo8 Scholar",
        courseId,
        courseTitle: course.title,
        instructorName: course.instructorName,
        issuedAt: new Date().toISOString(),
      };
      mem.certificates.push(certificate);
    }
  }

  return { enrollment: enr, certificate, examsPassed };
}

export async function getLessonNotes(userId: string, lessonId: string): Promise<NoteData[]> {
  return getMem().notes.filter((n) => n.userId === userId && n.lessonId === lessonId);
}

export async function addLessonNote(userId: string, lessonId: string, content: string): Promise<NoteData> {
  const note: NoteData = {
    id: `note-${Date.now()}`,
    userId,
    lessonId,
    content,
    createdAt: new Date().toISOString(),
  };
  getMem().notes.unshift(note);
  return note;
}

export async function getUserCertificates(userId: string): Promise<CertificateData[]> {
  return getMem().certificates.filter((c) => c.userId === userId);
}

export async function getCertificateById(idOrCode: string): Promise<CertificateData | null> {
  return (
    getMem().certificates.find((c) => c.id === idOrCode || c.verifyCode === idOrCode) ?? null
  );
}

export async function createCourseInStore(input: {
  title: string;
  shortDescription: string;
  description: string;
  categorySlug: string;
  subCategorySlug?: string;
  level: string;
  isFree: boolean;
  price: number;
  discountPrice?: number | null;
  hardwareTags: string[];
  instructor: UserSession;
  sectionTitle?: string;
  lessonTitle?: string;
  lessonVideoUrl?: string;
}): Promise<CourseData> {
  const cats = getMem().categories;
  const cat = cats.find((c) => c.slug === input.categorySlug) || cats[0];
  const sub =
    cat.subCategories.find((s) => s.slug === input.subCategorySlug) ||
    cat.subCategories[0] || { slug: cat.slug, name: cat.name };

  const slug =
    input.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") +
    "-" +
    Math.random().toString(36).slice(2, 5);

  const isFree = input.isFree || input.price <= 0;
  const course: CourseData = {
    id: `course-${Date.now()}`,
    title: input.title,
    slug,
    shortDescription: input.shortDescription,
    description: input.description,
    thumbnail: cat.image,
    level: input.level,
    price: isFree ? 0 : input.price,
    discountPrice: isFree ? null : input.discountPrice || null,
    isFree,
    duration: "4h 30m",
    hardwareTags: input.hardwareTags.length > 0 ? input.hardwareTags : ["AI", "Robotics"],
    outcomes: [
      "Build hands-on AI/Robotics prototypes from scratch",
      "Deploy production-ready code to real hardware",
    ],
    requirements: ["Curiosity and basic computer skills"],
    // All newly created courses require explicit Admin approval before going live
    status: "PENDING",
    featured: false,
    categorySlug: cat.slug,
    categoryName: cat.name,
    subCategorySlug: sub.slug,
    subCategoryName: sub.name,
    instructorId: input.instructor.id,
    instructorName: input.instructor.name,
    instructorTitle: input.instructor.role === "ADMIN" ? "Aibo8 Chief Architect" : "Aibo8 Instructor",
    instructorBio: input.instructor.bio || "Robotics & AI Educator on Aibo8.",
    rating: 5.0,
    reviewsCount: 0,
    studentsCount: 0,
    sections: [
      {
        id: `sec-${Date.now()}`,
        title: input.sectionTitle || "Module 1: Getting Started",
        order: 1,
        lessons: [
          {
            id: `les-${Date.now()}`,
            title: input.lessonTitle || "Introduction & Hardware Setup",
            type: input.lessonVideoUrl ? "VIDEO" : "ARTICLE",
            duration: "10:00",
            order: 1,
            isPreview: true,
            videoUrl: input.lessonVideoUrl || null,
            content: input.description,
          },
        ],
      },
    ],
    reviews: [],
  };
  getMem().courses.unshift(course);
  return course;
}

export function addSectionToCourse(courseId: string, title: string) {
  const course = getMem().courses.find((c) => c.id === courseId);
  if (!course) throw new Error("Course not found");
  const sec = {
    id: `sec-${Date.now()}`,
    title: title.trim(),
    order: course.sections.length + 1,
    lessons: [],
  };
  course.sections.push(sec);
  return sec;
}

export function addLessonToSection(
  courseId: string,
  sectionId: string,
  lessonInput: Omit<LessonData, "id" | "order">
) {
  const course = getMem().courses.find((c) => c.id === courseId);
  if (!course) throw new Error("Course not found");
  const section = course.sections.find((s) => s.id === sectionId) || course.sections[0];
  if (!section) throw new Error("Section not found");
  const lesson: LessonData = {
    ...lessonInput,
    id: `les-${Date.now()}`,
    order: section.lessons.length + 1,
  };
  section.lessons.push(lesson);
  return lesson;
}

export async function updateCourseStatus(courseId: string, status: CourseStatus): Promise<CourseData | null> {
  const course = getMem().courses.find((c) => c.id === courseId);
  if (!course) return null;
  course.status = status;
  return course;
}

export async function updateCourseInStore(
  courseId: string,
  updates: {
    title?: string;
    shortDescription?: string;
    description?: string;
    categorySlug?: string;
    subCategorySlug?: string;
    level?: string;
    duration?: string;
    isFree?: boolean;
    price?: number;
    discountPrice?: number | null;
    hardwareTags?: string[];
    outcomes?: string[];
    requirements?: string[];
    status?: CourseStatus;
  }
): Promise<CourseData | null> {
  const mem = getMem();
  const course = mem.courses.find((c) => c.id === courseId);
  if (!course) return null;

  if (updates.title !== undefined) course.title = updates.title.trim();
  if (updates.shortDescription !== undefined) course.shortDescription = updates.shortDescription.trim();
  if (updates.description !== undefined) course.description = updates.description.trim();
  if (updates.level !== undefined) course.level = updates.level;
  if (updates.duration !== undefined) course.duration = updates.duration;
  if (updates.hardwareTags !== undefined) course.hardwareTags = updates.hardwareTags;
  if (updates.outcomes !== undefined) course.outcomes = updates.outcomes;
  if (updates.requirements !== undefined) course.requirements = updates.requirements;
  if (updates.status !== undefined) course.status = updates.status;

  if (updates.categorySlug !== undefined) {
    const cat = mem.categories.find((c) => c.slug === updates.categorySlug);
    if (cat) {
      course.categorySlug = cat.slug;
      course.categoryName = cat.name;
      course.thumbnail = cat.image;
      const sub =
        cat.subCategories.find((s) => s.slug === updates.subCategorySlug) ||
        cat.subCategories[0];
      if (sub) {
        course.subCategorySlug = sub.slug;
        course.subCategoryName = sub.name;
      }
    }
  } else if (updates.subCategorySlug !== undefined) {
    const cat = mem.categories.find((c) => c.slug === course.categorySlug);
    const sub = cat?.subCategories.find((s) => s.slug === updates.subCategorySlug);
    if (sub) {
      course.subCategorySlug = sub.slug;
      course.subCategoryName = sub.name;
    }
  }

  if (updates.isFree !== undefined) {
    course.isFree = updates.isFree;
    if (updates.isFree) {
      course.price = 0;
      course.discountPrice = null;
    }
  }
  if (!course.isFree) {
    if (updates.price !== undefined) course.price = Math.max(0, Number(updates.price) || 0);
    if (updates.discountPrice !== undefined) {
      course.discountPrice = updates.discountPrice ? Number(updates.discountPrice) : null;
    }
  }

  return course;
}

export function deleteCourseFromStore(courseId: string): boolean {
  const mem = getMem();
  const idx = mem.courses.findIndex((c) => c.id === courseId);
  if (idx === -1) return false;
  mem.courses.splice(idx, 1);
  return true;
}

export function deleteSectionFromCourse(courseId: string, sectionId: string) {
  const course = getMem().courses.find((c) => c.id === courseId);
  if (!course) return false;
  course.sections = course.sections.filter((s) => s.id !== sectionId);
  return true;
}

export function deleteLessonFromSection(courseId: string, sectionId: string, lessonId: string) {
  const course = getMem().courses.find((c) => c.id === courseId);
  if (!course) return false;
  const sec = course.sections.find((s) => s.id === sectionId);
  if (!sec) return false;
  sec.lessons = sec.lessons.filter((l) => l.id !== lessonId);
  return true;
}

export async function addCourseReview(courseId: string, user: UserSession, rating: number, comment: string) {
  const course = getMem().courses.find((c) => c.id === courseId);
  if (!course) return null;
  const review = {
    id: `rev-${Date.now()}`,
    rating,
    comment,
    userId: user.id,
    userName: user.name,
    createdAt: new Date().toISOString().slice(0, 10),
  };
  course.reviews.unshift(review);
  course.reviewsCount = course.reviews.length;
  course.rating = Number(
    (course.reviews.reduce((acc, r) => acc + r.rating, 0) / course.reviews.length).toFixed(1)
  );
  return review;
}

export function getCoupons(): CouponData[] {
  return getMem().coupons;
}

export function addCoupon(code: string, discountPercent: number): CouponData {
  const coupon: CouponData = {
    id: `coup-${Date.now()}`,
    code: code.trim().toUpperCase(),
    discountPercent,
    active: true,
  };
  getMem().coupons.unshift(coupon);
  return coupon;
}

export function getAllUsersForAdmin() {
  return getMem().users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
  }));
}

export function updateUserRole(userId: string, role: Role) {
  const u = getMem().users.find((x) => x.id === userId);
  if (u) u.role = role;
  return u;
}

export function getPlatformStats() {
  const mem = getMem();
  const totalStudents = mem.courses.reduce((a, c) => a + c.studentsCount, 0);
  const totalRevenue = mem.courses.reduce(
    (a, c) => a + (c.isFree ? 0 : (c.discountPrice ?? c.price) * Math.min(c.studentsCount, 40)),
    0
  );
  const totalQuizzes = mem.courses.reduce(
    (a, c) =>
      a + c.sections.reduce((sa, s) => sa + s.lessons.filter((l) => l.type === "QUIZ").length, 0),
    0
  );
  return {
    totalCourses: mem.courses.length,
    publishedCourses: mem.courses.filter((c) => c.status === "PUBLISHED").length,
    pendingCourses: mem.courses.filter((c) => c.status === "PENDING").length,
    totalUsers: mem.users.length,
    totalStudents,
    totalRevenue,
    totalQuizzes,
    totalCategories: mem.categories.length,
    totalSubCategories: mem.categories.reduce((a, c) => a + c.subCategories.length, 0),
    activeCoupons: mem.coupons.filter((c) => c.active).length,
    databaseMode: hasDatabase ? "PostgreSQL (Prisma)" : "Zero-Config Demo Store (Ready for Postgres)",
  };
}
