'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, CheckCircle2, XCircle, Eye, X, Clock, Smartphone, BookOpen, DollarSign, User, Phone, Image,
} from 'lucide-react';
import { usePaymentRequests, useApprovePayment, useRejectPayment } from '@/hooks/usePayments';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const statusBadge = (status: string) => {
  switch (status) {
    case 'approved': return <Badge variant="green">مقبول</Badge>;
    case 'rejected': return <Badge variant="red">مرفوض</Badge>;
    default: return <Badge variant="yellow">قيد المراجعة</Badge>;
  }
};

export default function AdminPaymentsPage() {
  const { data: requests, isLoading } = usePaymentRequests();
  const approve = useApprovePayment();
  const reject = useRejectPayment();
  const [previewImg, setPreviewImg] = useState<string | null>(null);

  const handleApprove = (id: string) => {
    if (confirm('تأكيد الموافقة على طلب الاشتراك؟')) {
      approve.mutate(id);
    }
  };

  const handleReject = (id: string) => {
    if (confirm('تأكيد رفض طلب الاشتراك؟')) {
      reject.mutate(id);
    }
  };

  return (
    <div dir="rtl" className="font-cairo min-h-screen bg-[#0B1E3D] p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors mb-2">
              <ArrowLeft className="w-4 h-4" />
              العودة للوحة التحكم
            </Link>
            <h1 className="text-3xl font-bold text-white">طلبات الدفع</h1>
            <p className="text-gray-400 mt-1">مراجعة طلبات اشتراك الطلاب والموافقة عليها</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse" />
            <span className="text-sm text-yellow-400">
              {requests?.filter((r) => r.status === 'pending').length || 0} طلب pending
            </span>
          </div>
        </div>

        {/* Image Preview Modal */}
        <AnimatePresence>
          {previewImg && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
              onClick={() => setPreviewImg(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative max-w-2xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setPreviewImg(null)}
                  className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-[#0B1E3D] border border-white/10 flex items-center justify-center text-white hover:bg-white/5 transition-colors z-10"
                >
                  <X className="w-5 h-5" />
                </button>
                <img
                  src={previewImg}
                  alt="transfer receipt"
                  className="w-full rounded-2xl border border-white/10 shadow-2xl"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-2xl" />
            ))}
          </div>
        ) : !requests?.length ? (
          <div className="text-center py-16">
            <Smartphone className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">لا توجد طلبات دفع حتى الآن</p>
            <p className="text-gray-600 text-sm mt-1">عندما يقوم الطلاب بتقديم طلبات اشتراك ستظهر هنا</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {statusBadge(request.status)}
                      <Badge variant="blue">{request.courseTitle}</Badge>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-300">
                        <User className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span className="truncate">{request.userName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span dir="ltr">{request.userPhone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <Smartphone className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span dir="ltr">01033558125</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <DollarSign className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span>{formatPrice(request.amount)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setPreviewImg(request.imageBase64)}
                      className="gap-1.5"
                    >
                      <Eye className="w-4 h-4" />
                      الصورة
                    </Button>
                    {request.status === 'pending' && (
                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleApprove(request.id)}
                          isLoading={approve.isPending}
                          className="gap-1.5 bg-green-500 hover:bg-green-600"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          موافقة
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReject(request.id)}
                          isLoading={reject.isPending}
                          className="gap-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <XCircle className="w-4 h-4" />
                          رفض
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
