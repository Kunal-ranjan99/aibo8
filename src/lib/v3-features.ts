export interface HardwareBomItem {
  name: string;
  qty: string;
  estPriceInr: number;
  note: string;
}

export interface LiveClassItem {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  hostName: string;
  platform: "Zoom" | "Google Meet" | "Jitsi";
  meetingUrl: string;
  scheduledAt: string;
  durationMin: number;
}

export interface AnnouncementItem {
  id: string;
  courseId?: string;
  title: string;
  body: string;
  author: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  body: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface InstitutionBatchItem {
  id: string;
  institutionName: string;
  batchCode: string;
  courseId: string;
  courseTitle: string;
  maxSeats: number;
  usedSeats: number;
  createdAt: string;
}

export interface StudentGamification {
  userId: string;
  name: string;
  xp: number;
  streakDays: number;
  level: string;
  badges: string[];
  referralCode: string;
  referralsCount: number;
  referralCreditsInr: number;
}

export interface SmtpSettings {
  enabled: boolean;
  host: string;
  port: number;
  username: string;
  fromEmail: string;
}

export interface KitOrderItem {
  id: string;
  userId: string;
  userName: string;
  courseId: string;
  courseTitle: string;
  totalInr: number;
  address: string;
  status: "REQUESTED" | "SHIPPED";
  createdAt: string;
}

interface V3Store {
  liveClasses: LiveClassItem[];
  announcements: AnnouncementItem[];
  notifications: NotificationItem[];
  batches: InstitutionBatchItem[];
  gamification: Record<string, StudentGamification>;
  smtp: SmtpSettings;
  kitOrders: KitOrderItem[];
  resetTokens: Record<string, { email: string; code: string; expiresAt: number }>;
}

const g = globalThis as unknown as { aibo8V3?: V3Store };

export const COURSE_HARDWARE_BOM: Record<string, HardwareBomItem[]> = {
  "course-1": [
    { name: "Raspberry Pi 5 (4GB/8GB)", qty: "1x", estPriceInr: 6500, note: "Main ROS2 onboard computer" },
    { name: "RPLIDAR A1M8 360° 2D LiDAR", qty: "1x", estPriceInr: 8900, note: "Optional — Gazebo sim included" },
    { name: "2WD Differential Chassis + L298N", qty: "1x", estPriceInr: 1450, note: "Motor driver & encoder wheels" },
    { name: "MPU6050 6-Axis IMU Sensor", qty: "1x", estPriceInr: 220, note: "Odometry sensor fusion" },
  ],
  "course-2": [
    { name: "ESP32 DevKit V1 (Wi-Fi + BLE)", qty: "1x", estPriceInr: 450, note: "Core microcontroller" },
    { name: "BME280 Temp/Humidity/Pressure Sensor", qty: "1x", estPriceInr: 320, note: "I2C environmental sensor" },
    { name: "0.96\" SSD1306 OLED Display", qty: "1x", estPriceInr: 240, note: "Live telemetry screen" },
    { name: "Breadboard + Jumper Wires + LEDs", qty: "1 Set", estPriceInr: 290, note: "Solder-free prototyping kit" },
  ],
  "course-3": [
    { name: "NVIDIA Jetson Orin Nano Dev Kit", qty: "1x", estPriceInr: 24500, note: "Or use free Google Colab GPU" },
    { name: "IMX219 CSI / USB HD Camera", qty: "1x", estPriceInr: 1200, note: "60 FPS object detection feed" },
  ],
  "course-4": [
    { name: "ESP32-S3 / Arduino Nano 33 BLE Sense", qty: "1x", estPriceInr: 950, note: "Built-in mic & IMU for TinyML" },
    { name: "USB-C Data Cable", qty: "1x", estPriceInr: 180, note: "Flashing & serial monitor" },
  ],
  "course-5": [
    { name: "6-DOF Desktop Robotic Arm Kit (MG996R)", qty: "1x", estPriceInr: 4800, note: "Optional — MoveIt2 sim included" },
    { name: "PCA9685 16-Ch PWM Servo Driver", qty: "1x", estPriceInr: 350, note: "I2C multi-servo controller" },
  ],
  "course-6": [
    { name: "Heltec WiFi LoRa 32 (V3 SX1262)", qty: "2x", estPriceInr: 3600, note: "10km+ sub-GHz transceiver" },
    { name: "5V Solar Panel + LiFePO4 Battery", qty: "1 Set", estPriceInr: 850, note: "Outdoor autonomous power" },
  ],
};

function getV3(): V3Store {
  if (!g.aibo8V3) {
    g.aibo8V3 = {
      liveClasses: [
        {
          id: "live-1",
          courseId: "course-2",
          courseTitle: "ESP32 & Smart IoT Engineering: Sensors to Cloud",
          title: "Weekend Robotics Lab: Live ESP32 + MQTT Smart Home Build",
          hostName: "Kiran Deshmukh",
          platform: "Google Meet",
          meetingUrl: "https://meet.google.com/new",
          scheduledAt: "2026-11-28T11:30:00.000Z",
          durationMin: 60,
        },
        {
          id: "live-2",
          courseId: "course-1",
          courseTitle: "Autonomous Robotics with ROS2 & LiDAR SLAM",
          title: "ROS2 Humble & Gazebo Nav2 Live Doubt-Clearing Session",
          hostName: "Dr. Elena Vance",
          platform: "Zoom",
          meetingUrl: "https://zoom.us/join",
          scheduledAt: "2026-11-29T13:00:00.000Z",
          durationMin: 75,
        },
      ],
      announcements: [
        {
          id: "ann-1",
          title: "National School & College Robotics Hackathon Open!",
          body: "Submit your ESP32 or ROS2 project under the Project Assignment tab by Dec 15 to win Aibo8 Hardware Kits worth ₹25,000.",
          author: "Aarav Mehta (Admin)",
          createdAt: "2026-11-20T09:00:00.000Z",
        },
        {
          id: "ann-2",
          courseId: "course-1",
          title: "New Nav2 Costmap Tuning Sheet Uploaded",
          body: "Check Module 2 in Autonomous Robotics with ROS2 for updated Gazebo obstacle avoidance parameters.",
          author: "Dr. Elena Vance",
          createdAt: "2026-11-21T15:00:00.000Z",
        },
      ],
      notifications: [
        {
          id: "not-1",
          userId: "user-student-1",
          title: "Project Graded: 96/100!",
          body: "Dr. Elena Vance graded your 2D Hallway SLAM Map project.",
          read: false,
          link: "/learn/autonomous-robotics-ros2-lidar-slam",
          createdAt: "2026-11-21T12:00:00.000Z",
        },
        {
          id: "not-2",
          userId: "user-student-1",
          title: "Live Weekend Lab Scheduled",
          body: "Join ESP32 + MQTT Smart Home Build this Saturday!",
          read: false,
          link: "/community",
          createdAt: "2026-11-22T08:00:00.000Z",
        },
      ],
      batches: [
        {
          id: "batch-1",
          institutionName: "Delhi Public School — Robotics Club",
          batchCode: "DPS-ROBO-2026",
          courseId: "course-2",
          courseTitle: "ESP32 & Smart IoT Engineering: Sensors to Cloud",
          maxSeats: 100,
          usedSeats: 34,
          createdAt: "2026-11-05T10:00:00.000Z",
        },
        {
          id: "batch-2",
          institutionName: "NIT Engineering AI & Robotics Cell",
          batchCode: "NIT-ROS2-2026",
          courseId: "course-1",
          courseTitle: "Autonomous Robotics with ROS2 & LiDAR SLAM",
          maxSeats: 60,
          usedSeats: 22,
          createdAt: "2026-11-12T10:00:00.000Z",
        },
      ],
      gamification: {
        "user-student-1": {
          userId: "user-student-1",
          name: "Maya Lin",
          xp: 1450,
          streakDays: 7,
          level: "Level 5 • Circuit Ninja",
          badges: ["First ESP32 Lab", "Exam Ace 100%", "7-Day Streak", "Hardware Builder"],
          referralCode: "AIBO8-MAYA",
          referralsCount: 3,
          referralCreditsInr: 600,
        },
        "user-student-2": {
          userId: "user-student-2",
          name: "Rohan Verma",
          xp: 1120,
          streakDays: 4,
          level: "Level 4 • Bot Maker",
          badges: ["First ROS2 Node", "IoT Explorer"],
          referralCode: "AIBO8-ROHAN",
          referralsCount: 1,
          referralCreditsInr: 200,
        },
      },
      smtp: {
        enabled: false,
        host: "smtp.gmail.com",
        port: 587,
        username: "noreply@aibo8.ai",
        fromEmail: "Aibo8 Academy <noreply@aibo8.ai>",
      },
      kitOrders: [],
      resetTokens: {},
    };
  }
  return g.aibo8V3;
}

export function getHardwareBom(courseId: string): HardwareBomItem[] {
  return (
    COURSE_HARDWARE_BOM[courseId] || [
      { name: "ESP32 / Arduino Starter Board", qty: "1x", estPriceInr: 499, note: "Core microcontroller" },
      { name: "Sensor & Jumper Wire Pack", qty: "1 Set", estPriceInr: 399, note: "Hands-on lab kit" },
    ]
  );
}

export function getLiveClasses(courseId?: string): LiveClassItem[] {
  const all = getV3().liveClasses;
  return courseId ? all.filter((l) => l.courseId === courseId) : all;
}

export function addLiveClass(item: Omit<LiveClassItem, "id">): LiveClassItem {
  const created = { ...item, id: `live-${Date.now()}` };
  getV3().liveClasses.unshift(created);
  return created;
}

export function getAnnouncements(): AnnouncementItem[] {
  return getV3().announcements;
}

export function addAnnouncement(title: string, body: string, author: string, courseId?: string) {
  const ann: AnnouncementItem = {
    id: `ann-${Date.now()}`,
    title: title.trim(),
    body: body.trim(),
    author,
    courseId,
    createdAt: new Date().toISOString(),
  };
  getV3().announcements.unshift(ann);
  return ann;
}

export function getUserNotifications(userId: string): NotificationItem[] {
  return getV3().notifications.filter((n) => n.userId === userId);
}

export function markAllNotificationsRead(userId: string) {
  for (const n of getV3().notifications) {
    if (n.userId === userId) n.read = true;
  }
}

export function getGamificationForUser(userId: string, name: string): StudentGamification {
  const map = getV3().gamification;
  if (!map[userId]) {
    const clean = name.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 5) || "USER";
    map[userId] = {
      userId,
      name,
      xp: 250,
      streakDays: 1,
      level: "Level 1 • Junior Explorer",
      badges: ["Welcome to Aibo8"],
      referralCode: `AIBO8-${clean}`,
      referralsCount: 0,
      referralCreditsInr: 0,
    };
  }
  return map[userId];
}

