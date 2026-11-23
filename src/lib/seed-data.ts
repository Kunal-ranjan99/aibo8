import { CategoryData, CourseData, CouponData, EnrollmentData, CertificateData, Role } from "./types";

export interface SeedUser {
  id: string;
  name: string;
  email: string;
  passwordPlain: string;
  role: Role;
  bio: string;
}

export const SEED_USERS: SeedUser[] = [
  {
    id: "user-admin-1",
    name: "Aarav Mehta",
    email: "admin@aibo8.ai",
    passwordPlain: "admin123",
    role: "ADMIN",
    bio: "Founder & Chief Robotics Architect at Aibo8.",
  },
  {
    id: "user-inst-1",
    name: "Dr. Elena Vance",
    email: "elena@aibo8.ai",
    passwordPlain: "instructor123",
    role: "INSTRUCTOR",
    bio: "Former Autonomous Systems Lead. 12+ years in ROS2, SLAM, and Edge AI.",
  },
  {
    id: "user-inst-2",
    name: "Kiran Deshmukh",
    email: "kiran@aibo8.ai",
    passwordPlain: "instructor123",
    role: "INSTRUCTOR",
    bio: "Embedded Firmware Engineer specializing in ESP32, MQTT, and industrial IoT.",
  },
  {
    id: "user-student-1",
    name: "Maya Lin",
    email: "student@aibo8.ai",
    passwordPlain: "student123",
    role: "STUDENT",
    bio: "Mechatronics undergrad building autonomous rover prototypes.",
  },
  {
    id: "user-student-2",
    name: "Rohan Verma",
    email: "rohan@aibo8.ai",
    passwordPlain: "student123",
    role: "STUDENT",
    bio: "Embedded electronics student learning ROS2 and Jetson Nano.",
  },
];

export const SEED_CATEGORIES: CategoryData[] = [
  {
    id: "cat-ai",
    name: "AI & Edge ML",
    slug: "ai-ml",
    description: "Deep learning, computer vision, LLMs, and TinyML deployed on Jetson & edge silicon.",
    icon: "Cpu",
    image: "/images/track-ai.jpg",
    subCategories: [
      { id: "sub-cv", name: "Computer Vision & Jetson", slug: "computer-vision-jetson", categoryId: "cat-ai" },
      { id: "sub-tinyml", name: "TinyML & Microcontrollers", slug: "tinyml-microcontrollers", categoryId: "cat-ai" },
      { id: "sub-agents", name: "AI Agents & Physical LLMs", slug: "ai-agents-physical-llms", categoryId: "cat-ai" },
    ],
  },
  {
    id: "cat-robotics",
    name: "Robotics & ROS2",
    slug: "robotics",
    description: "Autonomous navigation, SLAM, kinematics, Gazebo simulation, and quadruped/arm control.",
    icon: "Bot",
    image: "/images/track-robotics.jpg",
    subCategories: [
      { id: "sub-ros2", name: "ROS2 & Autonomous SLAM", slug: "ros2-autonomous-slam", categoryId: "cat-robotics" },
      { id: "sub-arms", name: "Robotic Arms & Kinematics", slug: "robotic-arms-kinematics", categoryId: "cat-robotics" },
      { id: "sub-drones", name: "Autonomous Drones & PX4", slug: "autonomous-drones-px4", categoryId: "cat-robotics" },
    ],
  },
  {
    id: "cat-iot",
    name: "IoT & Embedded",
    slug: "iot-hardware",
    description: "ESP32, Arduino, Raspberry Pi, MQTT telemetry, PCB basics, and smart sensor networks.",
    icon: "Radio",
    image: "/images/track-iot.jpg",
    subCategories: [
      { id: "sub-esp32", name: "ESP32 & Smart Wi-Fi/BLE", slug: "esp32-smart-wifi-ble", categoryId: "cat-iot" },
      { id: "sub-lora", name: "LoRaWAN & Industrial IoT", slug: "lorawan-industrial-iot", categoryId: "cat-iot" },
      { id: "sub-rpi", name: "Raspberry Pi & Linux Edge", slug: "raspberry-pi-linux-edge", categoryId: "cat-iot" },
    ],
  },
];

