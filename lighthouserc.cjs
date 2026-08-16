/**
 * Lighthouse CI configuration — runs against the Vercel preview deployment
 * URL (injected as LHCI_URL by .github/workflows/lighthouse-ci.yml).
 *
 * Gates (aligned with Google's Core Web Vitals "good" thresholds and the
 * project's perf bar in docs/agents/project-map.md):
 *   - Performance score >= 0.95
 *   - LCP <= 2500 ms (Google "good")
 *   - CLS <= 0.1 (Google "good")
 *   - TBT <= 200 ms (INP proxy in Lighthouse mobile emulation)
 *   - Accessibility / Best Practices / SEO >= 0.9
 *
 * Mobile emulation (Lighthouse default preset) is the hard target; the
 * desktop profile already scores 99 locally.
 */
const previewUrl = process.env.LHCI_URL || 'http://localhost:4321';

module.exports = {
	ci: {
		collect: {
			url: [previewUrl],
			numberOfRuns: 3,
			settings: {
				preset: 'default', // mobile emulation, 4x CPU throttle
			},
		},
		assert: {
			assertions: {
				'categories:performance': ['error', { minScore: 0.95 }],
				'categories:accessibility': ['error', { minScore: 0.9 }],
				'categories:best-practices': ['error', { minScore: 0.9 }],
				'categories:seo': ['error', { minScore: 0.9 }],
				'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
				'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
				'total-blocking-time': ['error', { maxNumericValue: 200 }],
			},
		},
		upload: {
			target: 'temporary-public-storage',
		},
	},
};
