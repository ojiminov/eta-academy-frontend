import React from 'react'
import { Link } from 'react-router-dom'
import {
  GraduationCap, Star, Users, BookOpen, Award, Zap, Globe2,
  ArrowRight, CheckCircle, Play, TrendingUp, Clock, BarChart3,
  ChevronRight, Sparkles, Shield, MessageCircle,
} from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { Navbar } from '@/components/layout/Navbar'

// ─── Stats data ───────────────────────────────────────────────────────────────
const stats = [
  { icon: Users, value: '5,000+', labelKey: 'studentsCount' as const, color: 'from-violet-500 to-purple-600' },
  { icon: BookOpen, value: '50+', labelKey: 'coursesCount' as const, color: 'from-pink-500 to-rose-600' },
  { icon: GraduationCap, value: '15+', labelKey: 'teachersCount' as const, color: 'from-blue-500 to-cyan-600' },
  { icon: TrendingUp, value: '94%', labelKey: 'successRate' as const, color: 'from-amber-500 to-orange-600' },
]

// ─── Features ─────────────────────────────────────────────────────────────────
const features = [
  {
    icon: GraduationCap,
    titleKey: 'feature1Title' as const,
    descKey: 'feature1Desc' as const,
    gradient: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
  },
  {
    icon: BarChart3,
    titleKey: 'feature2Title' as const,
    descKey: 'feature2Desc' as const,
    gradient: 'from-pink-500 to-rose-600',
    bg: 'bg-pink-50',
  },
  {
    icon: Award,
    titleKey: 'feature3Title' as const,
    descKey: 'feature3Desc' as const,
    gradient: 'from-blue-500 to-cyan-600',
    bg: 'bg-blue-50',
  },
  {
    icon: Globe2,
    titleKey: 'feature4Title' as const,
    descKey: 'feature4Desc' as const,
    gradient: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50',
  },
]

// ─── Sample courses ───────────────────────────────────────────────────────────
const sampleCourses = [
  {
    title: 'IELTS Band 7+ Complete Guide',
    category: 'IELTS Preparation',
    level: 'B2',
    price: '$99.99',
    rating: 4.9,
    students: 1240,
    lessons: 48,
    hours: 40,
    gradient: 'from-violet-600 to-purple-700',
    badge: '⭐ Bestseller',
  },
  {
    title: 'Business English Essentials',
    category: 'Business English',
    level: 'B1-B2',
    price: '$79.99',
    rating: 4.8,
    students: 890,
    lessons: 32,
    hours: 24,
    gradient: 'from-pink-600 to-rose-700',
    badge: '🔥 Popular',
  },
  {
    title: 'English for Beginners (A1-A2)',
    category: 'General English',
    level: 'A1',
    price: 'Free',
    rating: 4.7,
    students: 2100,
    lessons: 24,
    hours: 16,
    gradient: 'from-blue-600 to-cyan-700',
    badge: '🎁 Free',
  },
]

// ─── Testimonials ─────────────────────────────────────────────────────────────
const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'IELTS Graduate · Band 8.0',
    text: 'ETA Academy transformed my IELTS preparation. The structured approach and expert feedback helped me achieve Band 8.0 on my first attempt!',
    avatar: 'SJ',
    gradient: 'from-violet-500 to-purple-600',
    stars: 5,
  },
  {
    name: 'Akbar Toshmatov',
    role: 'Business Professional',
    text: 'The Business English course completely changed how I communicate at work. My presentations are more confident and my emails are much more professional.',
    avatar: 'AT',
    gradient: 'from-pink-500 to-rose-600',
    stars: 5,
  },
  {
    name: 'Maria Chen',
    role: 'University Student',
    text: 'From B1 to C1 in just 6 months. The progress tracking kept me motivated every single day. I love the XP system!',
    avatar: 'MC',
    gradient: 'from-blue-500 to-cyan-600',
    stars: 5,
  },
]

