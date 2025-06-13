'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Lightbulb, 
  MessageCircle, 
  CheckCircle, 
  XCircle, 
  Star, 
  Target, 
  Users, 
  TrendingUp 
} from 'lucide-react';

export default function UsageTips() {
  const goodQuestions = [
    {
      question: "根据美联储报告，当前货币政策的主要目标是什么？",
      category: "政策分析",
      explanation: "具体引用文档来源，问题明确"
    },
    {
      question: "亚当·斯密在《国富论》中如何解释分工的作用？",
      category: "经典理论",
      explanation: "针对特定理论和著作提问"
    },
    {
      question: "世界银行对2024年全球经济增长的预测是什么？",
      category: "数据分析",
      explanation: "寻求具体数据和预测"
    },
    {
      question: "比较凯恩斯主义和新古典主义对失业问题的不同观点",
      category: "理论对比",
      explanation: "要求对比不同学派观点"
    },
    {
      question: "行为经济学如何解释市场中的非理性行为？",
      category: "概念解释",
      explanation: "请求解释现代经济学概念"
    }
  ];

  const badQuestions = [
    {
      question: "曼昆教科书第三章讲了什么？",
      reason: "涉及版权保护内容"
    },
    {
      question: "帮我做作业",
      reason: "缺乏具体问题，过于宽泛"
    },
    {
      question: "给我所有关于经济学的信息",
      reason: "范围过大，无法有效回答"
    },
    {
      question: "这个股票明天会涨吗？",
      reason: "要求投资建议，超出学术范围"
    }
  ];

  const bestPractices = [
    {
      title: "选择相关文档",
      tips: [
        "每次对话选择3-5个相关文档",
        "避免同时选择过多文档影响响应质量",
        "根据问题类型选择对应的文档类别"
      ]
    },
    {
      title: "问题设计",
      tips: [
        "提出具体、明确的问题",
        "可以要求对比不同来源的观点",
        "请求解释经济概念和理论背景",
        "引用具体的文档或数据来源"
      ]
    },
    {
      title: "验证信息",
      tips: [
        "AI回答基于您上传的文档",
        "重要决策前请核实原始资料",
        "鼓励批判性思考",
        "对比多个AI模型的回答"
      ]
    }
  ];

  const economicTopics = [
    { name: "宏观经济政策", count: "26个问题" },
    { name: "微观经济理论", count: "18个问题" },
    { name: "国际贸易", count: "22个问题" },
    { name: "金融市场", count: "31个问题" },
    { name: "经济史", count: "15个问题" },
    { name: "发展经济学", count: "19个问题" }
  ];

  return (
    <div className="space-y-6">
      {/* 使用提示标题 */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">AI对话使用指南</h3>
        <p className="text-gray-600">掌握与经济学AI的高效对话技巧</p>
      </div>

      {/* 好问题示例 */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center text-green-800">
            <CheckCircle className="h-5 w-5 mr-2" />
            推荐的问题示例
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {goodQuestions.map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-green-200">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-medium text-gray-900">"{item.question}"</p>
                  <Badge variant="outline" className="ml-2 text-green-700 border-green-300">
                    {item.category}
                  </Badge>
                </div>
                <p className="text-sm text-green-700">✓ {item.explanation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 避免的问题 */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center text-red-800">
            <XCircle className="h-5 w-5 mr-2" />
            避免的问题类型
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {badQuestions.map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-red-200">
                <p className="font-medium text-gray-900 mb-2">"{item.question}"</p>
                <p className="text-sm text-red-700">✗ {item.reason}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 最佳实践 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="h-5 w-5 mr-2 text-yellow-600" />
            对话最佳实践
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {bestPractices.map((practice, index) => (
              <div key={index} className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <Target className="h-4 w-4 mr-2 text-blue-600" />
                  {practice.title}
                </h4>
                <ul className="space-y-2">
                  {practice.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="text-sm text-gray-600 flex items-start">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 热门经济学话题 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
            热门经济学话题
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {economicTopics.map((topic, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <h4 className="font-semibold text-gray-900 mb-1">{topic.name}</h4>
                <p className="text-sm text-gray-600">{topic.count}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 快速开始建议 */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-800">
            <Lightbulb className="h-5 w-5 mr-2" />
            快速开始建议
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-900">📚 新手入门</h4>
                <p className="text-sm text-blue-800">
                  先上传1-2个基础经济学文档，然后询问基本概念的定义和解释。
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-900">🔬 研究进阶</h4>
                <p className="text-sm text-blue-800">
                  上传相关研究论文，对比不同学者的观点和研究方法。
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-900">📊 政策分析</h4>
                <p className="text-sm text-blue-800">
                  使用政府报告和统计数据，分析当前经济政策的影响和趋势。
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-900">🏛️ 历史对比</h4>
                <p className="text-sm text-blue-800">
                  结合经典著作和现代研究，理解经济理论的历史发展脉络。
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 