export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  enrolledCourses: string[];
  progress: Record<string, number>;
  role: 'student' | 'teacher' | 'admin';
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
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