export function getLeaderboard(): StudentGamification[] {
  return Object.values(getV3().gamification).sort((a, b) => b.xp - a.xp);
}

export function getInstitutionBatches(): InstitutionBatchItem[] {
  return getV3().batches;
}

export function createInstitutionBatch(input: {
  institutionName: string;
  batchCode: string;
  courseId: string;
  courseTitle: string;
  maxSeats: number;
}): InstitutionBatchItem {
  const batch: InstitutionBatchItem = {
    id: `batch-${Date.now()}`,
    institutionName: input.institutionName.trim(),
    batchCode: input.batchCode.trim().toUpperCase(),
    courseId: input.courseId,
    courseTitle: input.courseTitle,
    maxSeats: Math.max(1, input.maxSeats),
    usedSeats: 0,
    createdAt: new Date().toISOString(),
  };
  getV3().batches.unshift(batch);
  return batch;
}

export function redeemInstitutionBatch(batchCode: string): InstitutionBatchItem | null {
  const batch = getV3().batches.find(
    (b) => b.batchCode.toUpperCase() === batchCode.trim().toUpperCase()
  );
  if (!batch || batch.usedSeats >= batch.maxSeats) return null;
  batch.usedSeats += 1;
  return batch;
}

export function createKitOrder(input: Omit<KitOrderItem, "id" | "status" | "createdAt">): KitOrderItem {
  const order: KitOrderItem = {
    ...input,
    id: `kit-${Date.now()}`,
    status: "REQUESTED",
    createdAt: new Date().toISOString(),
  };
  getV3().kitOrders.unshift(order);
  return order;
}

