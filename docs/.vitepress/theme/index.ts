import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { defineAsyncComponent } from 'vue'
import Layout from './Layout.vue'

import './styles/vars.css'
import './styles/observatory.css'

// Synchronous initial-paint chrome & core inline components (16)
import AffiliateButton from './components/AffiliateButton.vue'
import AffiliateDisclosure from './components/AffiliateDisclosure.vue'
import BrandOverview from './components/BrandOverview.vue'
import BrandRecommendation from './components/BrandRecommendation.vue'
import BreadcrumbBar from './components/BreadcrumbBar.vue'
import ClientCompatibility from './components/ClientCompatibility.vue'
import CouponInfo from './components/CouponInfo.vue'
import FaqSection from './components/FaqSection.vue'
import HomePage from './components/HomePage.vue'
import LatencyChart from './components/LatencyChart.vue'
import PageMetaBanner from './components/PageMetaBanner.vue'
import PlanSelector from './components/PlanSelector.vue'
import PricingMatrix from './components/PricingMatrix.vue'
import RelatedBrand from './components/RelatedBrand.vue'
import ThroughputChart from './components/ThroughputChart.vue'
import WatermarkedChartFrame from './components/WatermarkedChartFrame.vue'

// Async heavy non-above-the-fold components (9)
const AvailabilityMatrix = defineAsyncComponent(() => import('./components/AvailabilityMatrix.vue'))
const BenchmarkExplorer = defineAsyncComponent(() => import('./components/BenchmarkExplorer.vue'))
const BrandComparisonTool = defineAsyncComponent(() => import('./components/BrandComparisonTool.vue'))
const BrandDirectory = defineAsyncComponent(() => import('./components/BrandDirectory.vue'))
const EvidencePanel = defineAsyncComponent(() => import('./components/EvidencePanel.vue'))
const NetworkTopology = defineAsyncComponent(() => import('./components/NetworkTopology.vue'))
const SelectionWizard = defineAsyncComponent(() => import('./components/SelectionWizard.vue'))
const SpeedReport = defineAsyncComponent(() => import('./components/SpeedReport.vue'))
const StabilityHistory = defineAsyncComponent(() => import('./components/StabilityHistory.vue'))

const components = {
  AffiliateButton,
  AffiliateDisclosure,
  AvailabilityMatrix,
  BenchmarkExplorer,
  BrandComparisonTool,
  BrandDirectory,
  BrandOverview,
  BrandRecommendation,
  BreadcrumbBar,
  ClientCompatibility,
  CouponInfo,
  EvidencePanel,
  FaqSection,
  HomePage,
  LatencyChart,
  NetworkTopology,
  PageMetaBanner,
  PlanSelector,
  PricingMatrix,
  RelatedBrand,
  SelectionWizard,
  SpeedReport,
  StabilityHistory,
  ThroughputChart,
  WatermarkedChartFrame
}

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    for (const [name, component] of Object.entries(components)) {
      app.component(name, component)
    }
  }
} satisfies Theme
