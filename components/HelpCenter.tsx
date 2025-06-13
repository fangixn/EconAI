'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  HelpCircle, 
  BookOpen, 
  Upload, 
  Settings, 
  Users, 
  ChevronDown,
  ChevronRight,
  Play,
  FileText,
  Search,
  Zap
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export default function HelpCenter() {
  const [openSections, setOpenSections] = useState<string[]>(['getting-started']);

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const setupSteps = [
    {
      step: "1",
      title: "收集合法资源",
      description: "从政府机构、国际组织和公有领域获取经济学文档",
      details: [
        "下载美联储、世界银行、IMF等官方报告",
        "收集公有领域经典著作（如《国富论》）",
        "获取开放获取的学术论文",
        "确保所有资源符合版权要求"
      ]
    },
    {
      step: "2", 
      title: "上传文档",
      description: "将收集的PDF文档上传到知识库系统",
      details: [
        "支持批量上传多个PDF文件",
        "系统自动提取文本内容",
        "生成向量嵌入以便搜索",
        "建议使用英文文件名"
      ]
    },
    {
      step: "3",
      title: "组织知识库",
      description: "按照经济学分类整理上传的文档",
      details: [
        "宏观经济学：货币政策、财政政策报告",
        "微观经济学：市场结构、消费者行为研究",
        "经济史：经典理论著作",
        "国际经济：贸易、汇率分析报告"
      ]
    },
    {
      step: "4",
      title: "开始对话",
      description: "选择相关文档并开始与AI进行经济学讨论",
      details: [
        "每次选择3-5个相关文档",
        "提出具体明确的问题",
        "对比不同AI模型的回答",
        "验证重要信息的准确性"
      ]
    }
  ];

  const qualityGuidelines = [
    {
      category: "政府机构报告",
      indicators: ["官方发布", "数据权威", "政策可靠"],
      examples: ["美联储FOMC会议纪要", "央行货币政策报告", "统计局经济数据"]
    },
    {
      category: "学术研究",
      indicators: ["同行评议", "引用量高", "方法严谨"],
      examples: ["顶级期刊论文", "知名经济学家研究", "实证分析报告"]
    },
    {
      category: "国际组织",
      indicators: ["权威机构", "全球视野", "多国数据"],
      examples: ["世界银行发展报告", "IMF经济展望", "OECD分析报告"]
    }
  ];

  const economicSchools = [
    {
      name: "新古典主义",
      keyThinkers: ["马歇尔", "萨伊"],
      coreConcepts: ["市场均衡", "理性选择", "边际效用"],
      resources: ["《经济学原理》相关开放文献", "现代货币政策理论文献"]
    },
    {
      name: "凯恩斯主义", 
      keyThinkers: ["凯恩斯", "希克斯"],
      coreConcepts: ["有效需求", "流动性偏好", "乘数效应"],
      resources: ["《就业、利息和货币通论》公有版本", "新凯恩斯主义研究"]
    },
    {
      name: "奥地利学派",
      keyThinkers: ["米塞斯", "哈耶克"],
      coreConcepts: ["主观价值", "企业家精神", "自发秩序"],
      resources: ["米塞斯开放获取作品", "自由市场理论研究"]
    },
    {
      name: "制度经济学",
      keyThinkers: ["科斯", "诺思"],
      coreConcepts: ["交易成本", "产权理论", "制度变迁"],
      resources: ["科斯定理相关研究", "制度经济学开放论文"]
    }
  ];

  const technicalSolutions = [
    {
      title: "自动批量上传脚本",
      description: "使用预写脚本自动下载和上传合法资源",
      code: "npx ts-node scripts/preload-economics-data.ts your-email@example.com",
      features: ["自动下载", "文本提取", "向量嵌入", "批量处理"]
    },
    {
      title: "手动上传界面",
      description: "通过用户界面手动选择和上传文档",
      features: ["多文件选择", "拖拽上传", "进度显示", "分类管理"]
    },
    {
      title: "API批量导入",
      description: "通过编程接口批量导入大量文档",
      features: ["REST API", "批量处理", "状态监控", "错误处理"]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* 帮助中心标题 */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">经济学知识库帮助中心</h2>
        <p className="text-xl text-gray-600">完整的设置指南和最佳实践</p>
      </div>

      {/* 快速开始 */}
      <Collapsible open={openSections.includes('getting-started')}>
        <Card>
          <CollapsibleTrigger 
            className="w-full"
            onClick={() => toggleSection('getting-started')}
          >
            <CardHeader className="hover:bg-gray-50 transition-colors cursor-pointer">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Play className="h-5 w-5 mr-2 text-green-600" />
                  快速开始指南
                </div>
                {openSections.includes('getting-started') ? 
                  <ChevronDown className="h-5 w-5" /> : 
                  <ChevronRight className="h-5 w-5" />
                }
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {setupSteps.map((step) => (
                  <div key={step.step} className="border rounded-lg p-4">
                    <div className="flex items-start mb-3">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                        {step.step}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{step.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                      </div>
                    </div>
                    <ul className="space-y-1 ml-11">
                      {step.details.map((detail, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* 资源质量评估 */}
      <Collapsible open={openSections.includes('quality-assessment')}>
        <Card>
          <CollapsibleTrigger 
            className="w-full"
            onClick={() => toggleSection('quality-assessment')}
          >
            <CardHeader className="hover:bg-gray-50 transition-colors cursor-pointer">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Search className="h-5 w-5 mr-2 text-purple-600" />
                  资源质量评估指南
                </div>
                {openSections.includes('quality-assessment') ? 
                  <ChevronDown className="h-5 w-5" /> : 
                  <ChevronRight className="h-5 w-5" />
                }
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {qualityGuidelines.map((guideline, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">{guideline.category}</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">质量指标：</p>
                        <div className="flex flex-wrap gap-1">
                          {guideline.indicators.map((indicator, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {indicator}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">示例：</p>
                        <ul className="space-y-1">
                          {guideline.examples.map((example, idx) => (
                            <li key={idx} className="text-xs text-gray-600 flex items-start">
                              <div className="w-1 h-1 bg-purple-400 rounded-full mr-2 mt-1.5 flex-shrink-0"></div>
                              {example}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* 经济学派别覆盖 */}
      <Collapsible open={openSections.includes('economic-schools')}>
        <Card>
          <CollapsibleTrigger 
            className="w-full"
            onClick={() => toggleSection('economic-schools')}
          >
            <CardHeader className="hover:bg-gray-50 transition-colors cursor-pointer">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-orange-600" />
                  经济学派别观点覆盖
                </div>
                {openSections.includes('economic-schools') ? 
                  <ChevronDown className="h-5 w-5" /> : 
                  <ChevronRight className="h-5 w-5" />
                }
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {economicSchools.map((school, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{school.name}</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">代表人物：</span>
                        <span className="text-gray-600">{school.keyThinkers.join('、')}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">核心概念：</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {school.coreConcepts.map((concept, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {concept}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">推荐资源：</span>
                        <ul className="mt-1 space-y-1">
                          {school.resources.map((resource, idx) => (
                            <li key={idx} className="text-xs text-gray-600 flex items-start">
                              <div className="w-1 h-1 bg-orange-400 rounded-full mr-2 mt-1.5 flex-shrink-0"></div>
                              {resource}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* 技术实现方案 */}
      <Collapsible open={openSections.includes('technical-solutions')}>
        <Card>
          <CollapsibleTrigger 
            className="w-full"
            onClick={() => toggleSection('technical-solutions')}
          >
            <CardHeader className="hover:bg-gray-50 transition-colors cursor-pointer">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-blue-600" />
                  技术实现方案
                </div>
                {openSections.includes('technical-solutions') ? 
                  <ChevronDown className="h-5 w-5" /> : 
                  <ChevronRight className="h-5 w-5" />
                }
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <div className="space-y-6">
                {technicalSolutions.map((solution, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{solution.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{solution.description}</p>
                    
                    {solution.code && (
                      <div className="bg-gray-100 p-3 rounded-md mb-3">
                        <code className="text-sm text-gray-800">{solution.code}</code>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2">
                      {solution.features.map((feature, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* 常见问题 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <HelpCircle className="h-5 w-5 mr-2 text-gray-600" />
            常见问题
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-gray-900">Q: 可以使用哪些经济学资源？</h4>
              <p className="text-sm text-gray-600 mt-1">
                推荐使用政府机构报告、国际组织出版物、公有领域经典著作和开放获取学术论文。避免使用受版权保护的现代教科书。
              </p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold text-gray-900">Q: 如何确保AI回答的准确性？</h4>
              <p className="text-sm text-gray-600 mt-1">
                建议对比多个AI模型的回答，核实原始文档内容，特别是涉及重要决策的信息。AI回答基于您上传的文档质量。
              </p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-semibold text-gray-900">Q: 每次对话应该选择多少个文档？</h4>
              <p className="text-sm text-gray-600 mt-1">
                建议每次选择3-5个相关文档。选择过多可能影响回答质量，选择过少可能缺乏足够的上下文信息。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 