// ─── Pricing ──────────────────────────────────────────────────────────────────
const pricingPlans = [
  {
    titleKey: 'pricingFreeTitle' as const,
    priceKey: 'pricingFreePrice' as const,
    periodKey: 'pricingFreePeriod' as const,
    features: ['3 free courses', 'Basic progress tracking', 'Community access', 'Mobile app'],
    cta: 'Get Started',
    href: '/register',
    highlighted: false,
    gradient: '',
  },
  {
    titleKey: 'pricingProTitle' as const,
    priceKey: 'pricingProPrice' as const,
    periodKey: 'pricingProPeriod' as const,
    features: ['All 50+ courses', 'Advanced analytics', 'Live teacher feedback', 'Certificates', 'Priority support'],
    cta: 'Start Pro Trial',
    href: '/register',
    highlighted: true,
    gradient: 'gradient-bg',
  },
  {
    titleKey: 'pricingEnterpriseTitle' as const,
    priceKey: 'pricingEnterprisePrice' as const,
    periodKey: 'pricingEnterprisePeriod' as const,
    features: ['Unlimited users', 'Custom courses', 'Dedicated manager', 'Analytics dashboard', 'SLA guarantee'],
    cta: 'Contact Sales',
    href: '/register',
    highlighted: false,
    gradient: '',
  },
]

