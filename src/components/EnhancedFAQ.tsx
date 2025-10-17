import React, { useState } from 'react';
import { ChevronDown, ChevronUp, TrendingUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
  statistic?: string;
  peopleAlsoAsk?: string[];
}

const enhancedFaqData: FAQItem[] = [
  {
    category: "Pricing & Costs",
    question: "How much does a home renovation cost in Los Angeles in 2024?",
    answer: "Based on 2024 market data, home renovation costs in Los Angeles typically range from $50,000 to $200,000 depending on project scope. According to HomeAdvisor, the average kitchen remodel costs $25,000-$75,000, while bathroom renovations run $15,000-$40,000. Full home renovations average $100-$300 per square foot. These prices reflect current material costs and labor rates in the Los Angeles market. We provide free detailed estimates tailored to your specific project requirements, ensuring transparent pricing with no hidden fees.",
    statistic: "Average LA kitchen remodel: $45,000 (2024)",
    peopleAlsoAsk: [
      "What's the ROI on kitchen remodeling?",
      "Are construction costs going down in 2024?",
      "How to budget for unexpected renovation costs?"
    ]
  },
  {
    category: "Timeline & Process",
    question: "How long does a typical home renovation take from start to finish?",
    answer: "Most home renovations take 8-16 weeks from start to finish, according to industry standards. Kitchen remodels typically require 4-8 weeks, bathroom renovations 3-6 weeks, and room additions 12-20 weeks. The National Association of Home Builders reports that 68% of projects finish within the estimated timeline when working with licensed contractors. Timeline depends on project complexity, permit approvals (which take 2-4 weeks in LA County), and material availability. We provide a detailed schedule during your consultation and send weekly progress updates.",
    statistic: "68% of projects finish on time with licensed contractors",
