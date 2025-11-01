import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageSquare, Star, ThumbsUp, ThumbsDown, Meh } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useProductStore } from '@/store/useProductStore';
import { cn } from '@/lib/utils';

interface AppFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FeedbackItem {
  id: string;
  feedbackText: string;
  sentimentScore: number;
  sentimentLabel: string;
  submittedAt: string;
}

const AppFeedbackModal: React.FC<AppFeedbackModalProps> = ({ isOpen, onClose }) => {
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [appFeedbacks, setAppFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'submit' | 'view'>('submit');

  const { user } = useProductStore();

  // Fetch app feedback when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchAppFeedback();
    }
  }, [isOpen]);

  const fetchAppFeedback = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/feedback/app');
      if (response.ok) {
        const data = await response.json();
        setAppFeedbacks(data);
      }
    } catch (error) {
      console.error('Error fetching app feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!feedbackText.trim()) return;

    setIsSubmitting(true);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Add auth header if user is logged in
      if (user) {
        const token = localStorage.getItem('token');
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }

      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          feedbackText: feedbackText.trim(),
          feedbackType: 'app'
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setFeedbackText('');
        // Refresh feedback list
        fetchAppFeedback();
        setTimeout(() => setSubmitted(false), 3000);
      } else {
        console.error('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSentimentIcon = (label: string) => {
    switch (label) {
      case 'positive':
        return <ThumbsUp className="h-4 w-4 text-green-500" />;
      case 'negative':
        return <ThumbsDown className="h-4 w-4 text-red-500" />;
      default:
        return <Meh className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getSentimentColor = (label: string) => {
    switch (label) {
      case 'positive':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'negative':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">App Feedback</h2>
                  <p className="text-sm text-gray-600">Share your thoughts about the app</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('submit')}
                className={cn(
                  'flex-1 py-3 px-6 text-sm font-medium transition-colors',
                  activeTab === 'submit'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                Submit Feedback
              </button>
              <button
                onClick={() => setActiveTab('view')}
                className={cn(
                  'flex-1 py-3 px-6 text-sm font-medium transition-colors',
                  activeTab === 'view'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                View Feedback ({appFeedbacks.length})
              </button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-96 overflow-y-auto">
              {activeTab === 'submit' ? (
                <div className="space-y-4">
                  {submitted ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-8"
                    >
                      <div className="text-4xl mb-2">🎉</div>
                      <h3 className="text-lg font-semibold text-green-600 mb-2">
                        Thank you for your feedback!
                      </h3>
                      <p className="text-gray-600">
                        Your input helps us improve the app for everyone.
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmitFeedback} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          What do you think about the app?
                        </label>
                        <Textarea
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                          placeholder="Share your thoughts, suggestions, or report any issues..."
                          className="min-h-24 resize-none"
                          maxLength={500}
                        />
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-500">
                            {!user && "Anonymous feedback"}
                            {user && "Your feedback will be associated with your account"}
                          </span>
                          <span className="text-xs text-gray-500">
                            {feedbackText.length}/500
                          </span>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={!feedbackText.trim() || isSubmitting}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Submit Feedback
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading feedback...</p>
                    </div>
                  ) : appFeedbacks.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">No feedback yet. Be the first to share your thoughts!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {appFeedbacks.map((feedback) => (
                        <motion.div
                          key={feedback.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {getSentimentIcon(feedback.sentimentLabel)}
                              <span className={cn(
                                'text-xs px-2 py-1 rounded-full border',
                                getSentimentColor(feedback.sentimentLabel)
                              )}>
                                {feedback.sentimentLabel}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {new Date(feedback.submittedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-800">{feedback.feedbackText}</p>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AppFeedbackModal;
