'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, BookOpen, Building2, GraduationCap, Globe, AlertTriangle } from 'lucide-react';

export default function ResourceRecommendations() {
  const governmentResources = [
    {
      name: "美联储经济报告",
      url: "https://www.federalreserve.gov/publications/",
      description: "美国联邦储备系统官方经济政策报告"
    },
    {
      name: "世界银行开放知识库",
      url: "https://openknowledge.worldbank.org/",
      description: "全球发展经济学权威研究"
    },
    {
      name: "IMF出版物",
      url: "https://www.imf.org/en/Publications",
      description: "国际货币基金组织政策分析"
    },
    {
      name: "中国人民银行工作论文",
      url: "http://www.pbc.gov.cn/",
      description: "中国货币政策官方研究"
    },
    {
      name: "OECD经济展望",
      url: "https://www.oecd.org/economic-outlook/",
      description: "经合组织经济分析预测"
    }
  ];

  const classicWorks = [
    {
      name: "亚当·斯密《国富论》",
      year: "1776",
      source: "Project Gutenberg",
      description: "现代经济学奠基之作"
    },
    {
      name: "大卫·李嘉图《政治经济学及赋税原理》",
      year: "1817",
      description: "比较优势理论经典"
    },
    {
      name: "约翰·穆勒《政治经济学原理》",
      year: "1848",
      description: "古典政治经济学集大成者"
    },
    {
      name: "马克思《资本论》",
      year: "部分版本",
      description: "政治经济学批判经典"
    }
  ];

  const academicSources = [
    {
      name: "RePEc",
      url: "https://www.repec.org/",
      description: "经济学研究论文数据库"
    },
    {
      name: "SSRN经济学板块",
      url: "https://www.ssrn.com/",
      description: "社会科学研究网络"
    },
    {
      name: "arXiv经济学分类",
      url: "https://arxiv.org/list/econ/recent",
      description: "开放获取学术预印本"
    }
  ];

  const avoidResources = [
    "曼昆《经济学原理》",
    "萨缪尔森《经济学》",
    "其他现代商业教科书"
  ];

  return (
    <div className="space-y-6">
      {/* 推荐资源标题 */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">推荐的经济学资源</h3>
        <p className="text-gray-600">合法、权威、免费的经济学知识来源</p>
      </div>

      {/* 政府和国际组织资源 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="h-5 w-5 mr-2 text-blue-600" />
            政府和国际组织免费报告
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {governmentResources.map((resource, index) => (
              <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900">{resource.name}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(resource.url, '_blank')}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-600">{resource.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 公有领域经典著作 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-green-600" />
            公有领域经典著作
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {classicWorks.map((work, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900">{work.name}</h4>
                  <Badge variant="outline">{work.year}</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{work.description}</p>
                {work.source && (
                  <p className="text-xs text-blue-600">来源: {work.source}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 开放获取学术论文 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <GraduationCap className="h-5 w-5 mr-2 text-purple-600" />
            开放获取学术论文
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {academicSources.map((source, index) => (
              <div key={index} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <h4 className="font-semibold text-gray-900">{source.name}</h4>
                  <p className="text-sm text-gray-600">{source.description}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(source.url, '_blank')}
                  className="ml-4"
                >
                  访问 <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 不建议使用的资源 */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center text-orange-800">
            <AlertTriangle className="h-5 w-5 mr-2" />
            不建议使用的资源
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-orange-700 mb-3">
            以下资源可能涉及版权侵权，请避免使用：
          </p>
          <div className="space-y-2">
            {avoidResources.map((resource, index) => (
              <div key={index} className="flex items-center text-sm text-orange-800">
                <div className="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
                {resource}
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-orange-100 rounded-lg">
            <p className="text-xs text-orange-800">
              ⚠️ <strong>风险提示：</strong>使用受版权保护的教科书可能涉及法律风险，建议选择上述推荐的合法资源。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 