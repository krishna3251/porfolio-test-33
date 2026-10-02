const siteUrl=process.env.NEXT_PUBLIC_SITE_URL || "https://tests-krishna3251s-projects.vercel.app";

export default function sitemap(){
  const now=new Date();
  return [
    {url:siteUrl,lastModified:now,changeFrequency:"monthly",priority:1},
    {url:`${siteUrl}/thumbnails`,lastModified:now,changeFrequency:"weekly",priority:.9},
    {url:`${siteUrl}/projects`,lastModified:now,changeFrequency:"monthly",priority:.8},
    {url:`${siteUrl}/bots`,lastModified:now,changeFrequency:"monthly",priority:.7},
  ];
}
