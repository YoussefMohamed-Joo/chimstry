'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, CheckCircle, AlertCircle, ImageIcon, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';

const PHONE_NUMBER = '01033558125';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle: string;
  coursePrice: number;
  onSubmit: (receiptData: { imageBase64: string; imageName: string }) => void;
  isSubmitting?: boolean;
}

export default function PaymentModal({
  isOpen,
  onClose,
  courseTitle,
  coursePrice,
  onSubmit,
  isSubmitting,
}: PaymentModalProps) {
  const [file, setFile] = useState<{ base64: string; name: string } | null>(null);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setError('');
    if (!f.type.startsWith('image/')) {
      setError('يرجى رفع صورة فقط');
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError('حجم الصورة يجب أن لا يتجاوز 5 ميجابايت');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFile({ base64: reader.result as string, name: f.name });
    };
    reader.readAsDataURL(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleSubmit = () => {
    if (!file) {
      setError('يرجى رفع صورة التحويل');
      return;
    }
    onSubmit({ imageBase64: file.base64, imageName: file.name });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-lg backdrop-blur-xl bg-[#0B1E3D]/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">تأكيد الاشتراك</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-xl p-4 space-y-3">
                <p className="text-sm text-gray-400">الدورة</p>
                <p className="text-white font-medium">{courseTitle}</p>
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="text-sm text-gray-400">المبلغ</span>
                  <span className="text-lg font-bold text-cyan-400">{formatPrice(coursePrice)}</span>
                </div>
              </div>

              <div className="backdrop-blur-xl bg-white/[0.03] border border-yellow-500/20 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-yellow-400">
                  <Smartphone className="w-5 h-5" />
                  <span className="font-bold">تعليمات الدفع</span>
                </div>
                <ol className="text-sm text-gray-300 space-y-2 pr-5 list-decimal">
                  <li>قم بتحويل المبلغ على رقم فودافون كاش</li>
                  <li className="flex items-center gap-2 text-cyan-400 font-bold">
                    <span className="text-lg ltr" dir="ltr">{PHONE_NUMBER}</span>
                  </li>
                  <li>خذ صورة (سكرين شوت) لإيصال التحويل</li>
                  <li>ارفع الصورة أدناه لإتمام التسجيل</li>
                </ol>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-2">صورة التحويل *</p>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => inputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
                    dragOver
                      ? 'border-cyan-400 bg-cyan-500/5'
                      : file
                        ? 'border-green-500/30 bg-green-500/5'
                        : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
                  }`}
                >
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleFile(f);
                    }}
                  />
                  {file ? (
                    <div className="space-y-3">
                      <img
                        src={file.base64}
                        alt="receipt preview"
                        className="max-h-40 mx-auto rounded-lg object-contain"
                      />
                      <div className="flex items-center justify-center gap-2 text-sm text-green-400">
                        <CheckCircle className="w-4 h-4" />
                        <span>{file.name}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="w-12 h-12 mx-auto rounded-xl bg-white/5 flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">
                          اسحب الصورة هنا أو <span className="text-cyan-400">اختر ملف</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG - حد أقصى 5MB</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleSubmit}
                isLoading={isSubmitting}
                disabled={!file}
              >
                {file ? 'تأكيد الاشتراك' : 'يرجى رفع صورة التحويل'}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