export const SEED_COURSES: CourseData[] = [
  {
    id: "course-1",
    title: "Autonomous Robotics with ROS2 & LiDAR SLAM",
    slug: "autonomous-robotics-ros2-lidar-slam",
    shortDescription:
      "Build, simulate, and deploy a fully autonomous mobile robot using ROS2 Humble, Nav2, and real-time 2D/3D LiDAR mapping.",
    description:
      "Master modern robotics engineering from first principles to real-world hardware deployment. You will architect ROS2 nodes in Python and C++, simulate a differential-drive rover in Gazebo, fuse IMU + LiDAR data for SLAM Toolbox mapping, and tune Nav2 autonomous path planning.",
    thumbnail: "/images/track-robotics.jpg",
    level: "Intermediate",
    price: 2999,
    discountPrice: 1999,
    isFree: false,
    duration: "14h 20m",
    hardwareTags: ["ROS2 Humble", "LiDAR", "Raspberry Pi 5", "Gazebo"],
    outcomes: [
      "Architect modular ROS2 topics, services, and actions in Python & C++",
      "Build URDF/Xacro robot models and simulate physics in Gazebo",
      "Generate live occupancy grid maps with SLAM Toolbox & LiDAR",
      "Configure Nav2 costmaps for obstacle avoidance and waypoint navigation",
    ],
    requirements: [
      "Basic Python or C++ programming familiarity",
      "Ubuntu 22.04 (native, VM, or Docker — setup guide included)",
      "Physical robot hardware is optional (full Gazebo simulator provided)",
    ],
    status: "PUBLISHED",
    featured: true,
    categorySlug: "robotics",
    categoryName: "Robotics & ROS2",
    subCategorySlug: "ros2-autonomous-slam",
    subCategoryName: "ROS2 & Autonomous SLAM",
    instructorId: "user-inst-1",
    instructorName: "Dr. Elena Vance",
    instructorTitle: "Principal Robotics Architect",
    instructorBio: "Former Autonomous Systems Lead with 12+ years building mobile robots and SLAM pipelines.",
    rating: 4.9,
    reviewsCount: 342,
    studentsCount: 4820,
    sections: [
      {
        id: "sec-1-1",
        title: "Module 1: ROS2 Core Architecture & Setup",
        order: 1,
        lessons: [
          {
            id: "les-1-1",
            title: "Welcome to Autonomous Robotics & System Overview",
            type: "VIDEO",
            duration: "08:45",
            order: 1,
            isPreview: true,
            videoUrl: "https://www.youtube.com/embed/0aPbWprcCSD",
            content:
              "In this kickoff session, we map out the full perception → localization → planning → control loop used in modern autonomous robots and inspect the Aibo8 rover reference architecture.",
          },
          {
            id: "les-1-2",
            title: "Lab: Writing Your First ROS2 Velocity Publisher",
            type: "CODE_LAB",
            duration: "18:00",
            order: 2,
            isPreview: true,
            content:
              "Create a ROS2 Python node that publishes `geometry_msgs/Twist` commands to `/cmd_vel` at 10 Hz to drive your rover in a smooth circular trajectory.",
            codeLang: "python",
            codeSnippet: `import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist

class RoverDriveNode(Node):
    def __init__(self):
        super().__init__('aibo8_rover_driver')
        self.publisher_ = self.create_publisher(Twist, '/cmd_vel', 10)
        self.timer = self.create_timer(0.1, self.publish_velocity)
        self.get_logger().info('Aibo8 Rover Driver initialized.')

    def publish_velocity(self):
        msg = Twist()
        msg.linear.x = 0.35   # meters/sec forward
        msg.angular.z = 0.20  # rad/sec turn rate
        self.publisher_.publish(msg)

def main(args=None):
    rclpy.init(args=args)
    node = RoverDriveNode()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()`,
          },
          {
            id: "les-1-3",
            title: "Objective Exam: ROS2 Nodes & SLAM Fundamentals",
            type: "QUIZ",
            duration: "05:00",
            order: 3,
            passingScore: 67,
            timeLimitMinutes: 5,
            quizData: [
              {
                id: "q1",
                question: "Which ROS2 communication primitive is best suited for continuous high-frequency LiDAR scan streaming?",
                options: ["Services", "Topics (Pub/Sub)", "Parameters", "Static TF"],
                correctIndex: 1,
                explanation: "Topics use asynchronous publish/subscribe messaging, making them ideal for continuous sensor streams like LiDAR and IMU data.",
              },
              {
                id: "q2",
                question: "What standard message type drives a differential robot on the /cmd_vel topic?",
                options: ["sensor_msgs/LaserScan", "std_msgs/Float64", "geometry_msgs/Twist", "nav_msgs/Path"],
                correctIndex: 2,
                explanation: "geometry_msgs/Twist carries linear (x, y, z) and angular (x, y, z) velocity vectors.",
              },
              {
                id: "q3",
                question: "What does SLAM stand for in autonomous robotics?",
                options: [
                  "Simultaneous Localization and Mapping",
                  "Sensor Latency Adjustment Module",
                  "Sequential Linear Actuator Motion",
                  "Supervised Learning for Autonomous Machines",
                ],
                correctIndex: 0,
                explanation: "SLAM builds a map of an unknown environment while simultaneously tracking the robot's pose within it.",
              },
            ],
          },
        ],
      },
      {
        id: "sec-1-2",
        title: "Module 2: LiDAR SLAM & Nav2 Autonomous Navigation",
        order: 2,
        lessons: [
          {
            id: "les-1-4",
            title: "Configuring 2D LiDAR & TF2 Coordinate Frames",
            type: "ARTICLE",
            duration: "12:00",
            order: 1,
            content:
              "Every autonomous robot depends on an accurate transform tree (`map` → `odom` → `base_link` → `laser_frame`). When your LiDAR scan is misaligned by even 5 degrees, SLAM loop closures fail and walls smear.\n\n**Key Checklist:**\n1. Verify `base_footprint` sits on the ground plane.\n2. Publish static transform from `base_link` to `laser_frame` with exact millimeter offsets.\n3. Inspect live frames using `ros2 run tf2_tools view_frames`.",
          },
          {
            id: "les-1-5",
            title: "Launching Nav2 Autonomous Waypoint Mission",
            type: "CODE_LAB",
            duration: "22:00",
            order: 2,
            content:
              "Use the Nav2 Simple Commander API to dispatch autonomous multi-waypoint patrol missions with obstacle recovery.",
            codeLang: "bash",
            codeSnippet: `# Launch SLAM Toolbox in online async mode
ros2 launch slam_toolbox online_async_launch.py use_sim_time:=true

# Start Nav2 stack with custom costmap params
ros2 launch nav2_bringup navigation_launch.py use_sim_time:=true params_file:=./config/aibo8_nav2.yaml`,
          },
        ],
      },
    ],
    reviews: [
      {
        id: "rev-1",
        rating: 5,
        comment: "Finally a ROS2 course that connects Gazebo simulation cleanly to real Raspberry Pi + LiDAR hardware!",
        userId: "user-student-1",
        userName: "Maya Lin",
        createdAt: "2026-10-12",
      },
      {
        id: "rev-2",
        rating: 5,
        comment: "The TF2 debugging breakdown saved me weeks on my university capstone rover.",
        userId: "user-student-2",
        userName: "Rohan Verma",
        createdAt: "2026-10-28",
      },
    ],
  },
  {
    id: "course-2",
    title: "ESP32 & Smart IoT Engineering: Sensors to Cloud",
    slug: "esp32-smart-iot-sensors-to-cloud",
    shortDescription:
      "Design production IoT devices with ESP32, MQTT brokers, OLED telemetry, OTA firmware updates, and real-time cloud dashboards.",
    description:
      "Go beyond blinking LEDs. Learn how to engineer resilient, low-power IoT hardware products with ESP32. Wire I2C/SPI environmental sensors, stream telemetry securely over MQTT with TLS, implement deep-sleep battery optimization, and push Over-The-Air (OTA) firmware updates.",
    thumbnail: "/images/track-iot.jpg",
    level: "Beginner",
    price: 0,
    discountPrice: null,
    isFree: true,
    duration: "9h 45m",
    hardwareTags: ["ESP32", "MQTT", "BME280", "PlatformIO"],
    outcomes: [
      "Master ESP32 GPIO, PWM, ADC, I2C, and SPI hardware buses",
      "Stream sensor telemetry to cloud dashboards via MQTT & WebSockets",
      "Optimize battery life using ESP32 deep sleep & wake triggers",
      "Deploy secure Over-The-Air (OTA) firmware updates remotely",
    ],
    requirements: [
      "No prior electronics experience required",
      "An ESP32 DevKit (₹450) or Wokwi browser simulator",
    ],
    status: "PUBLISHED",
    featured: true,
    categorySlug: "iot-hardware",
    categoryName: "IoT & Embedded",
    subCategorySlug: "esp32-smart-wifi-ble",
    subCategoryName: "ESP32 & Smart Wi-Fi/BLE",
    instructorId: "user-inst-2",
    instructorName: "Kiran Deshmukh",
    instructorTitle: "Senior Embedded & IoT Engineer",
    instructorBio: "Built 50,000+ deployed industrial IoT sensor nodes across energy and smart agriculture.",
    rating: 4.8,
    reviewsCount: 518,
    studentsCount: 8940,
    sections: [
      {
        id: "sec-2-1",
        title: "Module 1: ESP32 Hardware & Sensor Telemetry",
        order: 1,
        lessons: [
          {
            id: "les-2-1",
            title: "ESP32 Pinout, Dual-Core Architecture & Wi-Fi Stack",
            type: "VIDEO",
            duration: "11:20",
            order: 1,
            isPreview: true,
            videoUrl: "https://www.youtube.com/embed/xPlN_Tk3hfg",
            content:
              "Understand the Xtensa dual-core architecture, strapping pins to avoid, ADC2 vs Wi-Fi caveats, and setting up PlatformIO in VS Code.",
          },
          {
            id: "les-2-2",
            title: "Lab: Publishing Live Sensor JSON over MQTT",
            type: "CODE_LAB",
            duration: "16:30",
            order: 2,
            isPreview: true,
            content:
              "Flash this firmware onto your ESP32 to read temperature/humidity and publish structured JSON telemetry to an MQTT broker every 5 seconds.",
            codeLang: "cpp",
            codeSnippet: `#include <WiFi.h>
#include <PubSubClient.h>

const char* ssid = "AIBO8_LAB_WIFI";
const char* mqtt_server = "broker.hivemq.com";

WiFiClient espClient;
PubSubClient client(espClient);

void publishTelemetry(float tempC, float humidity) {
  char payload[128];
  snprintf(payload, sizeof(payload),
    "{\"device\":\"aibo8-node-01\",\"temp\":%.2f,\"hum\":%.2f}",
    tempC, humidity);
  client.publish("aibo8/iot/telemetry", payload);
}`,
          },
          {
            id: "les-2-3",
            title: "Objective Exam: I2C, MQTT & Power Management",
            type: "QUIZ",
            duration: "04:00",
            order: 3,
            passingScore: 50,
            timeLimitMinutes: 4,
            quizData: [
              {
                id: "q2-1",
                question: "How many signal wires does the I2C bus require for communicating with multiple sensors?",
                options: ["1 wire", "2 wires (SDA & SCL)", "4 wires (MOSI, MISO, SCK, CS)", "8 parallel wires"],
                correctIndex: 1,
                explanation: "I2C uses just two bi-directional lines: SDA (data) and SCL (clock), plus shared ground.",
              },
              {
                id: "q2-2",
                question: "Why is MQTT preferred over HTTP polling for battery-powered IoT devices?",
                options: [
                  "MQTT requires no internet connection",
                  "MQTT has tiny packet overhead and supports persistent pub/sub connections",
                  "HTTP cannot send JSON data",
                  "MQTT automatically charges the battery",
                ],
                correctIndex: 1,
                explanation: "MQTT's 2-byte fixed header and lightweight pub/sub model drastically reduce bandwidth and battery drain.",
              },
            ],
          },
        ],
      },
    ],
    reviews: [
      {
        id: "rev-3",
        rating: 5,
        comment: "Free course with paid-level production quality! Got my ESP32 + MQTT pipeline running in one evening.",
        userId: "user-student-1",
        userName: "Maya Lin",
        createdAt: "2026-11-01",
      },
    ],
  },
  {
    id: "course-3",
    title: "Edge AI & Computer Vision on NVIDIA Jetson",
    slug: "edge-ai-computer-vision-nvidia-jetson",
    shortDescription:
      "Train custom YOLOv8 object detection models in PyTorch, optimize with TensorRT FP16/INT8, and run 60 FPS vision on Jetson Orin Nano.",
    description:
      "Bring real-time intelligence directly onto robots and smart cameras without cloud latency. Learn dataset curation, PyTorch training, ONNX export, TensorRT quantization, and live camera inference pipelines.",
    thumbnail: "/images/track-ai.jpg",
    level: "Intermediate",
    price: 3499,
    discountPrice: 2499,
    isFree: false,
    duration: "12h 10m",
    hardwareTags: ["Jetson Orin", "PyTorch", "TensorRT", "OpenCV"],
    outcomes: [
      "Train custom vision models for robotics perception & defect detection",
      "Export PyTorch weights to ONNX and optimize with TensorRT",
      "Achieve 40–60 FPS real-time inference on edge GPU hardware",
      "Integrate vision bounding boxes with robotic actuation triggers",
    ],
    requirements: [
      "Python basics",
      "Google Colab (free GPU) or NVIDIA Jetson device",
    ],
    status: "PUBLISHED",
    featured: true,
    categorySlug: "ai-ml",
    categoryName: "AI & Edge ML",
    subCategorySlug: "computer-vision-jetson",
    subCategoryName: "Computer Vision & Jetson",
    instructorId: "user-inst-1",
    instructorName: "Dr. Elena Vance",
    instructorTitle: "Principal Robotics Architect",
    instructorBio: "Former Autonomous Systems Lead with 12+ years building mobile robots and SLAM pipelines.",
    rating: 4.9,
    reviewsCount: 279,
    studentsCount: 3610,
    sections: [
      {
        id: "sec-3-1",
        title: "Module 1: Real-Time Object Detection Pipeline",
        order: 1,
        lessons: [
          {
            id: "les-3-1",
            title: "Why Edge AI Beats Cloud Inference for Robotics",
            type: "ARTICLE",
            duration: "09:00",
            order: 1,
            isPreview: true,
            content:
              "A robot moving at 2 m/s travels 40 cm during a 200ms cloud round-trip. Running quantized TensorRT models locally on a Jetson Orin Nano cuts latency below 15ms while keeping privacy intact and working offline.",
          },
          {
            id: "les-3-2",
            title: "Lab: Exporting PyTorch Vision Model to TensorRT",
            type: "CODE_LAB",
            duration: "20:00",
            order: 2,
            content:
              "Convert a trained detector to FP16 TensorRT engine format and benchmark FPS on live video.",
            codeLang: "python",
            codeSnippet: `from ultralytics import YOLO

# Load pretrained model & export to FP16 TensorRT engine
model = YOLO("yolov8n.pt")
model.export(format="engine", half=True, imgsz=640)

# Run real-time inference on CSI/USB camera
trt_model = YOLO("yolov8n.engine")
results = trt_model.predict(source=0, show=True, conf=0.45)`,
          },
          {
            id: "les-3-3",
            title: "Objective Exam: Quantization & Edge Inference",
            type: "QUIZ",
            duration: "04:00",
            order: 3,
            passingScore: 100,
            timeLimitMinutes: 4,
            quizData: [
              {
                id: "q3-1",
                question: "What is the primary benefit of FP16/INT8 quantization in TensorRT?",
                options: [
                  "Increases model file size",
                  "Faster inference speed and lower VRAM/power consumption",
                  "Removes the need for training data",
                  "Replaces the camera lens",
                ],
                correctIndex: 1,
                explanation: "Lower-precision arithmetic executes much faster on GPU Tensor Cores while using half to a quarter of the memory.",
              },
            ],
          },
        ],
      },
    ],
    reviews: [
      {
        id: "rev-4",
        rating: 5,
        comment: "Boosted our drone vision pipeline from 9 FPS to 52 FPS using the TensorRT chapter!",
        userId: "user-student-3",
        userName: "Devon Brooks",
        createdAt: "2026-11-05",
      },
    ],
  },
  {
    id: "course-4",
    title: "TinyML: Running Neural Networks on Microcontrollers",
    slug: "tinyml-neural-networks-microcontrollers",
    shortDescription:
      "Deploy wake-word speech recognition and gesture classification on affordable ARM Cortex-M and ESP32-S3 microcontrollers.",
    description:
      "Discover how to shrink deep learning models under 100KB RAM using TensorFlow Lite for Microcontrollers and Edge Impulse. Build battery-powered smart wearables and predictive maintenance sensors.",
    thumbnail: "/images/track-ai.jpg",
    level: "Beginner",
    price: 0,
    discountPrice: null,
    isFree: true,
    duration: "7h 15m",
    hardwareTags: ["TinyML", "ESP32-S3", "TFLite Micro", "Arduino"],
    outcomes: [
      "Collect labeled accelerometer & microphone datasets",
      "Quantize neural networks to INT8 C++ byte arrays",
      "Deploy offline wake-word detection on microcontrollers",
    ],
    requirements: ["Basic Arduino or Python familiarity"],
    status: "PUBLISHED",
    featured: false,
    categorySlug: "ai-ml",
    categoryName: "AI & Edge ML",
    subCategorySlug: "tinyml-microcontrollers",
    subCategoryName: "TinyML & Microcontrollers",
    instructorId: "user-inst-2",
    instructorName: "Kiran Deshmukh",
    instructorTitle: "Senior Embedded & IoT Engineer",
    instructorBio: "Built 50,000+ deployed industrial IoT sensor nodes across energy and smart agriculture.",
    rating: 4.8,
    reviewsCount: 194,
    studentsCount: 5120,
    sections: [
      {
        id: "sec-4-1",
        title: "Module 1: Intro to Ultra-Low-Power AI",
        order: 1,
        lessons: [
          {
            id: "les-4-1",
            title: "Fitting a Neural Network into 256KB of SRAM",
            type: "ARTICLE",
            duration: "10:00",
            order: 1,
            isPreview: true,
            content:
              "TinyML unlocks always-on intelligence using milliwatts of power. By combining 1D CNNs, MFCC audio spectrograms, and post-training INT8 quantization, you can classify keywords locally with zero cloud cost.",
          },
        ],
      },
    ],
    reviews: [],
  },
  {
    id: "course-5",
    title: "6-DOF Robotic Arm Kinematics & Inverse Control",
    slug: "6-dof-robotic-arm-kinematics-control",
    shortDescription:
      "Master forward/inverse kinematics, MoveIt 2 trajectory planning, and servo control for desktop & industrial robotic arms.",
    description:
      "Understand Denavit-Hartenberg parameters, Jacobians, collision-free pick-and-place planning in MoveIt 2, and closed-loop brushless/servo actuator control.",
    thumbnail: "/images/track-robotics.jpg",
    level: "Advanced",
    price: 3999,
    discountPrice: 2999,
    isFree: false,
    duration: "16h 00m",
    hardwareTags: ["MoveIt 2", "6-DOF Arm", "Python", "Inverse Kinematics"],
    outcomes: [
      "Derive forward & inverse kinematics matrices for 6-DOF manipulators",
      "Plan collision-free trajectories in MoveIt 2",
      "Execute vision-guided pick-and-place routines",
    ],
    requirements: ["Linear algebra basics & Python"],
    status: "PUBLISHED",
    featured: true,
    categorySlug: "robotics",
    categoryName: "Robotics & ROS2",
    subCategorySlug: "robotic-arms-kinematics",
    subCategoryName: "Robotic Arms & Kinematics",
    instructorId: "user-inst-1",
    instructorName: "Dr. Elena Vance",
    instructorTitle: "Principal Robotics Architect",
    instructorBio: "Former Autonomous Systems Lead with 12+ years building mobile robots and SLAM pipelines.",
    rating: 5.0,
    reviewsCount: 128,
    studentsCount: 1890,
    sections: [
      {
        id: "sec-5-1",
        title: "Module 1: Manipulator Kinematics Foundations",
        order: 1,
        lessons: [
          {
            id: "les-5-1",
            title: "Homogeneous Transformation Matrices Explained",
            type: "ARTICLE",
            duration: "14:00",
            order: 1,
            isPreview: true,
            content:
              "Every joint of a robotic arm rotates and translates a local coordinate frame. Multiplying 4x4 homogeneous transform matrices from base to end-effector gives you the exact 3D pose of your gripper.",
          },
        ],
      },
    ],
    reviews: [],
  },
  {
    id: "course-6",
    title: "LoRaWAN & Industrial Smart Agriculture IoT",
    slug: "lorawan-industrial-iot-networks",
    shortDescription:
      "Build 10km+ long-range wireless sensor networks using LoRaWAN, solar power harvesting, and The Things Network.",
    description:
      "Learn RF link budgets, spreading factors, payload decoders, and solar-powered enclosure engineering for remote IoT deployments where Wi-Fi and cellular don't reach.",
    thumbnail: "/images/track-iot.jpg",
    level: "Intermediate",
    price: 1999,
    discountPrice: 1299,
    isFree: false,
    duration: "8h 30m",
    hardwareTags: ["LoRaWAN", "SX1262", "Solar IoT", "TTN"],
    outcomes: [
      "Design 10km+ sub-GHz LoRaWAN sensor nodes",
      "Write compact binary payload encoders & decoders",
      "Size solar panels and LiFePO4 batteries for 3-year autonomy",
    ],
    requirements: ["Basic microcontroller familiarity"],
    status: "PUBLISHED",
    featured: false,
    categorySlug: "iot-hardware",
    categoryName: "IoT & Embedded",
    subCategorySlug: "lorawan-industrial-iot",
    subCategoryName: "LoRaWAN & Industrial IoT",
    instructorId: "user-inst-2",
    instructorName: "Kiran Deshmukh",
    instructorTitle: "Senior Embedded & IoT Engineer",
    instructorBio: "Built 50,000+ deployed industrial IoT sensor nodes across energy and smart agriculture.",
    rating: 4.7,
    reviewsCount: 112,
    studentsCount: 2340,
    sections: [
      {
        id: "sec-6-1",
        title: "Module 1: Long-Range RF Fundamentals",
        order: 1,
        lessons: [
          {
            id: "les-6-1",
            title: "Spreading Factors, Airtime & Link Budgets",
            type: "ARTICLE",
            duration: "11:00",
            order: 1,
            isPreview: true,
            content:
              "LoRa chirp spread spectrum modulation trades data rate for receiver sensitivity—allowing milliwatt transmitters to communicate across 10+ kilometers with line of sight.",
          },
        ],
      },
    ],
    reviews: [],
  },
];

