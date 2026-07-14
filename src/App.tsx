/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  motion, 
  AnimatePresence 
} from "motion/react";
import { 
  Globe, 
  TrendingUp, 
  Coins, 
  ShieldAlert, 
  Users, 
  Award, 
  Activity, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  Search, 
  Building2, 
  Sparkles, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  HelpCircle, 
  RefreshCw, 
  AlertCircle, 
  AlertTriangle, 
  LineChart, 
  DollarSign, 
  Ship,
  Sparkle,
  BookOpen,
  Calendar,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';

// Defining our types for complete type safety
interface Influencer {
  name: string;
  handle: string;
  platform: string;
  subscribers: string;
  engagementRate: string;
  contentStyle: string;
  matchingReason: string;
  marketingStrategy: string;
}

interface AnomalyPoint {
  title: string;
  description: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

interface AnalysisResult {
  marketAnalysis: {
    recommendedReasons: string;
    tariffsAndRegulations: string;
    marketScore: number;
  };
  influencerMatch: {
    influencers: Influencer[];
    summaryStrategy: string;
  };
  supplyChainMonitoring: {
    anomalyPoints: AnomalyPoint[];
    riskResponse: string;
    tradeAlertLevel: 'SAFE' | 'WARNING' | 'CRITICAL';
  };
  aiGenerated?: boolean;
  usedModel?: string;
  fallbackReason?: string;
}

interface SavedHistory {
  id: string;
  timestamp: string;
  companyName: string;
  productCategory: string;
  targetCountry: string;
  result: AnalysisResult;
}

// Pre-defined sample profiles to let users experience OBICON's AI engine instantly
const SAMPLE_PROFILES = [
  {
    companyName: "(주)케이스타 코스메틱",
    productCategory: "천연 어성초 트러블 스킨케어 패드",
    productDescription: "민감성 피부를 진정시키고 모공을 정돈하는 식물성 유기농 진정 어성초 토너 패드. 국내 올리브영 판매 랭킹 상위권 제품으로 가볍고 밀착력이 우수한 저자극 패드형 화장품.",
    priceRange: "Wholesale $12 - Retail $28",
    targetCountry: "일본 (도쿄/오사카 유통 타겟)",
    customsCondition: "FOB 인천 (RCEP 특혜 원산지 증명 적용 희망)"
  },
  {
    companyName: "한울 글로벌 푸드",
    productCategory: "매운 김치볶음 즉석 건면 라면",
    productDescription: "기존의 고칼로리 튀긴 면 대신 생면 건조 공법을 사용하여 트랜스지방을 제로화한 다이어트 웰빙 김치 볶음면. 매콤한 특제 김치 소스와 바삭한 대파 후레이크 첨부.",
    priceRange: "Wholesale $1.50 - Retail $3.90",
    targetCountry: "베트남 (호치민/하노이 프리미엄 마트 타겟)",
    customsCondition: "CIF 호치민 (VKFTA 원산지 증명 및 자가선언 대행 필요)"
  },
  {
    companyName: "(주)에코홈 테크",
    productCategory: "원격 제어 저소음 스마트 써큘레이터",
    productDescription: "강력한 BLDC 모터를 탑재해 미세한 24단계 풍량 미풍 조정이 가능하며 모바일 앱으로 연동 제어되는 에코 리빙 무선 써큘레이터. 가성비 높은 미니멀 화이트 디자인.",
    priceRange: "Wholesale $42 - Retail $89",
    targetCountry: "일본 (라쿠텐 및 로프트 입점 희망)",
    customsCondition: "FOB 부산 (일본 PSE 무선 안전 인증 확보 완료)"
  }
];

export default function App() {
  // Input form states
  const [companyName, setCompanyName] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [targetCountry, setTargetCountry] = useState('일본');
  const [customsCondition, setCustomsCondition] = useState('FOB');

  // Interactive UI states
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'visual' | 'official_text'>('visual');
  const [history, setHistory] = useState<SavedHistory[]>([]);
  
  // Campaign Simulation states
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);
  const [campaignBudget, setCampaignBudget] = useState<number>(3000000); // 3,000,000 KRW
  const [productPrice, setProductPrice] = useState<number>(35000); // 35,000 KRW
  const [roiCalculated, setRoiCalculated] = useState<any>(null);

  // Load history from localStorage on startup
  useEffect(() => {
    const saved = localStorage.getItem('obicon_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load search history", e);
      }
    }
  }, []);

  // Set default selected influencer whenever a new result is loaded
  useEffect(() => {
    if (result && result.influencerMatch.influencers.length > 0) {
      setSelectedInfluencer(result.influencerMatch.influencers[0]);
    } else {
      setSelectedInfluencer(null);
    }
  }, [result]);

  // Calculate campaign ROI simulation
  useEffect(() => {
    if (!selectedInfluencer) {
      setRoiCalculated(null);
      return;
    }

    // Convert follower strings into actual values
    // e.g. "48만 명" -> 480,000, "110만 명" -> 1,100,000
    let followers = 300000;
    const subStr = selectedInfluencer.subscribers;
    if (subStr.includes('만')) {
      followers = parseFloat(subStr.replace(/[^0-9.]/g, '')) * 10000;
    } else if (subStr.includes('K')) {
      followers = parseFloat(subStr.replace(/[^0-9.]/g, '')) * 1000;
    } else if (subStr.includes('M')) {
      followers = parseFloat(subStr.replace(/[^0-9.]/g, '')) * 1000000;
    }

    // Convert engagement rate e.g. "5.6%" -> 0.056
    const rateStr = selectedInfluencer.engagementRate;
    const engagementRate = parseFloat(rateStr.replace(/[^0-9.]/g, '')) / 100 || 0.05;

    // Simulation math
    // 1. Estimated video views: based on subscriber size and average short-form viral coefficient
    const estimatedViews = Math.round(followers * (0.15 + Math.random() * 0.1) + (campaignBudget / 10));
    
    // 2. Click rate (CTR): Based on engagement rate
    const ctr = engagementRate * 0.12; // average conversion from engagement to link click is ~12%
    const estimatedClicks = Math.round(estimatedViews * ctr);

    // 3. Conversion Rate (CR): standard e-commerce conversion rate (1% to 3.5%)
    const conversionRate = 0.018 + (engagementRate * 0.1); 
    const estimatedSalesVolume = Math.round(estimatedClicks * conversionRate);
    const estimatedRevenue = estimatedSalesVolume * productPrice;

    // 4. Return on Ad Spend (ROAS)
    const roas = Math.round((estimatedRevenue / campaignBudget) * 100);

    setRoiCalculated({
      estimatedViews,
      estimatedClicks,
      estimatedSalesVolume,
      estimatedRevenue,
      roas,
      ctr: (ctr * 100).toFixed(2) + "%",
      cr: (conversionRate * 100).toFixed(2) + "%",
      cpc: Math.round(campaignBudget / estimatedClicks) + " 원"
    });

  }, [selectedInfluencer, campaignBudget, productPrice]);

  // Handle Loading Animation Steps
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep(prev => {
          if (prev < 3) return prev + 1;
          return prev;
        });
      }, 1500);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Preset quick fill
  const loadSample = (sample: typeof SAMPLE_PROFILES[0]) => {
    setCompanyName(sample.companyName);
    setProductCategory(sample.productCategory);
    setProductDescription(sample.productDescription);
    setPriceRange(sample.priceRange);
    setTargetCountry(sample.targetCountry.includes("일본") ? "일본" : "베트남");
    setCustomsCondition(sample.customsCondition.split(' ')[0]);
  };

  // Submit profile to AI Engine API
  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productCategory) {
      alert("제품 카테고리는 필수 기입 사항입니다.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName,
          productCategory,
          productDescription,
          priceRange,
          targetCountry,
          customsCondition,
        }),
      });

      if (!response.ok) {
        throw new Error("서버 에러가 발생했습니다.");
      }

      const data = await response.json();
      setResult(data);

      // Save to local history
      const newHistoryItem: SavedHistory = {
        id: Math.random().toString(36).substring(7),
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        companyName: companyName || '일반 수출사',
        productCategory,
        targetCountry,
        result: data
      };

      const updatedHistory = [newHistoryItem, ...history.slice(0, 9)];
      setHistory(updatedHistory);
      localStorage.setItem('obicon_history', JSON.stringify(updatedHistory));

    } catch (err) {
      console.error(err);
      alert("무역 분석 진행 중 오류가 발생했습니다. 로컬 대체 엔진 모드를 준비합니다.");
    } finally {
      setLoading(false);
    }
  };

  // Delete an item from history
  const deleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem('obicon_history', JSON.stringify(updated));
  };

  // Assemble the exact requested Korean format in a single string for copy-paste
  const getFormattedReportText = () => {
    if (!result) return "";
    return `### 1. 타겟 시장 분석 및 큐레이션
- 추천 이유 및 KOTRA 기반 시장 동향:
${result.marketAnalysis.recommendedReasons}

- 적용 가능한 관세 및 규제 요약:
${result.marketAnalysis.tariffsAndRegulations}

### 2. 최적 인플루언서 매칭 가이드
- 가상/실제 인플루언서 추천 조건 (숏폼 채널 및 콘텐츠 방향성):
${result.influencerMatch.influencers.map((inf, i) => 
  `  * 추천 인플루언서 ${i+1}: ${inf.name} (${inf.handle} | ${inf.platform} | 구독자 ${inf.subscribers})
    - 콘텐츠 방향성: ${inf.contentStyle}
    - 매칭 이유: ${inf.matchingReason}`
).join('\n')}

- 예상 인게이지먼트 및 마케팅 전략:
${result.influencerMatch.influencers.map((inf, i) => 
  `  * ${inf.name} 마케팅 전략:
    - 마케팅 포지셔닝: ${inf.marketingStrategy}`
).join('\n')}
  * 전반적 채널 믹스 요약: ${result.influencerMatch.summaryStrategy}

### 3. 공급망 신뢰성 모니터링 요약
- 거래 환경 이상 징후 모니터링 포인트:
${result.supplyChainMonitoring.anomalyPoints.map((point, i) => 
  `  * [위험지수: ${point.riskLevel}] ${point.title}
    - 상세 모니터링 수치: ${point.description}`
).join('\n')}

- 예상 피드백 및 리스크 대응 방안:
${result.supplyChainMonitoring.riskResponse}`;
  };

  // Copy to clipboard helper
  const handleCopy = () => {
    navigator.clipboard.writeText(getFormattedReportText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] font-sans antialiased">
      {/* Sleek, professional top-navigation bar representing the OBICON Platform */}
      <header id="obicon-header" className="sticky top-0 z-50 bg-[#0f172a] text-white border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 text-white p-2 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Sparkle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="font-display font-bold text-2xl tracking-wider text-white">
                OBICON
              </span>
              <span className="hidden sm:inline-block ml-3 px-2 py-0.5 text-[10px] uppercase font-mono tracking-widest bg-blue-500/20 text-blue-400 rounded-md border border-blue-500/30">
                AI Trade Engine v3.5
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-sm">
            <div className="hidden md:flex items-center space-x-2 text-slate-300 font-mono text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>K-무역협회 API 연동 활성</span>
            </div>
            <div className="text-slate-400 font-mono text-xs">
              UTC {new Date().toISOString().slice(0, 10)}
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner with brief platform description */}
        <div className="mb-8 bg-gradient-to-r from-blue-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 max-w-3xl">
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mb-2">
              수출 소상공인 & 인플루언서 지능형 실시간 매칭 플랫폼
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              오비콘은 수출 중소기업 및 공공기관의 MyData와 글로벌 숏폼 크리에이터 채널 마이데이터를 결합하고, 
              KOTRA 해외시장 데이터베이스 및 국가별 세관/물류 이상 징후 표준값을 실시간 학습하여 최적의 수출 돌파구와 공급망 리스크 스크리닝을 제공합니다.
            </p>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Input profile (4 cols) */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            
            {/* Quick Presets Section */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  신속 무역 컨설팅 시나리오 로드
                </h3>
              </div>
              <div className="space-y-2.5">
                {SAMPLE_PROFILES.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => loadSample(sample)}
                    className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-blue-500/30 hover:bg-blue-50/50 transition-all group flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="font-semibold text-xs text-blue-700">{sample.companyName}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 rounded text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                        {sample.targetCountry.split(' ')[0]}
                      </span>
                    </div>
                    <span className="text-xs text-slate-600 line-clamp-1">{sample.productCategory}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* SME Exporter Profile Form */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  수요 수출 기업 마이데이터
                </h2>
                <span className="text-xs text-slate-400 font-mono">STEP 01</span>
              </div>

              <form onSubmit={handleAnalyze} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    수출 기업명 <span className="text-slate-400">(선택)</span>
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="예: 주식회사 한국글로벌텍"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      목표 대상국 <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={targetCountry}
                      onChange={(e) => setTargetCountry(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none bg-white transition-colors"
                    >
                      <option value="일본">일본 (Japan)</option>
                      <option value="베트남">베트남 (Vietnam)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      수출 관세 조건 <span className="text-slate-400">(선택)</span>
                    </label>
                    <select
                      value={customsCondition}
                      onChange={(e) => setCustomsCondition(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none bg-white transition-colors"
                    >
                      <option value="FOB">FOB (인천/부산항)</option>
                      <option value="CIF">CIF (목적국 입항)</option>
                      <option value="DDP">DDP (관세포함 인도)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    대표 제품 카테고리 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={productCategory}
                    onChange={(e) => setProductCategory(e.target.value)}
                    placeholder="예: 천연 유기농 에센스, 즉석 쌀떡볶이 등"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    예상 수출 도매 단가 및 비용 요건 <span className="text-slate-400">(선택)</span>
                  </label>
                  <input
                    type="text"
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    placeholder="예: Wholesale $10 ~ Retail $25"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    제품 상세 정보 및 마케팅 소구 포인트
                  </label>
                  <textarea
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    rows={4}
                    placeholder="해당 수출 제품의 주요 강점 및 목표 바이어/오디언스의 성격에 관한 정보를 기입해 주십시오."
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/15 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>오비콘 AI 연산 가동 중...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>AI 매칭 및 공급망 모니터링 가동</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* History logs card */}
            {history.length > 0 && (
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    최근 Trade-Matching 이력 ({history.length})
                  </h3>
                </div>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setResult(item.result)}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between text-xs group ${
                        result === item.result 
                          ? 'border-blue-500 bg-blue-50/40 text-blue-900 font-medium' 
                          : 'border-slate-100 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex-1 truncate pr-2">
                        <div className="font-semibold truncate">{item.companyName}</div>
                        <div className="text-[10px] text-slate-500 truncate mt-0.5">
                          {item.productCategory} ({item.targetCountry})
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] text-slate-400 font-mono shrink-0">{item.timestamp}</span>
                        <button
                          onClick={(e) => deleteHistoryItem(item.id, e)}
                          className="text-slate-300 hover:text-red-500 p-1 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Output display & widgets (7-8 cols) */}
          <div className="lg:col-span-7 xl:col-span-8">
            
            {/* INITIAL EMPTY STATE */}
            {!loading && !result && (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-sm">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <Globe className="w-10 h-10 animate-bounce" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3 font-display">
                    무역 큐레이션 및 인플루언서 매치 대기 중
                  </h2>
                  <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                    기업의 정보와 목표 진출 시장(일본/베트남)을 선택하면 AI 엔진이 
                    관련 관세 표준 규제 조건 매칭, 맞춤 크리에이터 발굴 및 리스크 모니터링을 실시간 리포팅합니다.
                  </p>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-left space-y-3">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-blue-500" />
                      실시간 오픈 데이터 통합 인프라
                    </h4>
                    <ul className="text-xs text-slate-600 space-y-2">
                      <li className="flex items-start gap-1.5">
                        <span className="text-blue-500 mt-0.5">•</span>
                        <span>**KOTRA** 국외 무역관 해외시장 뉴스 데이터셋 기학습</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-blue-500 mt-0.5">•</span>
                        <span>**RCEP / VKFTA / AKFTA** 관세 특혜 지능형 스캐너</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-blue-500 mt-0.5">•</span>
                        <span>**일본 PMDA / 베트남 MOH** 수입 인허가 적합 검정 시뮬레이터</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={() => loadSample(SAMPLE_PROFILES[0])}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200/80 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <span>1번 케이스타 뷰티 샘플 자동 채우기</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* LOADING STATE */}
            {loading && (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-sm text-center">
                <div className="max-w-lg mx-auto">
                  <div className="relative w-24 h-24 mx-auto mb-8">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin"></div>
                    <div className="absolute inset-2 bg-blue-50 rounded-full flex items-center justify-center shadow-inner">
                      <Sparkles className="w-8 h-8 text-blue-600 animate-pulse" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-800 mb-2">
                    오비콘 인프라 데이터 및 AI 추론 모델 병합 중
                  </h3>
                  <p className="text-slate-400 text-xs mb-8">국내외 무역 장벽 표준값 및 실시간 크리에이터 SNS 마이데이터 필터링</p>

                  <div className="space-y-3.5 text-left bg-slate-50 rounded-2xl p-5 border border-slate-100 font-mono text-xs">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${loadingStep >= 0 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                        {loadingStep > 0 ? <Check className="w-2.5 h-2.5" /> : "1"}
                      </div>
                      <span className={`${loadingStep >= 0 ? 'text-slate-800 font-semibold' : 'text-slate-400'}`}>
                        [KOTRA] 일본/베트남 해외시장성 분석 및 트렌드 데이터 수집 중...
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${loadingStep >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                        {loadingStep > 1 ? <Check className="w-2.5 h-2.5" /> : "2"}
                      </div>
                      <span className={`${loadingStep >= 1 ? 'text-slate-800 font-semibold' : 'text-slate-400'}`}>
                        [세관/협정] RCEP/VKFTA 원산지 특혜 세율 및 PMDA/MOH 규제 대조...
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${loadingStep >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                        {loadingStep > 2 ? <Check className="w-2.5 h-2.5" /> : "3"}
                      </div>
                      <span className={`${loadingStep >= 2 ? 'text-slate-800 font-semibold' : 'text-slate-400'}`}>
                        [인플루언서] 숏폼 채널 마이데이터 기반 인게이지먼트 최적화 매칭...
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${loadingStep >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                        {loadingStep >= 3 ? <Check className="w-2.5 h-2.5" /> : "4"}
                      </div>
                      <span className={`${loadingStep >= 3 ? 'text-slate-800 font-semibold animate-pulse' : 'text-slate-400'}`}>
                        [오비콘 AI] 종합 마케팅 리스크 리포트 인포그래픽 구성 완료...
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* RESULTS SCREEN */}
            {result && !loading && (
              <div className="space-y-6">
                
                {/* Result Top Alert banner detailing engine metrics */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shadow-inner">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800 text-sm">성공적으로 분석이 도출되었습니다</div>
                      <div className="text-slate-500 text-xs">
                        {result.aiGenerated 
                          ? `실시간 Gemini 3.5 추론 가동 (${result.usedModel})` 
                          : `${result.fallbackReason || '오비콘 지식 정보 템플릿 사용'}`}
                      </div>
                    </div>
                  </div>

                  <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button
                      onClick={() => setActiveTab('visual')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                        activeTab === 'visual' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      그래픽 대시보드
                    </button>
                    <button
                      onClick={() => setActiveTab('official_text')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                        activeTab === 'official_text' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      표준 수출 보고서 텍스트
                    </button>
                  </div>
                </div>

                {/* GRAPHIC VIEW TAB */}
                {activeTab === 'visual' && (
                  <div className="space-y-6">
                    
                    {/* Market Score Card & Market Analysis */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Globe className="w-5 h-5 text-blue-600" />
                          <h3 className="font-bold text-slate-800">1. 타겟 시장 분석 및 큐레이션 (KOTRA & 관세)</h3>
                        </div>
                        <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                          <span>시장성 매력도:</span>
                          <span className="font-mono text-sm">{result.marketAnalysis.marketScore}</span>
                          <span>/ 100</span>
                        </div>
                      </div>

                      <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
                        {/* Interactive gauge */}
                        <div className="md:col-span-4 flex flex-col items-center justify-center border-r border-slate-100/80 pr-2">
                          <div className="relative w-32 h-32 flex items-center justify-center">
                            {/* Inner score dial */}
                            <svg className="w-full h-full transform -rotate-90">
                              <circle
                                cx="64"
                                cy="64"
                                r="48"
                                stroke="#f1f5f9"
                                strokeWidth="8"
                                fill="transparent"
                              />
                              <circle
                                cx="64"
                                cy="64"
                                r="48"
                                stroke={result.marketAnalysis.marketScore >= 90 ? "#10b981" : "#3b82f6"}
                                strokeWidth="8"
                                fill="transparent"
                                strokeDasharray={Math.PI * 2 * 48}
                                strokeDashoffset={Math.PI * 2 * 48 * (1 - result.marketAnalysis.marketScore / 100)}
                                className="transition-all duration-1000 ease-out"
                              />
                            </svg>
                            <div className="absolute flex flex-col items-center justify-center">
                              <span className="font-display font-bold text-3xl text-slate-800">{result.marketAnalysis.marketScore}</span>
                              <span className="text-[10px] text-slate-400 font-mono tracking-wider">MARKET SCORE</span>
                            </div>
                          </div>
                          <div className="text-center mt-3">
                            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                              {result.marketAnalysis.marketScore >= 92 ? "최상위 추천 등급" : "진출 유망 등급"}
                            </span>
                          </div>
                        </div>

                        {/* Analysis contents with nice headers */}
                        <div className="md:col-span-8 space-y-4">
                          <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                              <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                              추천 이유 및 KOTRA 기반 시장 동향
                            </h4>
                            <div className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 whitespace-pre-wrap">
                              {result.marketAnalysis.recommendedReasons}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                              <Coins className="w-3.5 h-3.5 text-blue-500" />
                              적용 가능한 관세 및 수입 규제 요약
                            </h4>
                            <div className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 whitespace-pre-wrap">
                              {result.marketAnalysis.tariffsAndRegulations}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Influencer Matchings */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-blue-600" />
                          <h3 className="font-bold text-slate-800">2. 최적 인플루언서 매칭 가이드</h3>
                        </div>
                        <span className="text-xs text-slate-400">숏폼 특화 MyData 매칭</span>
                      </div>

                      <div className="p-6 space-y-6">
                        {/* Channel list */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {result.influencerMatch.influencers.map((influencer, i) => (
                            <div 
                              key={i} 
                              onClick={() => setSelectedInfluencer(influencer)}
                              className={`p-4 rounded-xl border transition-all cursor-pointer text-left relative ${
                                selectedInfluencer?.handle === influencer.handle 
                                  ? 'border-blue-500 bg-blue-50/30 ring-1 ring-blue-500' 
                                  : 'border-slate-100 hover:border-slate-300'
                              }`}
                            >
                              <div className="absolute top-3 right-3 text-xs font-mono font-semibold px-2 py-0.5 bg-blue-100/60 text-blue-700 rounded">
                                Match #{i+1}
                              </div>
                              
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700">
                                  {influencer.name.slice(0, 2)}
                                </div>
                                <div>
                                  <h4 className="font-semibold text-slate-800 text-sm">{influencer.name}</h4>
                                  <span className="text-slate-500 text-xs font-mono">{influencer.handle}</span>
                                </div>
                              </div>

                              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-center mb-3">
                                <div>
                                  <div className="text-[9px] text-slate-400 font-bold uppercase">Platform</div>
                                  <div className="text-xs font-bold text-blue-700">{influencer.platform}</div>
                                </div>
                                <div>
                                  <div className="text-[9px] text-slate-400 font-bold uppercase">Followers</div>
                                  <div className="text-xs font-bold text-slate-800">{influencer.subscribers}</div>
                                </div>
                                <div>
                                  <div className="text-[9px] text-slate-400 font-bold uppercase">Engagement</div>
                                  <div className="text-xs font-bold text-emerald-600">{influencer.engagementRate}</div>
                                </div>
                              </div>

                              <div className="space-y-1.5 text-xs">
                                <div>
                                  <strong className="text-slate-500">콘텐츠 패턴:</strong> 
                                  <p className="text-slate-700 text-[11px] line-clamp-2">{influencer.contentStyle}</p>
                                </div>
                                <div>
                                  <strong className="text-slate-500">추천 근거:</strong>
                                  <p className="text-slate-700 text-[11px] line-clamp-2">{influencer.matchingReason}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Selection-specific strategy expansion */}
                        {selectedInfluencer && (
                          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">
                              <Award className="w-4 h-4" />
                              <span>{selectedInfluencer.name} 상세 인게이지먼트 & 마케팅 전략</span>
                            </div>
                            <div className="space-y-3 text-xs leading-relaxed text-slate-700">
                              <p className="font-semibold text-slate-800 bg-white px-3 py-1.5 rounded border border-slate-100">
                                🚀 시나리오: "{selectedInfluencer.marketingStrategy}"
                              </p>
                              <div>
                                <strong className="text-slate-600">콘텐츠 디렉션 상세:</strong> {selectedInfluencer.contentStyle}
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100/50">
                          <h4 className="text-xs font-bold text-blue-800 mb-1">💡 전반적 해외 숏폼 채널 믹스 가이드</h4>
                          <p className="text-xs text-blue-900 leading-relaxed">{result.influencerMatch.summaryStrategy}</p>
                        </div>
                      </div>
                    </div>

                    {/* Trade Simulation Sandbox Widget (Extremely interactive) */}
                    {selectedInfluencer && roiCalculated && (
                      <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-2xl p-6 shadow-lg relative overflow-hidden border border-slate-800">
                        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl"></div>
                        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-6">
                          <div className="flex items-center gap-2">
                            <LineChart className="w-5 h-5 text-blue-400" />
                            <h3 className="font-bold text-sm sm:text-base tracking-tight text-white">오비콘 수출 ROI & 캠페인 시뮬레이터</h3>
                          </div>
                          <span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded font-mono">SANDBOX ACTIVE</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                          {/* Left inputs */}
                          <div className="md:col-span-5 space-y-4">
                            <div>
                              <label className="block text-[11px] text-slate-400 font-bold mb-1.5">
                                캠페인 예산 (원)
                              </label>
                              <input
                                type="number"
                                step="500000"
                                min="1000000"
                                max="20000000"
                                value={campaignBudget}
                                onChange={(e) => setCampaignBudget(Number(e.target.value))}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                              />
                              <span className="text-[10px] text-slate-400 mt-1 block">{(campaignBudget / 10000).toLocaleString()} 만 원</span>
                            </div>

                            <div>
                              <label className="block text-[11px] text-slate-400 font-bold mb-1.5">
                                제품 현지 정가 (원 상당)
                              </label>
                              <input
                                type="number"
                                step="5000"
                                min="10000"
                                max="500000"
                                value={productPrice}
                                onChange={(e) => setProductPrice(Number(e.target.value))}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                              />
                            </div>

                            <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 text-xs">
                              <span className="text-slate-400 block mb-1">인플루언서 기준 정보</span>
                              <div className="flex justify-between font-mono text-[11px] text-slate-300">
                                <span>{selectedInfluencer.name}</span>
                                <span className="text-emerald-400">구독률 {selectedInfluencer.subscribers}</span>
                              </div>
                            </div>
                          </div>

                          {/* Right outputs */}
                          <div className="md:col-span-7 bg-slate-950/40 border border-slate-800 rounded-2xl p-5 grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-[10px] text-slate-400 block">예상 총 조회수 (Views)</span>
                              <strong className="text-lg font-mono text-white">
                                {roiCalculated.estimatedViews.toLocaleString()} <span className="text-xs">회</span>
                              </strong>
                            </div>

                            <div>
                              <span className="text-[10px] text-slate-400 block">예상 링크 클릭수 (Clicks)</span>
                              <strong className="text-lg font-mono text-blue-400">
                                {roiCalculated.estimatedClicks.toLocaleString()} <span className="text-xs">회</span>
                              </strong>
                              <span className="text-[9px] text-slate-500 block">클릭율 CTR {roiCalculated.ctr}</span>
                            </div>

                            <div className="border-t border-slate-800/60 pt-2.5 col-span-2"></div>

                            <div>
                              <span className="text-[10px] text-slate-400 block">예상 전환 판매량 (Export Sales)</span>
                              <strong className="text-lg font-mono text-emerald-400">
                                {roiCalculated.estimatedSalesVolume.toLocaleString()} <span className="text-xs">건</span>
                              </strong>
                              <span className="text-[9px] text-slate-500 block">구매전환율 CR {roiCalculated.cr}</span>
                            </div>

                            <div>
                              <span className="text-[10px] text-slate-400 block">예상 총 수출 실적 (Revenue)</span>
                              <strong className="text-lg font-mono text-white">
                                {roiCalculated.estimatedRevenue.toLocaleString()} <span className="text-xs">원</span>
                              </strong>
                              <span className="text-[10px] text-blue-400 block font-bold font-mono">ROAS {roiCalculated.roas}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Supply Chain Trustworthiness Monitoring */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ShieldAlert className="w-5 h-5 text-blue-600" />
                          <h3 className="font-bold text-slate-800">3. 공급망 신뢰성 모니터링 요약</h3>
                        </div>
                        <div className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase font-mono flex items-center gap-1 ${
                          result.supplyChainMonitoring.tradeAlertLevel === 'SAFE' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : result.supplyChainMonitoring.tradeAlertLevel === 'WARNING'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          <AlertCircle className="w-3 h-3" />
                          <span>거래 경보: {result.supplyChainMonitoring.tradeAlertLevel === 'SAFE' ? '안전 (SAFE)' : result.supplyChainMonitoring.tradeAlertLevel === 'WARNING' ? '주의 (WARNING)' : '경고 (CRITICAL)'}</span>
                        </div>
                      </div>

                      <div className="p-6 space-y-6">
                        {/* Anomalies list */}
                        <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                            거래 환경 이상 징후 모니터링 포인트
                          </h4>
                          <div className="space-y-3">
                            {result.supplyChainMonitoring.anomalyPoints.map((point, i) => (
                              <div key={i} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-start gap-3">
                                <div className={`mt-0.5 px-2 py-0.5 rounded text-[9px] font-mono font-bold shrink-0 ${
                                  point.riskLevel === 'HIGH' ? 'bg-rose-100 text-rose-700' : point.riskLevel === 'MEDIUM' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {point.riskLevel} RISK
                                </div>
                                <div className="text-left text-xs">
                                  <strong className="block text-slate-800 text-sm mb-0.5">{point.title}</strong>
                                  <p className="text-slate-600 leading-relaxed">{point.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Mitigation plan */}
                        <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                            <Ship className="w-3.5 h-3.5 text-blue-500" />
                            예상 피드백 및 리스크 대응 방안
                          </h4>
                          <div className="text-sm text-slate-700 leading-relaxed bg-blue-50/30 p-4 rounded-xl border border-blue-100/50 whitespace-pre-wrap">
                            {result.supplyChainMonitoring.riskResponse}
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* TEXT VIEW TAB (Strict matching output format) */}
                {activeTab === 'official_text' && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm text-left">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <h3 className="font-bold text-slate-800 text-base">오비콘 공식 수출 지원 보고서</h3>
                      </div>
                      
                      <button
                        onClick={handleCopy}
                        className="px-4 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>복사 완료!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>보고서 전체 복사</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-slate-500 text-xs mb-6">
                      * 아래의 정보는 사용자의 요청에 의해 오비콘(OBICON) AI 엔진이 도출한 양식에 맞춘 텍스트입니다. 보고서 작성용으로 바로 붙여넣기 하실 수 있습니다.
                    </p>

                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 font-mono text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed max-h-[600px] overflow-y-auto select-all">
                      {getFormattedReportText()}
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>

        </div>
      </main>

      {/* Footer detailing the program boundaries */}
      <footer className="border-t border-slate-200 bg-white mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2 text-slate-400 text-xs">
          <div>© 2026 OBICON (오비콘) AI-based Global Trade Platform. All rights reserved.</div>
          <div className="font-mono">In compliance with KOTRA, Korea Customs, and ASEAN Regulatory Sandbox.</div>
        </div>
      </footer>
    </div>
  );
}
