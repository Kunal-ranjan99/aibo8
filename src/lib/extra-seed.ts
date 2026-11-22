import {
  AssignmentSubmissionData,
  BundleData,
  InvoiceData,
  LessonQuestionData,
  MessageData,
  PaymentGatewaySettings,
  PayoutRequestData,
} from "./types";

export const DEFAULT_PAYMENT_SETTINGS: PaymentGatewaySettings = {
  currency: "INR",
  currencySymbol: "₹",
  adminCommissionPercent: 20,
  razorpay: {
    enabled: true,
    mode: "test",
    keyId: "rzp_test_aibo8demo001",
    keySecret: "",
  },
  phonepe: {
    enabled: true,
    mode: "sandbox",
    merchantId: "AIBO8SANDBOX",
    saltKey: "",
    saltIndex: "1",
  },
};

export const SEED_BUNDLES: BundleData[] = [
  {
    id: "bundle-junior",
    title: "School Innovator Kit: ESP32 IoT + TinyML Starter Pack",
    slug: "school-innovator-iot-tinyml-bundle",
    tagline: "Perfect for school students (Grades 6–12) building their first smart gadgets & voice AI!",
    ageGroup: "School (13–17)",
    courseIds: ["course-2", "course-4", "course-6"],
    bundlePrice: 999,
    regularTotal: 1999,
    badge: "Best for School",
    thumbnail: "/images/track-iot.jpg",
  },
  {
    id: "bundle-college",
    title: "College Robotics & Edge AI Career Track (3-Course Bundle)",
    slug: "college-robotics-edge-ai-bundle",
    tagline: "Master ROS2 LiDAR SLAM, NVIDIA Jetson Computer Vision & 6-DOF Robotic Arms for placements & capstones.",
    ageGroup: "College (18+)",
    courseIds: ["course-1", "course-3", "course-5"],
    bundlePrice: 3499,
    regularTotal: 6999,
    badge: "Save 50% • College Pro",
    thumbnail: "/images/track-robotics.jpg",
  },
];

export const SEED_INVOICES: InvoiceData[] = [
  {
    id: "inv-1001",
    invoiceNumber: "AIBO8-2026-1001",
    userId: "user-student-1",
    userName: "Maya Lin",
    userEmail: "student@aibo8.ai",
    itemType: "COURSE",
    itemId: "course-1",
    itemTitle: "Autonomous Robotics with ROS2 & LiDAR SLAM",
    instructorId: "user-inst-1",
    gateway: "RAZORPAY",
    transactionId: "pay_RzpDemo92841",
    subtotal: 1999,
    discount: 0,
    taxAmount: 359.82,
    totalPaid: 2358.82,
    adminShare: 399.8,
    instructorShare: 1599.2,
    currencySymbol: "₹",
    createdAt: "2026-11-10T10:00:00.000Z",
  },
];

export const SEED_PAYOUTS: PayoutRequestData[] = [
  {
    id: "pay-1",
    instructorId: "user-inst-1",
    instructorName: "Dr. Elena Vance",
    amount: 14500,
    method: "UPI / Bank Transfer",
    accountDetails: "elena.robotics@okicici",
    status: "PAID",
    createdAt: "2026-11-02T09:00:00.000Z",
    paidAt: "2026-11-03T14:00:00.000Z",
  },
  {
    id: "pay-2",
    instructorId: "user-inst-2",
    instructorName: "Kiran Deshmukh",
    amount: 6800,
    method: "Bank IMPS",
    accountDetails: "HDFC **** 4821",
    status: "PENDING",
    createdAt: "2026-11-19T11:30:00.000Z",
  },
];

export const SEED_MESSAGES: MessageData[] = [
  {
    id: "msg-1",
    senderId: "user-student-1",
    senderName: "Maya Lin",
    senderRole: "STUDENT",
    receiverId: "user-inst-1",
    receiverName: "Dr. Elena Vance",
    body: "Hi Dr. Elena! Which affordable 2D LiDAR works best for my college mini-rover project?",
    createdAt: "2026-11-18T14:20:00.000Z",
  },
  {
    id: "msg-2",
    senderId: "user-inst-1",
    senderName: "Dr. Elena Vance",
    senderRole: "INSTRUCTOR",
    receiverId: "user-student-1",
    receiverName: "Maya Lin",
    body: "Hi Maya! The RPLIDAR A1M8 or YDLIDAR X2 both plug directly into Raspberry Pi 5 via USB and work out-of-the-box with our ROS2 Humble launch files.",
    createdAt: "2026-11-18T14:45:00.000Z",
  },
];

export const SEED_LESSON_QA: LessonQuestionData[] = [
  {
    id: "qa-1",
    lessonId: "les-1-2",
    courseId: "course-1",
    userId: "user-student-1",
    userName: "Maya Lin",
    userRole: "STUDENT",
    question: "Should /cmd_vel publish at 10Hz or 20Hz on a physical Raspberry Pi rover?",
    replies: [
      {
        id: "rep-1",
        userName: "Dr. Elena Vance",
        userRole: "INSTRUCTOR",
        body: "10Hz is plenty for indoor differential-drive rovers and keeps CPU usage low!",
        createdAt: "2026-11-12T10:15:00.000Z",
      },
    ],
    createdAt: "2026-11-12T09:50:00.000Z",
  },
];

export const SEED_ASSIGNMENTS: AssignmentSubmissionData[] = [
  {
    id: "asgn-1",
    courseId: "course-1",
    courseTitle: "Autonomous Robotics with ROS2 & LiDAR SLAM",
    userId: "user-student-1",
    userName: "Maya Lin",
    projectTitle: "2D Hallway SLAM Map on Gazebo Rover",
    repoUrl: "https://github.com/mayalin/aibo8-ros2-rover",
    schematicUrl: "https://wokwi.com/projects/demo-rover-wiring",
    notes: "Tuned SLAM Toolbox loop closure and ran a 4-waypoint autonomous Nav2 patrol!",
    status: "GRADED",
    grade: 96,
    feedback: "Outstanding TF2 calibration and clean launch file structure! Ready for real hardware.",
    submittedAt: "2026-11-14T16:00:00.000Z",
  },
];
