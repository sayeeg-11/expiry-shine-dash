import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, TrendingDown, TrendingUp, Minus, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BrandTrend {
  brand: string;
  totalFeedbacks: number;
  averageScore: number;
  negativeCount: number;
  positiveCount: number;
  neutralCount: number;
  negativePercentage: number;
  trend: string;
  recentFeedbacks: any[];
}

interface BrandTrendsProps {
  className?: string;
}

const BrandTrends = ({ className }: BrandTrendsProps) => {
  const [trends, setTrends] = useState<BrandTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBrandTrends();
  }, []);

  const fetchBrandTrends = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/feedback/trends', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTrends(data);
      } else {
        setError('Failed to load brand trends');
      }
    } catch (err) {
      console.error('Error fetching brand trends:', err);
      setError('Error loading brand trends');
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'negative':
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      case 'positive':
        return <TrendingUp className="h-4 w-4 text-success" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'negative':
        return 'text-destructive bg-destructive/10 border-destructive/20';
      case 'positive':
        return 'text-success bg-success/10 border-success/20';
      default:
        return 'text-muted-foreground bg-muted/10 border-muted/20';
    }
  };

  if (loading) {
    return (
      <Card className={cn('glass-card', className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Brand Sentiment Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted/20 rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn('glass-card', className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Brand Sentiment Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (trends.length === 0) {
    return (
      <Card className={cn('glass-card', className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Brand Sentiment Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No feedback data available yet. Submit feedback on expired products to see trends.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('glass-card', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Brand Sentiment Trends
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Negative sentiment trends detected from user feedback
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {trends.slice(0, 5).map((trend, index) => (
          <motion.div
            key={trend.brand}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="flex items-center justify-between p-4 bg-background-glass/30 rounded-lg border border-border-glass/50"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold">{trend.brand}</h4>
                <Badge variant="outline" className={cn('text-xs', getTrendColor(trend.trend))}>
                  {getTrendIcon(trend.trend)}
                  {trend.trend}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Total Feedback</div>
                  <div className="font-medium">{trend.totalFeedbacks}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Avg Score</div>
                  <div className="font-medium">{trend.averageScore}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Negative</div>
                  <div className="font-medium text-destructive">
                    {trend.negativeCount} ({trend.negativePercentage}%)
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Positive</div>
                  <div className="font-medium text-success">{trend.positiveCount}</div>
                </div>
              </div>
            </div>

            <Button variant="ghost" size="sm" className="ml-4">
              <Eye className="h-4 w-4" />
            </Button>
          </motion.div>
        ))}

        {trends.length > 5 && (
          <div className="text-center pt-4">
            <Button variant="outline" size="sm">
              View All Trends ({trends.length})
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BrandTrends;