export default function LandingPage() {
  const { t } = useI18n()

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />

      {/* ─── Hero ──────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#0a0618]">
        {/* Animated mesh background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-2000" />
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm text-white/80 mb-8 animate-fade-in">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            <span>Trusted by 5,000+ students worldwide</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight animate-fade-up">
            {t.landing.heroTitle}
            <br />
            <span className="gradient-text">{t.landing.heroTitleAccent}</span>
          </h1>

          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 animate-fade-up leading-relaxed">
            {t.landing.heroSubtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-up">
            <Link
              to="/register"
              className="group inline-flex items-center gap-2 gradient-bg text-white font-semibold px-8 py-4 rounded-2xl shadow-glow hover:shadow-glow-lg transition-all duration-300 hover:scale-105 text-lg"
            >
              <Zap className="h-5 w-5" />
              {t.landing.heroCta}
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/20 transition-all duration-300 text-lg"
            >
              <Play className="h-5 w-5" />
              {t.landing.heroSecondary}
            </Link>
          </div>

          {/* Hero visual */}
          <div className="mt-16 relative max-w-4xl mx-auto animate-fade-up">
            <div className="glass-card rounded-3xl p-1 bg-white/5 border border-white/10">
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 relative overflow-hidden">
                {/* Fake dashboard preview */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    { label: 'XP Points', value: '2,840', icon: '⚡', color: 'from-yellow-500 to-orange-500' },
                    { label: 'Day Streak', value: '14 🔥', icon: '🔥', color: 'from-pink-500 to-rose-500' },
                    { label: 'Progress', value: '76%', icon: '📈', color: 'from-violet-500 to-purple-500' },
                  ].map((item) => (
                    <div key={item.label} className="bg-white/5 rounded-xl p-4 text-left">
                      <div className="text-white/50 text-xs mb-1">{item.label}</div>
                      <div className={`text-2xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white/70 text-sm">IELTS Band 7+ Complete Guide</span>
                    <span className="text-violet-400 text-sm font-semibold">76%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="gradient-bg h-2 rounded-full" style={{ width: '76%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -top-4 -left-4 bg-white rounded-2xl shadow-card px-4 py-3 flex items-center gap-2 animate-fade-in">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">✓</div>
              <div>
                <div className="text-xs font-bold text-gray-800">Band 7.5 achieved!</div>
                <div className="text-xs text-gray-500">Sarah just now</div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-card px-4 py-3 flex items-center gap-2 animate-fade-in">
              <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white text-sm">⚡</div>
              <div>
                <div className="text-xs font-bold text-gray-800">+150 XP earned</div>
                <div className="text-xs text-gray-500">Lesson completed</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats ─────────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.labelKey} className="text-center group">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} text-white mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-500 font-medium">{t.landing[stat.labelKey]}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── Features ──────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-b from-white to-violet-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 rounded-full px-4 py-2 text-sm font-semibold mb-4">
              <Sparkles className="h-4 w-4" />
              Features
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 text-balance">
              {t.landing.featuresTitle}
            </h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">{t.landing.featuresSubtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.titleKey}
                  className="group bg-white rounded-3xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{t.landing[feature.titleKey]}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{t.landing[feature.descKey]}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── Courses ───────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 rounded-full px-4 py-2 text-sm font-semibold mb-3">
                <BookOpen className="h-4 w-4" />
                Courses
              </div>
              <h2 className="text-4xl font-black text-gray-900">{t.landing.coursesTitle}</h2>
              <p className="text-gray-500 mt-2">{t.landing.coursesSubtitle}</p>
            </div>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 text-violet-600 font-semibold hover:text-violet-700 transition-colors group"
            >
              {t.landing.viewAllCourses}
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {sampleCourses.map((course) => (
              <div
                key={course.title}
                className="group bg-white rounded-3xl shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-gray-100 overflow-hidden"
              >
                {/* Card header */}
                <div className={`bg-gradient-to-br ${course.gradient} p-6 relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />
                  <span className="relative z-10 inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    {course.badge}
                  </span>
                  <h3 className="relative z-10 text-white font-bold text-lg leading-tight">{course.title}</h3>
                  <div className="relative z-10 flex items-center gap-2 mt-2">
                    <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">{course.level}</span>
                    <span className="text-white/70 text-xs">{course.category}</span>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-semibold text-gray-800">{course.rating}</span>
                      <span className="text-sm text-gray-400">({course.students.toLocaleString()} {t.courses.students})</span>
                    </div>
                    <span className={`font-bold text-lg ${course.price === 'Free' ? 'text-green-600' : 'text-gray-900'}`}>
                      {course.price === 'Free' ? t.courses.free : course.price}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-5">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" /> {course.lessons} {t.courses.lessons}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" /> {course.hours} {t.courses.hours}
                    </span>
                  </div>

                  <Link
                    to="/register"
                    className="block w-full text-center gradient-bg text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity shadow-glow hover:shadow-glow-lg"
                  >
                    {t.courses.enrollNow}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ──────────────────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-br from-violet-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 rounded-full px-4 py-2 text-sm font-semibold mb-4">
              <MessageCircle className="h-4 w-4" />
              Testimonials
            </div>
            <h2 className="text-4xl font-black text-gray-900">{t.landing.testimonialTitle}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t_item) => (
              <div key={t_item.name} className="bg-white rounded-3xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t_item.stars }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed mb-6 text-sm">"{t_item.text}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t_item.gradient} flex items-center justify-center text-white font-bold text-sm`}>
                    {t_item.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{t_item.name}</div>
                    <div className="text-xs text-gray-500">{t_item.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing ───────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 rounded-full px-4 py-2 text-sm font-semibold mb-4">
              <Shield className="h-4 w-4" />
              Pricing
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-4">{t.landing.pricingTitle}</h2>
            <p className="text-gray-500 text-lg">{t.landing.pricingSubtitle}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <div
                key={plan.titleKey}
                className={`rounded-3xl p-8 border transition-all duration-300 hover:-translate-y-1 ${
                  plan.highlighted
                    ? 'gradient-bg text-white shadow-glow-lg scale-105 border-transparent'
                    : 'bg-white border-gray-200 shadow-card hover:shadow-card-hover'
                }`}
              >
                <h3 className={`text-xl font-black mb-2 ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                  {t.landing[plan.titleKey]}
                </h3>
                <div className="mb-6">
                  <span className={`text-4xl font-black ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                    {t.landing[plan.priceKey]}
                  </span>
                  <span className={`text-sm ml-1 ${plan.highlighted ? 'text-white/70' : 'text-gray-500'}`}>
                    /{t.landing[plan.periodKey]}
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <CheckCircle className={`h-4 w-4 flex-shrink-0 ${plan.highlighted ? 'text-white' : 'text-violet-500'}`} />
                      <span className={plan.highlighted ? 'text-white/90' : 'text-gray-600'}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={plan.href}
                  className={`block w-full text-center font-semibold py-3 rounded-xl transition-all duration-300 ${
                    plan.highlighted
                      ? 'bg-white text-violet-700 hover:bg-white/90 shadow-lg'
                      : 'gradient-bg text-white hover:opacity-90 shadow-glow'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ────────────────────────────────────────────────────────── */}
      <section className="py-24 gradient-bg relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">{t.landing.ctaTitle}</h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">{t.landing.ctaSubtitle}</p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-violet-700 font-bold px-10 py-4 rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 text-lg"
          >
            <Zap className="h-5 w-5" />
            {t.landing.ctaButton}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* ─── Footer ────────────────────────────────────────────────────────────── */}
      <footer className="bg-gray-950 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 text-2xl font-black mb-2 justify-center md:justify-start">
                <GraduationCap className="h-7 w-7 text-violet-400" />
                <span className="gradient-text">ETA Academy</span>
              </div>
              <p className="text-gray-400 text-sm max-w-xs">{t.landing.footerTagline}</p>
            </div>

            <div className="flex flex-wrap gap-6 justify-center text-sm text-gray-400">
              <Link to="/courses" className="hover:text-white transition-colors">Courses</Link>
              <Link to="/register" className="hover:text-white transition-colors">Sign Up</Link>
              <Link to="/login" className="hover:text-white transition-colors">Login</Link>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} ETA Academy. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