export function getKitOrders(): KitOrderItem[] {
  return getV3().kitOrders;
}

export function getSmtpSettings(): SmtpSettings {
  return getV3().smtp;
}

export function updateSmtpSettings(patch: Partial<SmtpSettings>) {
  getV3().smtp = { ...getV3().smtp, ...patch };
  return getV3().smtp;
}

export function createPasswordResetCode(email: string): string {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  getV3().resetTokens[email.toLowerCase()] = {
    email: email.toLowerCase(),
    code,
    expiresAt: Date.now() + 15 * 60 * 1000,
  };
  return code;
}

export function verifyPasswordResetCode(email: string, code: string): boolean {
  const rec = getV3().resetTokens[email.toLowerCase()];
  if (!rec) return false;
  return rec.code === code.trim() && rec.expiresAt > Date.now();
}

export function generateAiTutorReply(prompt: string, courseTitle: string): string {
  const q = prompt.toLowerCase();
  if (q.includes("esp32") || q.includes("wifi") || q.includes("mqtt") || q.includes("pin")) {
    return `**Aibo8 AI Study Buddy (${courseTitle}):**\nGreat ESP32 question! Remember two golden rules:\n1. Never use ADC2 pins while Wi-Fi is active — stick to **GPIO 32–39 (ADC1)** for analog sensors.\n2. For I2C sensors (like BME280 or OLED), default pins are **SDA = GPIO 21** and **SCL = GPIO 22**.\n3. If MQTT disconnects, add a non-blocking \`reconnect()\` check inside \`loop()\` and verify your Wi-Fi is 2.4 GHz (ESP32 does not support 5 GHz).`;
  }
  if (q.includes("ros") || q.includes("slam") || q.includes("lidar") || q.includes("tf")) {
    return `**Aibo8 AI Study Buddy (${courseTitle}):**\nFor ROS2 & SLAM debugging, run these 3 quick checks:\n1. Always source your workspace: \`source /opt/ros/humble/setup.bash && source install/setup.bash\`.\n2. Verify your laser scan topic is active: \`ros2 topic hz /scan\`.\n3. Check your transform tree (\`map → odom → base_link → laser_frame\`) with \`ros2 run tf2_tools view_frames\`. Misaligned frames cause smeared maps!`;
  }
  if (q.includes("jetson") || q.includes("yolo") || q.includes("tensorrt") || q.includes("fps")) {
    return `**Aibo8 AI Study Buddy (${courseTitle}):**\nTo maximize Edge AI FPS on NVIDIA Jetson:\n1. Export your PyTorch model with \`half=True\` (FP16 TensorRT engine).\n2. Switch Jetson power mode to MAXN (\`sudo nvpmodel -m 0 && sudo jetson_clocks\`).\n3. Use \`imgsz=416\` or \`640\` depending on whether you need higher speed or tiny object accuracy.`;
  }
  return `**Aibo8 AI Study Buddy (${courseTitle}):**\nAwesome question! Here is a simple step-by-step way to solve this:\n1. **Break it into Input → Process → Output:** Check your sensor/data input first, print raw values to the terminal/serial monitor, and verify they make sense.\n2. **Test one module at a time:** Run the minimal lab snippet before combining motors, Wi-Fi, or AI models.\n3. **Need a mentor to inspect your wiring or code?** Drop your GitHub/Wokwi link in the **Lesson Q&A** or **Project Assignment** tab!`;
}
