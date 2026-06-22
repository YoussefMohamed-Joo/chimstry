import type { User, LoginInput, RegisterInput } from '@/types';
import usersData from '@/data/users.json';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const users = usersData as unknown as User[];

export const authService = {
  async login(input: LoginInput): Promise<{ user: User; token: string }> {
    await delay(800);
    const user = users.find((u) => u.email === input.email);
    if (!user) throw new Error('Invalid email or password');
    const token = `mock_token_${user.id}_${Date.now()}`;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return { user, token };
  },

  async register(input: RegisterInput): Promise<{ user: User; token: string }> {
    await delay(800);
    if (users.some((u) => u.email === input.email)) {
      throw new Error('Email already registered');
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: input.name,
      email: input.email,
      avatar: '/users/default.jpg',
      enrolledCourses: [],
      progress: {},
      role: 'student',
      createdAt: new Date().toISOString(),
    };
    const token = `mock_token_${newUser.id}_${Date.now()}`;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(newUser));
    return { user: newUser, token };
  },

  async getCurrentUser(): Promise<User | null> {
    await delay(200);
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  },

  async enrollCourse(userId: string, courseId: string): Promise<User> {
    await delay(400);
    const stored = localStorage.getItem('user');
    if (!stored) throw new Error('Not authenticated');
    const user: User = JSON.parse(stored);
    if (!user.enrolledCourses.includes(courseId)) {
      user.enrolledCourses.push(courseId);
      user.progress[courseId] = 0;
      localStorage.setItem('user', JSON.stringify(user));
    }
    return user;
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};
