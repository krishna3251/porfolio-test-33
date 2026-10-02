const siteUrl=process.env.NEXT_PUBLIC_SITE_URL || "https://tests-krishna3251s-projects.vercel.app";

export default function robots(){
  return {
    rules:{userAgent:"*",allow:"/"},
    sitemap:`${siteUrl}/sitemap.xml`,
  };
}
