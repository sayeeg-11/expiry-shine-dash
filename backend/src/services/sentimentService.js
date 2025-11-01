const Sentiment = require('sentiment');

class SentimentService {
  constructor() {
    this.sentiment = new Sentiment();
  }

  // Analyze sentiment of feedback text
  analyzeSentiment(text) {
    const result = this.sentiment.analyze(text);

    // Determine sentiment label based on score
    let sentimentLabel = 'neutral';
    if (result.score > 0.5) sentimentLabel = 'positive';
    else if (result.score < -0.5) sentimentLabel = 'negative';

    return {
      score: result.score,
      comparative: result.comparative,
      label: sentimentLabel,
      tokens: result.tokens,
      words: result.words,
      positive: result.positive,
      negative: result.negative
    };
  }

  // Check if feedback indicates a negative trend (for brand monitoring)
  isNegativeTrend(feedback) {
    const analysis = this.analyzeSentiment(feedback);
    return analysis.label === 'negative';
  }

  // Aggregate sentiment data for brand analysis
  aggregateBrandSentiment(feedbacks) {
    if (!feedbacks || feedbacks.length === 0) {
      return {
        totalFeedbacks: 0,
        averageScore: 0,
        negativeCount: 0,
        positiveCount: 0,
        neutralCount: 0,
        negativePercentage: 0,
        trend: 'neutral'
      };
    }

    const totalFeedbacks = feedbacks.length;
    const scores = feedbacks.map(f => f.sentimentScore || 0);
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / totalFeedbacks;

    const sentimentCounts = feedbacks.reduce((counts, feedback) => {
      const label = feedback.sentimentLabel || 'neutral';
      counts[label] = (counts[label] || 0) + 1;
      return counts;
    }, { positive: 0, negative: 0, neutral: 0 });

    const negativePercentage = (sentimentCounts.negative / totalFeedbacks) * 100;

    // Determine trend based on negative percentage and average score
    let trend = 'neutral';
    if (negativePercentage > 30 || averageScore < -0.3) {
      trend = 'negative';
    } else if (negativePercentage < 10 && averageScore > 0.3) {
      trend = 'positive';
    }

    return {
      totalFeedbacks,
      averageScore: Math.round(averageScore * 100) / 100,
      negativeCount: sentimentCounts.negative,
      positiveCount: sentimentCounts.positive,
      neutralCount: sentimentCounts.neutral,
      negativePercentage: Math.round(negativePercentage * 100) / 100,
      trend
    };
  }
}

module.exports = new SentimentService();
