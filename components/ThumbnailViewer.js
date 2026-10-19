"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getThumbnailSrc } from "@/lib/thumbnails";
import WobbleImage from "@/components/WobbleImage";
import useSiteMedia from "@/hooks/useSiteMedia";

export default function ThumbnailViewer({item,previous,next,first,last,index,total}){
  const router=useRouter();
  const {media}=useSiteMedia();
  const override=media.overrides?.[item.filename]||{};

  useEffect(()=>{
    const body=document.body;
    const html=document.documentElement;
    const previousBodyOverflow=body.style.overflow;
    const previousBodyTouchAction=body.style.touchAction;
    const previousHtmlOverflow=html.style.overflow;

    body.style.overflow="hidden";
    body.style.touchAction="none";
    html.style.overflow="hidden";

    return()=>{
      body.style.overflow=previousBodyOverflow;
      body.style.touchAction=previousBodyTouchAction;
      html.style.overflow=previousHtmlOverflow;
    };
  },[]);

  useEffect(()=>{
    const onKey=(event)=>{
      if(event.metaKey||event.ctrlKey||event.altKey) return;
      if(event.target instanceof Element && event.target.closest("input,textarea,select,[contenteditable='true']")) return;
      const key=event.key.toLowerCase();
      if(key==="escape"||key==="backspace"){
        event.preventDefault();
        router.push("/thumbnails");
        return;
      }
      if(event.key==="ArrowLeft"||key==="a"||key==="p"){
        event.preventDefault();
        router.push(previous);
        return;
      }
      if(event.key==="ArrowRight"||key==="d"||key==="n"){
        event.preventDefault();
        router.push(next);
        return;
      }
      if(key==="home"){
        event.preventDefault();
        router.push(first);
        return;
      }
      if(key==="end"){
        event.preventDefault();
        router.push(last);
      }
    };

    window.addEventListener("keydown",onKey);
    return()=>window.removeEventListener("keydown",onKey);
  },[first,last,next,previous,router]);

  useEffect(()=>{
    [previous,next].forEach((url)=>{
      // Use a native HTML image for preloading. The imported Next.js <Image>
      // component shadows the browser's global Image constructor in this file.
      const preloadImage=document.createElement("img");
      preloadImage.decoding="async";
      const filename=new URL(url,window.location.origin).searchParams.get("file");
      if (filename) preloadImage.src = (filename.startsWith("thumb-upload-") || filename.startsWith("thumbnail-")) ? "/uploads/" + filename : getThumbnailSrc(filename);
    });
  },[previous,next]);

  return <main className="thumbnail-viewer-page" aria-label="Thumbnail viewer">
    <header className="thumbnail-viewer-nav">
      <Link href="/thumbnails" className="thumbnail-viewer-brand">KRISHNA<span>.</span></Link>
      <div className="thumbnail-viewer-counter" aria-live="polite">
        <b>{String(index+1).padStart(2,"0")}</b><i>/</i><span>{String(total).padStart(2,"0")}</span><em>{item.label}</em>
      </div>
      <Link href="/thumbnails" className="thumbnail-viewer-back">BACK ×</Link>
    </header>

    <section className="thumbnail-viewer-stage" aria-label={item.title}>
      <div className="viewer-side-tag">VISUAL / {item.label}</div>
        <WobbleImage className="thumbnail-viewer-wobble">
          <div
            key={item.id}
            className="thumbnail-viewer-image-frame"
          >
            <Image
              src={override.src||item.src}
              alt={item.title}
              fill
              sizes="100vw"
              quality={72}
              priority
              draggable="false"
              className="thumbnail-viewer-image" style={{objectFit:override.fit==="contain"?"contain":"cover",objectPosition:(override.positionX??50)+"% "+(override.positionY??50)+"%",transform:"scale("+Math.min(2.5,Math.max(.5,Number(override.scale)||1))+")",opacity:override.visible===false?0:(override.opacity??1)}}
            />
          </div>
        </WobbleImage>
      <span className="thumbnail-viewer-help">← A / P &nbsp; PREVIOUS &nbsp;&nbsp; D / N → &nbsp; NEXT &nbsp;&nbsp; ESC &nbsp; BACK</span>
    </section>

    <footer className="thumbnail-viewer-footer">
      <div>
        <span>{item.label}</span>
        <h1>{item.title}</h1>
        <p>{item.subtitle}</p>
      </div>
      <div className="thumbnail-viewer-actions" aria-label="Thumbnail navigation">
        <Link href={previous} aria-label="Previous thumbnail">←</Link>
        <Link href={next} aria-label="Next thumbnail">→</Link>
      </div>
    </footer>
  </main>;
}
