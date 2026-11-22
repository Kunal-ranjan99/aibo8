import {
  DEFAULT_PAYMENT_SETTINGS,
  SEED_ASSIGNMENTS,
  SEED_BUNDLES,
  SEED_INVOICES,
  SEED_LESSON_QA,
  SEED_MESSAGES,
  SEED_PAYOUTS,
} from "./extra-seed";
import {
  AssignmentSubmissionData,
  BundleData,
  InvoiceData,
  LessonQuestionData,
  MessageData,
  PaymentGatewaySettings,
  PayoutRequestData,
  Role,
  UserSession,
} from "./types";

interface ExtrasMemory {
  paymentSettings: PaymentGatewaySettings;
  bundles: BundleData[];
  invoices: InvoiceData[];
  payouts: PayoutRequestData[];
  messages: MessageData[];
  lessonQa: LessonQuestionData[];
  assignments: AssignmentSubmissionData[];
  wishlists: Record<string, string[]>;
}

const g = globalThis as unknown as { aibo8Extras?: ExtrasMemory };

function getExtras(): ExtrasMemory {
  if (!g.aibo8Extras) {
    g.aibo8Extras = {
      paymentSettings: structuredClone(DEFAULT_PAYMENT_SETTINGS),
      bundles: structuredClone(SEED_BUNDLES),
      invoices: structuredClone(SEED_INVOICES),
      payouts: structuredClone(SEED_PAYOUTS),
      messages: structuredClone(SEED_MESSAGES),
      lessonQa: structuredClone(SEED_LESSON_QA),
      assignments: structuredClone(SEED_ASSIGNMENTS),
      wishlists: {
        "user-student-1": ["course-3", "course-5"],
      },
    };
  }
  return g.aibo8Extras;
}

/* PAYMENT SETTINGS (Razorpay / PhonePe / Commission) */
export function getPaymentSettings(): PaymentGatewaySettings {
  return getExtras().paymentSettings;
}

export function updatePaymentSettings(patch: Partial<PaymentGatewaySettings>) {
  const cur = getExtras().paymentSettings;
  getExtras().paymentSettings = {
    ...cur,
    ...patch,
    razorpay: { ...cur.razorpay, ...(patch.razorpay || {}) },
    phonepe: { ...cur.phonepe, ...(patch.phonepe || {}) },
  };
  return getExtras().paymentSettings;
}

/* BUNDLES */
export function getBundles(): BundleData[] {
  return getExtras().bundles;
}

export function getBundleById(id: string): BundleData | undefined {
  return getExtras().bundles.find((b) => b.id === id || b.slug === id);
}

