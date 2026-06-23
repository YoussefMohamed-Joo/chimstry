import type { PaymentRequest, User } from '@/types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const STORAGE_KEY = 'paymentRequests';

function getAllLocal(): PaymentRequest[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveAllLocal(requests: PaymentRequest[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}

export const paymentService = {
  async submit(data: {
    userId: string;
    userName: string;
    userEmail: string;
    userPhone: string;
    courseId: string;
    courseTitle: string;
    amount: number;
    imageBase64: string;
    imageName: string;
  }): Promise<PaymentRequest> {
    await delay(300);
    const request: PaymentRequest = {
      id: `pay-${Date.now()}`,
      ...data,
      submittedAt: new Date().toISOString(),
      status: 'pending',
    };
    const all = getAllLocal();
    all.push(request);
    saveAllLocal(all);
    return request;
  },

  async getAll(): Promise<PaymentRequest[]> {
    await delay(200);
    return getAllLocal();
  },

  async approve(requestId: string): Promise<PaymentRequest> {
    await delay(200);
    const all = getAllLocal();
    const idx = all.findIndex((r) => r.id === requestId);
    if (idx === -1) throw new Error('الطلب غير موجود');
    all[idx].status = 'approved';
    saveAllLocal(all);
    const enrollKey = `enrollments_${all[idx].userId}`;
    const stored = localStorage.getItem(enrollKey);
    const enrollments: string[] = stored ? JSON.parse(stored) : [];
    if (!enrollments.includes(all[idx].courseId)) {
      enrollments.push(all[idx].courseId);
      localStorage.setItem(enrollKey, JSON.stringify(enrollments));
    }
    return all[idx];
  },

  async reject(requestId: string): Promise<PaymentRequest> {
    await delay(200);
    const all = getAllLocal();
    const idx = all.findIndex((r) => r.id === requestId);
    if (idx === -1) throw new Error('الطلب غير موجود');
    all[idx].status = 'rejected';
    saveAllLocal(all);
    return all[idx];
  },

  async getPending(): Promise<PaymentRequest[]> {
    await delay(100);
    return getAllLocal().filter((r) => r.status === 'pending');
  },
};
