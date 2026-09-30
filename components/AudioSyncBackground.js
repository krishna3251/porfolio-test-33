"use client";

import { useEffect, useRef } from "react";

export default function AudioSyncBackground(){
  const canvasRef=useRef(null);

  useEffect(()=>{
    const canvas=canvasRef.current;
    if(!canvas)return;
    const ctx=canvas.getContext("2d");
    if(!ctx)return;

    let raf;
    let width=window.innerWidth;
    let height=window.innerHeight;
    let dpr=Math.min(window.devicePixelRatio||1,2);
    let time=0;
    const ORANGE="255,100,38";
    const INK="245,241,232";
    const frequencyData=new Uint8Array(32);

    const particles=Array.from({length:64},(_,i)=>({
      x:Math.random()*width,
      y:Math.random()*height,
      vx:(Math.random()-.5)*.18,
      vy:(Math.random()-.5)*.12,
      size:.7+Math.random()*1.6,
      phase:Math.random()*Math.PI*2,
      color:i%2===0?ORANGE:INK,
      alpha:.10+Math.random()*.25,
    }));

    const resize=()=>{
      width=window.innerWidth;height=window.innerHeight;
      dpr=Math.min(window.devicePixelRatio||1,2);
      canvas.width=width*dpr;canvas.height=height*dpr;
      canvas.style.width=width+"px";canvas.style.height=height+"px";
      ctx.setTransform(dpr,0,0,dpr,0,0);
    };

    const drawField=(x,y,radius,color,alpha)=>{
      const g=ctx.createRadialGradient(x,y,0,x,y,radius);
      g.addColorStop(0,"rgba("+color+","+alpha+")");
      g.addColorStop(.38,"rgba("+color+","+(alpha*.45)+")");
      g.addColorStop(1,"rgba("+color+",0)");
      ctx.fillStyle=g;
      ctx.fillRect(0,0,width,height);
    };

    const drawRibbon=(intensity,bass)=>{
      const amp=8+bass*.13;
      const base=height*.54+Math.sin(time*.22)*height*.035;
      const grad=ctx.createLinearGradient(0,0,width,0);
      grad.addColorStop(0,"rgba("+ORANGE+",0)");
      grad.addColorStop(.28,"rgba("+ORANGE+","+(.08+intensity*.0011)+")");
      grad.addColorStop(.64,"rgba("+INK+","+(.055+intensity*.0007)+")");
      grad.addColorStop(1,"rgba("+INK+",0)");
      ctx.beginPath();
      for(let x=0;x<=width;x+=12){
        const y=base+Math.sin(x*.012+time*.55)*amp+Math.sin(x*.027-time*.28)*amp*.28;
        if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
      }
      ctx.strokeStyle=grad;
      ctx.lineWidth=1.15+bass*.008;
      ctx.stroke();
      ctx.beginPath();
      for(let x=0;x<=width;x+=18){
        const y=base+Math.sin(x*.012+time*.55+Math.PI*.12)*amp*.68+20;
        if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
      }
      ctx.strokeStyle="rgba("+ORANGE+","+(.025+intensity*.00045)+")";
      ctx.stroke();
    };

    const render=()=>{
      time+=.012;
      ctx.clearRect(0,0,width,height);

      let intensity=0,bass=0;
      if(typeof window!=="undefined"&&window.portfolioAnalyser){
        window.portfolioAnalyser.getByteFrequencyData(frequencyData);
        intensity=frequencyData.reduce((a,b)=>a+b,0)/frequencyData.length;
        bass=(frequencyData[0]+frequencyData[1]+frequencyData[2]+frequencyData[3])/4;
      }

      const root=document.documentElement;
      const normInt=intensity/255;
      const normBass=bass/255;
      root.style.setProperty("--music-intensity",normInt.toFixed(3));
      root.style.setProperty("--music-bass",normBass.toFixed(3));
      root.style.setProperty("--music-scale",(1+normBass*.02).toFixed(3));
      root.style.setProperty("--music-glow",(normBass*22).toFixed(1)+"px");

      ctx.save();
      ctx.globalCompositeOperation="lighter";
      const drift=40+Math.sin(time*.32)*24;
      drawField(width*.18+drift,height*.2,Math.max(width,height)*.34,ORANGE,.032+normInt*.09);
      drawField(width*.82-drift,height*.72,Math.max(width,height)*.36,INK,.018+normInt*.055);
      drawRibbon(intensity,bass);

      particles.forEach((p)=>{
        p.phase+=.008;
        p.x+=p.vx*(1+normInt*3);
        p.y+=p.vy*(1+normInt*2)+Math.sin(p.phase)*.05;
        if(p.x<-20)p.x=width+20;
        if(p.x>width+20)p.x=-20;
        if(p.y<-20)p.y=height+20;
        if(p.y>height+20)p.y=-20;
        const pulse=1+Math.sin(time*1.8+p.phase)*.18+normBass*.85;
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.size*pulse,0,Math.PI*2);
        ctx.fillStyle="rgba("+p.color+","+(p.alpha*(.55+normInt*.9))+")";
        if(normBass>.2){
          ctx.shadowColor="rgba("+p.color+",.55)";
          ctx.shadowBlur=6+normBass*16;
        }
        ctx.fill();
        ctx.shadowBlur=0;
      });

      ctx.restore();
      raf=requestAnimationFrame(render);
    };

    resize();
    window.addEventListener("resize",resize);
    render();

    return ()=>{
      cancelAnimationFrame(raf);
      window.removeEventListener("resize",resize);
    };
  },[]);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-90" aria-hidden="true"/>;
}