/* INVOICES & SALES */
export function createInvoice(input: {
  user: UserSession;
  itemType: "COURSE" | "BUNDLE";
  itemId: string;
  itemTitle: string;
  instructorId: string;
  gateway: "RAZORPAY" | "PHONEPE" | "FREE" | "DEMO";
  subtotal: number;
  discount: number;
}): InvoiceData {
  const settings = getPaymentSettings();
  const netBeforeTax = Math.max(0, input.subtotal - input.discount);
  const taxAmount = netBeforeTax > 0 ? Number((netBeforeTax * 0.18).toFixed(2)) : 0;
  const totalPaid = Number((netBeforeTax + taxAmount).toFixed(2));
  const adminPct = settings.adminCommissionPercent / 100;
  const adminShare = Number((netBeforeTax * adminPct).toFixed(2));
  const instructorShare = Number((netBeforeTax - adminShare).toFixed(2));

  const inv: InvoiceData = {
    id: `inv-${Date.now()}`,
    invoiceNumber: `AIBO8-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    userId: input.user.id,
    userName: input.user.name,
    userEmail: input.user.email,
    itemType: input.itemType,
    itemId: input.itemId,
    itemTitle: input.itemTitle,
    instructorId: input.instructorId,
    gateway: input.gateway,
    transactionId:
      input.gateway === "RAZORPAY"
        ? `pay_Rzp${Math.random().toString(36).slice(2, 10).toUpperCase()}`
        : input.gateway === "PHONEPE"
        ? `T${Date.now()}PPE`
        : `FREE-${Date.now()}`,
    subtotal: input.subtotal,
    discount: input.discount,
    taxAmount,
    totalPaid,
    adminShare,
    instructorShare,
    currencySymbol: settings.currencySymbol || "₹",
    createdAt: new Date().toISOString(),
  };

  getExtras().invoices.unshift(inv);
  return inv;
}

export function getInvoiceById(id: string): InvoiceData | null {
  return getExtras().invoices.find((i) => i.id === id || i.invoiceNumber === id) ?? null;
}

export function getUserInvoices(userId: string): InvoiceData[] {
  return getExtras().invoices.filter((i) => i.userId === userId);
}

export function getAllInvoices(): InvoiceData[] {
  return getExtras().invoices;
}

export function getInstructorSales(instructorId: string): InvoiceData[] {
  return getExtras().invoices.filter((i) => i.instructorId === instructorId && i.totalPaid > 0);
}

/* PAYOUTS */
export function getAllPayouts(): PayoutRequestData[] {
  return getExtras().payouts;
}

export function getInstructorPayouts(instructorId: string): PayoutRequestData[] {
  return getExtras().payouts.filter((p) => p.instructorId === instructorId);
}

export function requestInstructorPayout(
  instructor: UserSession,
  amount: number,
  method: string,
  accountDetails: string
): PayoutRequestData {
  const req: PayoutRequestData = {
    id: `pay-${Date.now()}`,
    instructorId: instructor.id,
    instructorName: instructor.name,
    amount,
    method: method || "UPI / Bank Transfer",
    accountDetails,
    status: "PENDING",
    createdAt: new Date().toISOString(),
  };
  getExtras().payouts.unshift(req);
  return req;
}

export function updatePayoutStatus(payoutId: string, status: "PAID" | "REJECTED") {
  const p = getExtras().payouts.find((x) => x.id === payoutId);
  if (!p) return null;
  p.status = status;
  if (status === "PAID") p.paidAt = new Date().toISOString();
  return p;
}

/* MESSAGES */
export function getUserMessages(userId: string): MessageData[] {
  return getExtras().messages.filter((m) => m.senderId === userId || m.receiverId === userId);
}

export function sendMessageInStore(input: {
  sender: UserSession;
  receiverId: string;
  receiverName: string;
  body: string;
}): MessageData {
  const msg: MessageData = {
    id: `msg-${Date.now()}`,
    senderId: input.sender.id,
    senderName: input.sender.name,
    senderRole: input.sender.role,
    receiverId: input.receiverId,
    receiverName: input.receiverName,
    body: input.body.trim(),
    createdAt: new Date().toISOString(),
  };
  getExtras().messages.push(msg);
  return msg;
}

/* LESSON Q&A */
export function getLessonQuestions(lessonId: string): LessonQuestionData[] {
  return getExtras().lessonQa.filter((q) => q.lessonId === lessonId);
}

export function addLessonQuestion(
  user: UserSession,
  courseId: string,
  lessonId: string,
  question: string
): LessonQuestionData {
  const q: LessonQuestionData = {
    id: `qa-${Date.now()}`,
    lessonId,
    courseId,
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    question: question.trim(),
    replies: [],
    createdAt: new Date().toISOString(),
  };
  getExtras().lessonQa.unshift(q);
  return q;
}

export function replyToLessonQuestion(questionId: string, user: UserSession, body: string) {
  const q = getExtras().lessonQa.find((x) => x.id === questionId);
  if (!q) return null;
  const reply = {
    id: `rep-${Date.now()}`,
    userName: user.name,
    userRole: user.role as Role,
    body: body.trim(),
    createdAt: new Date().toISOString(),
  };
  q.replies.push(reply);
  return reply;
}

/* ASSIGNMENTS */
export function getCourseAssignments(courseId: string, userId?: string): AssignmentSubmissionData[] {
  return getExtras().assignments.filter(
    (a) => a.courseId === courseId && (!userId || a.userId === userId)
  );
}

export function getAllAssignments(): AssignmentSubmissionData[] {
  return getExtras().assignments;
}

export function submitAssignment(input: {
  user: UserSession;
  courseId: string;
  courseTitle: string;
  projectTitle: string;
  repoUrl: string;
  schematicUrl: string;
  notes: string;
}): AssignmentSubmissionData {
  const sub: AssignmentSubmissionData = {
    id: `asgn-${Date.now()}`,
    courseId: input.courseId,
    courseTitle: input.courseTitle,
    userId: input.user.id,
    userName: input.user.name,
    projectTitle: input.projectTitle.trim(),
    repoUrl: input.repoUrl.trim(),
    schematicUrl: input.schematicUrl.trim(),
    notes: input.notes.trim(),
    status: "SUBMITTED",
    submittedAt: new Date().toISOString(),
  };
  getExtras().assignments.unshift(sub);
  return sub;
}

export function gradeAssignment(id: string, grade: number, feedback: string) {
  const a = getExtras().assignments.find((x) => x.id === id);
  if (!a) return null;
  a.grade = Math.max(0, Math.min(100, grade));
  a.feedback = feedback.trim();
  a.status = "GRADED";
  return a;
}

/* WISHLIST */
export function getUserWishlist(userId: string): string[] {
  return getExtras().wishlists[userId] || [];
}

export function toggleUserWishlist(userId: string, courseId: string): string[] {
  const cur = new Set(getExtras().wishlists[userId] || []);
  if (cur.has(courseId)) cur.delete(courseId);
  else cur.add(courseId);
  const next = Array.from(cur);
  getExtras().wishlists[userId] = next;
  return next;
}
