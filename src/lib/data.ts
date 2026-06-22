/**
 * Per-collection data loaders + the data shapes they return.
 *
 * Loaders call the generated Tina client and pipe the result through
 * `requestWithMetadata()` so the editor overlay flows in when the page
 * renders inside the admin iframe and `tinaField()` has its metadata.
 *
 * Types below are pure derivations — no hand-written shapes. Each one is
 * either inferred from a loader's return type (`CmsConfig`/`CmsPage`/
 * `CmsBlog`/`CmsProperty`) or `Extract`/index-accessed off those. The
 * Tina collection is the source of truth; regen with `tinacms dev` and
 * everything downstream updates.
 */
import type { TinaRichTextContent } from '@tinacms/astro';
import { requestWithMetadata } from '@tinacms/astro/data';
import client from '../../tina/__generated__/client';

/**
 * Hand-typed property shape used for the new `property` collection.
 * The schema lives in `tina/collections/property.ts`; once
 * `tinacms build` regenerates `tina/__generated__/client.ts`, the
 * auto-derived `CmsProperty` below aliases onto the same fields.
 * Until that regen runs, this shape keeps `pnpm typecheck` working
 * without a Tina cloud credential.
 *
 * ⚠️  Sync warning: if you add a field to `tina/collections/property.ts`
 * mirror it here. The two will silently diverge otherwise. Once
 * `tinacms build --content=local` runs, the `CmsProperty` type
 * exported below wins.
 */
export interface PropertyNode {
	_sys?: { filename?: string | null } | null;
	title?: string | null;
	type?: string | null;
	availability?: string | null;
	address?: string | null;
	sqft?: string | null;
	price?: { ksh?: string | null; perSqft?: string | null } | null;
	zone?: string | null;
	leaseTerm?: string | null;
	bedrooms?: number | null;
	bathrooms?: number | null;
	heroImage?: { src?: string | null; alt?: string | null } | null;
	gallery?: Array<{ src?: string | null; alt?: string | null }> | null;
	reference?: string | null;
	publishedDate?: string | null;
	specSheet?: {
		power?: string | null;
		water?: string | null;
		parking?: number | null;
		floorLoading?: string | null;
		clearHeight?: string | null;
	} | null;
	body?: RichText | null;
}

export const getConfig = () =>
	requestWithMetadata(client.queries.config({ relativePath: 'config.json' }));

export const getPage = (slug: string) =>
	requestWithMetadata(client.queries.page({ relativePath: `${slug}.mdx` }), { priority: 'primary' });

export const getBlog = (slug: string) =>
	requestWithMetadata(client.queries.blog({ relativePath: `${slug}.mdx` }), { priority: 'primary' });

export const getProperty = (slug: string) =>
	requestWithMetadata(client.queries.property({ relativePath: `${slug}.mdx` }), { priority: 'primary' });

export async function listPages() {
	const result = await client.queries.pageConnection();
	return (result.data.pageConnection.edges ?? [])
		.flatMap((edge) => (edge?.node ? [edge.node] : []));
}

export async function listBlogs() {
	const result = await client.queries.blogConnection();
	return (result.data.blogConnection.edges ?? [])
		.flatMap((edge) => (edge?.node ? [edge.node] : []))
		.sort((a, b) => {
			const ad = a.pubDate ? new Date(a.pubDate).valueOf() : 0;
			const bd = b.pubDate ? new Date(b.pubDate).valueOf() : 0;
			return bd - ad;
		});
}

export async function listProperties(): Promise<PropertyNode[]> {
	// @ts-expect-error -- see `getProperty` above; the connection query is regenerated alongside `client.queries.property`.
	const result: {
		data?: { propertyConnection?: { edges?: Array<{ node?: PropertyNode } | null | undefined> | null | undefined } | null | undefined };
	} = await client.queries.propertyConnection();
	const edges = ((result?.data?.propertyConnection?.edges ?? []) as Array<{ node?: PropertyNode } | null | undefined>).flatMap(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(edge: { node?: PropertyNode } | null | undefined): PropertyNode[] => (edge?.node ? [edge.node] : []),
	);
	return edges.sort((a, b) => {
		const ad = a.publishedDate ? new Date(a.publishedDate).valueOf() : 0;
		const bd = b.publishedDate ? new Date(b.publishedDate).valueOf() : 0;
		return bd - ad;
	});
}

