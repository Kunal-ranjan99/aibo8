export type Role = "STUDENT" | "INSTRUCTOR" | "ADMIN";
export type CourseStatus = "DRAFT" | "PENDING" | "PUBLISHED";
export type LessonType = "VIDEO" | "ARTICLE" | "CODE_LAB" | "QUIZ";
export type AgeGroup = "Kids (8–12)" | "School (13–17)" | "College (18+)" | "All Ages";

export interface SubCategoryData {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
}

export interface CategoryData {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  subCategories: SubCategoryData[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LessonData {
  id: string;
  title: string;
  type: LessonType;
  duration: string;
  order: number;
  isPreview?: boolean;
  videoUrl?: string | null;
  content?: string | null;
  codeSnippet?: string | null;
  codeLang?: string | null;
  quizData?: QuizQuestion[] | null;
  passingScore?: number;
  timeLimitMinutes?: number;
  maxAttempts?: number;
}

export interface SectionData {
  id: string;
  title: string;
  order: number;
  lessons: LessonData[];
}

export interface ReviewData {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  userName: string;
  userAvatar?: string | null;
  createdAt: string;
}

export interface CourseData {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  thumbnail: string;
  introVideoUrl?: string | null;
  level: "Beginner" | "Intermediate" | "Advanced" | string;
  ageGroup?: AgeGroup;
  price: number;
  discountPrice?: number | null;
  isFree: boolean;
  duration: string;
  hardwareTags: string[];
  outcomes: string[];
  requirements: string[];
  status: CourseStatus;
  featured: boolean;
  categorySlug: string;
  categoryName: string;
  subCategorySlug: string;
  subCategoryName: string;
  instructorId: string;
  instructorName: string;
  instructorTitle: string;
  instructorBio: string;
  rating: number;
  reviewsCount: number;
  studentsCount: number;
  sections: SectionData[];
  reviews: ReviewData[];
}

export interface BundleData {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  ageGroup: AgeGroup;
  courseIds: string[];
  bundlePrice: number;
  regularTotal: number;
  badge: string;
  thumbnail: string;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: Role;
  bio?: string | null;
}

export interface QuizAttemptRecord {
  score: number;
  total: number;
  percent: number;
  passed: boolean;
  attempts: number;
}

export interface EnrollmentData {
  id: string;
  userId: string;
  courseId: string;
  completedLessons: string[];
  quizScores: Record<string, QuizAttemptRecord>;
  progress: number;
  enrolledAt: string;
}

export interface NoteData {
  id: string;
  userId: string;
  lessonId: string;
  content: string;
  createdAt: string;
}

export interface CertificateData {
  id: string;
  verifyCode: string;
  userId: string;
  userName: string;
  courseId: string;
  courseTitle: string;
  instructorName: string;
  issuedAt: string;
}

export interface CouponData {
  id: string;
  code: string;
  discountType: "PERCENT" | "FLAT";
  discountValue: number;
  discountPercent: number;
  active: boolean;
  expiresAt?: string | null;
}

export interface PaymentGatewaySettings {
  activeGateway: "RAZORPAY" | "PHONEPE";
  currency: "INR";
  currencySymbol: "₹" | "INR ";
  adminCommissionPercent: number;
  razorpay: {
    enabled: boolean;
    mode: "test" | "live";
    keyId: string;
    keySecret: string;
  };
  phonepe: {
    enabled: boolean;
    mode: "sandbox" | "production";
    merchantId: string;
    saltKey: string;
    saltIndex: string;
  };
}

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  itemType: "COURSE" | "BUNDLE";
  itemId: string;
  itemTitle: string;
  instructorId: string;
  gateway: "RAZORPAY" | "PHONEPE" | "FREE" | "DEMO";
  transactionId: string;
  subtotal: number;
  discount: number;
  taxAmount: number;
  totalPaid: number;
  adminShare: number;
  instructorShare: number;
  currencySymbol: string;
  createdAt: string;
}

export interface PayoutRequestData {
  id: string;
  instructorId: string;
  instructorName: string;
  amount: number;
  method: string;
  accountDetails: string;
  status: "PENDING" | "PAID" | "REJECTED";
  createdAt: string;
  paidAt?: string;
}

export interface MessageData {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: Role;
  receiverId: string;
  receiverName: string;
  body: string;
  createdAt: string;
}

export interface LessonQuestionData {
  id: string;
  lessonId: string;
  courseId: string;
  userId: string;
  userName: string;
  userRole: Role;
  question: string;
  replies: {
    id: string;
    userName: string;
    userRole: Role;
    body: string;
    createdAt: string;
  }[];
  createdAt: string;
}

export interface AssignmentSubmissionData {
  id: string;
  courseId: string;
  courseTitle: string;
  userId: string;
  userName: string;
  projectTitle: string;
  repoUrl: string;
  schematicUrl: string;
  notes: string;
  status: "SUBMITTED" | "GRADED";
  grade?: number;
  feedback?: string;
  submittedAt: string;
}
