export interface PaymentReceipt {
  courseId: string;
  amount: number;
  phoneNumber: string;
  imageBase64: string;
  imageName: string;
  submittedAt: string;
  status: 'pending' | 'verified' | 'rejected';
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
  enrolledCourses: string[];
  progress: Record<string, number>;
  role: 'student' | 'teacher' | 'admin';
  createdAt: string;
  isActive: boolean;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'superadmin';
  avatar: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User | Admin;
  token: string;
  role: 'user' | 'admin';
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