export type CmsConfig = Awaited<ReturnType<typeof getConfig>>['data']['config'];
export type CmsPage = Awaited<ReturnType<typeof getPage>>['data']['page'];
export type CmsBlog = Awaited<ReturnType<typeof getBlog>>['data']['blog'];
export type CmsProperty = Awaited<ReturnType<typeof getProperty>>['data']['property'];

export type PageBlock = NonNullable<NonNullable<CmsPage['blocks']>[number]>;
export type PageBlockTypename = PageBlock['__typename'];

export type HeroBlock = Extract<PageBlock, { __typename: 'PageBlocksHero' }>;
export type CalloutBlock = Extract<PageBlock, { __typename: 'PageBlocksCallout' }>;
export type FeaturesBlock = Extract<PageBlock, { __typename: 'PageBlocksFeatures' }>;
export type StatsBlock = Extract<PageBlock, { __typename: 'PageBlocksStats' }>;
export type CtaBlock = Extract<PageBlock, { __typename: 'PageBlocksCta' }>;
export type CtaBannerBlock = Extract<PageBlock, { __typename: 'PageBlocksCtaBanner' }>;
export type ContentBlock = Extract<PageBlock, { __typename: 'PageBlocksContent' }>;
export type TestimonialBlock = Extract<PageBlock, { __typename: 'PageBlocksTestimonial' }>;
export type VideoBlock = Extract<PageBlock, { __typename: 'PageBlocksVideo' }>;
export type SplitBlock = Extract<PageBlock, { __typename: 'PageBlocksSplit' }>;
export type PropertyCardBlock = Extract<PageBlock, { __typename: 'PageBlocksPropertyCard' }>;
export type PropertyListBlock = Extract<PageBlock, { __typename: 'PageBlocksPropertyList' }>;

export type CmsConfigNav = NonNullable<NonNullable<CmsConfig['nav']>[number]>;
export type CmsConfigContactLink = NonNullable<NonNullable<CmsConfig['contactLinks']>[number]>;
export type CmsConfigSeo = NonNullable<CmsConfig['seo']>;

/**
 * Runtime fallbacks for the `seo.{phone,email,office}` triple. The
 * values MUST stay byte-identical to the `ui.defaultValue` blocks on
 * each field in `tina/collections/global-config.ts` so the runtime
 * fallback and the CMS-layer default agree. When Tina regen picks up
 * the schema on a clean dev box, the generated `CmsConfigSeo` will
 * carry the same three field shapes natively and the helpers below
 * drop to a no-op branch.
 */
export const CONTACT_DEFAULTS = {
	phone: '+254 700 000 000',
	email: 'hello@eens.co.ke',
	office: 'Mlolongo, Mombasa Road, KM 14',
};

/**
 * Runtime overlay on Tina's generated `CmsConfigSeo` for the
 * Phase-19 contact triple. Lifts the cast out of the three call sites
 * — every widening happens once, here. Delete this block (and the
 * cast inside `contactEmail`) once `pnpm run build:local` regenerates
 * the client and the new fields appear in the generated `CmsConfigSeo`.
 */
type CmsConfigSeoExtended = CmsConfigSeo & {
	phone?: string | null;
	email?: string | null;
	office?: string | null;
};

/**
 * Single source of truth. Every transactional mailto link on the site
 * (Footer, /properties/[slug], 404) MUST resolve through this helper.
 * Falls back to CONTACT_DEFAULTS.email on stale Tina generated types.
 */
export const contactEmail = (config: CmsConfig | null | undefined): string => {
	const seo = config?.seo as CmsConfigSeoExtended | undefined;
	return seo?.email ?? CONTACT_DEFAULTS.email;
};

export type Action = NonNullable<NonNullable<HeroBlock['actions']>[number]>;
export type ImageField = NonNullable<HeroBlock['image']>;
export type FeatureItem = NonNullable<NonNullable<FeaturesBlock['items']>[number]>;
export type StatItem = NonNullable<NonNullable<StatsBlock['stats']>[number]>;
export type TestimonialItem = NonNullable<NonNullable<TestimonialBlock['testimonials']>[number]>;

/** Tina rich-text bodies are typed as `any` in the generated client; this is what `<TinaMarkdown>` expects. */
export type RichText = TinaRichTextContent;