export const SEED_COUPONS: CouponData[] = [
  {
    id: "coup-1",
    code: "AIBO20",
    discountType: "PERCENT",
    discountValue: 20,
    discountPercent: 20,
    active: true,
    expiresAt: "2027-03-31",
  },
  {
    id: "coup-2",
    code: "FLAT500",
    discountType: "FLAT",
    discountValue: 500,
    discountPercent: 0,
    active: true,
    expiresAt: "2027-03-31",
  },
  {
    id: "coup-3",
    code: "ROBOTICS50",
    discountType: "PERCENT",
    discountValue: 50,
    discountPercent: 50,
    active: true,
    expiresAt: "2027-01-31",
  },
];

export const SEED_ENROLLMENTS: EnrollmentData[] = [
  {
    id: "enr-1",
    userId: "user-student-1",
    courseId: "course-1",
    completedLessons: ["les-1-1", "les-1-2"],
    quizScores: { "les-1-3": { score: 3, total: 3, percent: 100, passed: true, attempts: 1 } },
    progress: 40,
    enrolledAt: "2026-11-10T10:00:00.000Z",
  },
  {
    id: "enr-2",
    userId: "user-student-1",
    courseId: "course-2",
    completedLessons: ["les-2-1", "les-2-2", "les-2-3"],
    quizScores: { "les-2-3": { score: 2, total: 2, percent: 100, passed: true, attempts: 1 } },
    progress: 100,
    enrolledAt: "2026-11-01T08:00:00.000Z",
  },
];

export const SEED_CERTIFICATES: CertificateData[] = [
  {
    id: "cert-1",
    verifyCode: "AIBO8-IOT-2026-9X4K",
    userId: "user-student-1",
    userName: "Maya Lin",
    courseId: "course-2",
    courseTitle: "ESP32 & Smart IoT Engineering: Sensors to Cloud",
    instructorName: "Kiran Deshmukh",
    issuedAt: "2026-11-15T12:00:00.000Z",
  },
];
