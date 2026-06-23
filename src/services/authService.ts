import type { User, Admin, LoginInput, RegisterInput, AuthResponse } from '@/types';
import usersData from '@/data/users.json';
import adminsData from '@/data/admins.json';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const users = usersData as unknown as User[];
const admins = adminsData as unknown as Admin[];

export const authService = {
  async login(input: LoginInput): Promise<AuthResponse> {
    await delay(600);
    const admin = admins.find((a) => a.email === input.email && a.password === input.password);
    if (admin) {
      const token = `admin_token_${admin.id}_${Date.now()}`;
      localStorage.setItem('token', token);
      localStorage.setItem('admin', JSON.stringify(admin));
      localStorage.setItem('role', 'admin');
      return { user: admin, token, role: 'admin' };
    }
    const user = users.find((u) => u.email === input.email && u.password === input.password);
    if (!user) throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    const token = `user_token_${user.id}_${Date.now()}`;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('role', 'user');
    return { user, token, role: 'user' };
  },

  async register(input: RegisterInput): Promise<AuthResponse> {
    await delay(600);
    if (users.some((u) => u.email === input.email)) {
      throw new Error('البريد الإلكتروني مسجل بالفعل');
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: input.name,
      email: input.email,
      password: input.password,
      avatar: '/users/default.jpg',
      enrolledCourses: [],
      progress: {},
      role: 'student',
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    const token = `user_token_${newUser.id}_${Date.now()}`;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('role', 'user');
    return { user: newUser, token, role: 'user' };
  },

  async getCurrentUser(): Promise<{ user: User | Admin; role: 'user' | 'admin' } | null> {
    await delay(100);
    const role = localStorage.getItem('role');
    if (role === 'admin') {
      const stored = localStorage.getItem('admin');
      return stored ? { user: JSON.parse(stored), role: 'admin' } : null;
    }
    const stored = localStorage.getItem('user');
    return stored ? { user: JSON.parse(stored), role: 'user' } : null;
  },

  async enrollCourse(
    userId: string,
    courseId: string,
    paymentData?: { imageBase64: string; imageName: string; amount: number; phoneNumber: string }
  ): Promise<User> {
    await delay(300);
    const stored = localStorage.getItem('user');
    if (!stored) throw new Error('غير مسجل دخول');
    const user: User = JSON.parse(stored);
    if (!user.enrolledCourses.includes(courseId)) {
      user.enrolledCourses.push(courseId);
      user.progress[courseId] = 0;
      localStorage.setItem('user', JSON.stringify(user));
    }
    if (paymentData) {
      const paymentsKey = `payments_${userId}`;
      const existing = localStorage.getItem(paymentsKey);
      const payments = existing ? JSON.parse(existing) : [];
      payments.push({
        courseId,
        amount: paymentData.amount,
        phoneNumber: paymentData.phoneNumber,
        imageBase64: paymentData.imageBase64,
        imageName: paymentData.imageName,
        submittedAt: new Date().toISOString(),
        status: 'pending',
      });
      localStorage.setItem(paymentsKey, JSON.stringify(payments));
    }
    return user;
  },

  async getAllUsers(): Promise<User[]> {
    await delay(300);
    return users;
  },

  async toggleUserStatus(userId: string): Promise<User[]> {
    await delay(200);
    const user = users.find((u) => u.id === userId);
    if (user) {
      user.isActive = !user.isActive;
    }
    return users;
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('admin');
    localStorage.removeItem('role');
  },
};
