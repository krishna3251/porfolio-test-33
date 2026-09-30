"use client";

import { useEffect, useRef } from "react";

export default function MotionTraceBackdrop(){
  const canvasRef=useRef(null);
  const pointerRef=useRef({x:0,y:0,tx:0,ty:0,active:false});

  useEffect(()=>{
    const canvas=canvasRef.current;
    if(!canvas)return;
    const ctx=canvas.getContext("2d");
    if(!ctx)return;

    let raf;
    let width=innerWidth,height=innerHeight;
    let dpr=Math.min(devicePixelRatio||1,2);
    let time=0;

    const traces=Array.from({length:20},(_,i)=>({
      x:Math.random()*width,
      y:Math.random()*height,
      length:120+Math.random()*260,
      speed:.18+Math.random()*.45,
      drift:Math.random()*Math.PI*2,
      alpha:.025+Math.random()*.045,
      hue:i%2===0?"59,130,246":"255,59,77",
    }));

    const resize=()=>{
      width=innerWidth;height=innerHeight;dpr=Math.min(devicePixelRatio||1,2);
      canvas.width=width*dpr;canvas.height=height*dpr;
      canvas.style.width=width+"px";canvas.style.height=height+"px";
      ctx.setTransform(dpr,0,0,dpr,0,0);
    };

    const move=(e)=>{
      pointerRef.current.tx=e.clientX;
      pointerRef.current.ty=e.clientY;
      pointerRef.current.active=true;
    };

    const trace=(t)=>{
      const pulse=Math.sin(time*.024+t.drift)*.5+.5;
      const x2=t.x+t.length;
      const y2=t.y-t.length*(.18+Math.sin(t.drift)*.11);
      const g=ctx.createLinearGradient(t.x,t.y,x2,y2);
      g.addColorStop(0,"rgba("+t.hue+",0)");
      g.addColorStop(.45,"rgba("+t.hue+","+(t.alpha+pulse*.025)+")");
      g.addColorStop(1,"rgba("+t.hue+",0)");
      ctx.strokeStyle=g;
      ctx.lineWidth=.8;
      ctx.beginPath();ctx.moveTo(t.x,t.y);ctx.lineTo(x2,y2);ctx.stroke();
      t.x+=t.speed;t.y-=t.speed*.18;
      if(t.x>width+t.length||t.y<-t.length){
        t.x=-t.length;t.y=height*(.08+Math.random()*.92);
      }
    };

    const render=()=>{
      time+=1;
      ctx.clearRect(0,0,width,height);
      const p=pointerRef.current;
      p.x+=(p.tx-p.x)*.07;p.y+=(p.ty-p.y)*.07;

      ctx.globalCompositeOperation="lighter";
      traces.forEach(trace);

      if(p.active){
        for(let i=0;i<4;i++){
          const radius=46+i*34+Math.sin(time*.035+i)*7;
          const alpha=.065-i*.012;
          ctx.strokeStyle=i%2===0?"rgba(59,130,246,"+alpha+")":"rgba(255,59,77,"+(alpha*.85)+")";
          ctx.lineWidth=i===0?1.4:1;
          ctx.beginPath();
          ctx.ellipse(p.x,p.y,radius*1.45,radius*.36,-.35,0,Math.PI*2);
          ctx.stroke();
        }
      }

      ctx.globalCompositeOperation="source-over";
      raf=requestAnimationFrame(render);
    };

    resize();
    addEventListener("resize",resize);
    addEventListener("pointermove",move,{passive:true});
    render();

    return ()=>{
      cancelAnimationFrame(raf);
      removeEventListener("resize",resize);
      removeEventListener("pointermove",move);
    };
  },[]);

  return <canvas ref={canvasRef} className="fixed inset-0 z-[1] pointer-events-none opacity-80 mix-blend-screen" aria-hidden="true"/>;
}
