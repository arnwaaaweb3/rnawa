import { useRef, useEffect } from 'react';
import { Renderer, Program, Mesh, Triangle, Vec2 } from 'ogl';
import '../styles/DarkVeil.module.css';

const vertex = `
attribute vec2 position;
void main(){gl_Position=vec4(position,0.0,1.0);}
`;

const fragment = `
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 uResolution;
uniform float uTime;
uniform float uHueShift;
uniform float uNoise;
uniform float uScan;
uniform float uScanFreq;
uniform float uWarp;

float rand(vec2 c){
    return fract(sin(dot(c,vec2(12.9898,78.233)))*43758.5453);
}

vec3 hueShift(vec3 color, float hue){
    float angle = radians(hue);
    float s = sin(angle), c = cos(angle);
    mat3 m = mat3(
        vec3(0.299,0.587,0.114),
        vec3(0.299,0.587,0.114),
        vec3(0.299,0.587,0.114)
    );
    vec3 gray = m * color;
    vec3 diff = color - gray;
    vec3 rotated = vec3(
        diff.x * c - diff.y * s,
        diff.x * s + diff.y * c,
        diff.z
    );
    return gray + rotated;
}

void main(){
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    vec2 p = uv * 2.0 - 1.0;
    p.y *= -1.0;

    // Warp
    p += uWarp * vec2(
        sin(p.y * 3.5 + uTime),
        cos(p.x * 3.5 + uTime)
    ) * 0.06;

    // Veil pattern
    float v = sin(p.x * 2.8 + uTime * 0.8) * cos(p.y * 2.8 - uTime * 0.6);
    float veil = smoothstep(-0.6, 0.6, v);

    // === Dark Purple Base Color ===
    vec3 darkPurple = vec3(0.03, 0.01, 0.05);
    vec3 glowPurple = vec3(0.35, 0.08, 0.5);

    vec3 col = mix(darkPurple, glowPurple, veil * 0.7);

    // Hue shift (optional dynamic color)
    col = hueShift(col, uHueShift);

    // Scanline
    float scan = sin(gl_FragCoord.y * uScanFreq) * 0.5 + 0.5;
    col *= 1.0 - scan * uScan;

    // Noise
    col += (rand(gl_FragCoord.xy + uTime) - 0.5) * uNoise;

    gl_FragColor = vec4(clamp(col,0.0,1.0),1.0);
}
`;

type Props = {
  hueShift?: number;
  noiseIntensity?: number;
  scanlineIntensity?: number;
  speed?: number;
  scanlineFrequency?: number;
  warpAmount?: number;
  resolutionScale?: number;
};

export default function DarkVeil({
  hueShift=0,
  noiseIntensity=0.015,
  scanlineIntensity=0.15,
  scanlineFrequency=0.04,
  warpAmount=0.6,
  speed=0.35,
  resolutionScale=1,
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    // --- 1. SETUP AWAL ---
    const start = performance.now(); // Pindahin ke atas biar bisa diakses resize
    
    const renderer = new Renderer({
      dpr: 1, 
      canvas,
      alpha: true,
      powerPreference: "low-power", 
    });

    const gl = renderer.gl;
    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new Vec2(parent.clientWidth, parent.clientHeight) },
        uHueShift: { value: hueShift },
        uNoise: { value: noiseIntensity },
        uScan: { value: scanlineIntensity },
        uScanFreq: { value: scanlineFrequency },
        uWarp: { value: warpAmount }
      }
    });

    const mesh = new Mesh(gl, { geometry, program });

    // --- 2. LOGIC RENDER ---
    const performRender = (t: number) => {
      gl.viewport(0, 0, canvas.width, canvas.height);
      program.uniforms.uTime.value = t;
      program.uniforms.uHueShift.value = hueShift;
      program.uniforms.uNoise.value = noiseIntensity;
      program.uniforms.uScan.value = scanlineIntensity;
      program.uniforms.uScanFreq.value = scanlineFrequency;
      program.uniforms.uWarp.value = warpAmount;
      renderer.render({ scene: mesh });
    };

    const resize = () => {
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      renderer.setSize(w * resolutionScale, h * resolutionScale);
      program.uniforms.uResolution.value.set(w * resolutionScale, h * resolutionScale);
      
      // Sekarang 'start' udah aman diakses di sini
      const t = ((performance.now() - start) / 1000) * speed;
      performRender(t);
    };

    // --- 3. LOOP & FPS LIMITER ---
    window.addEventListener('resize', resize);
    resize();

    let frame = 0;
    let lastTime = performance.now();
    const fpsInterval = 1000 / 30;

    const loop = (currentTime: number) => {
      frame = requestAnimationFrame(loop);
      const elapsed = currentTime - lastTime;

      if (elapsed >= fpsInterval) {
        lastTime = currentTime - (elapsed % fpsInterval);
        const t = ((currentTime - start) / 1000) * speed;
        performRender(t);
      }
    };

    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [hueShift, noiseIntensity, scanlineIntensity, speed, scanlineFrequency, warpAmount, resolutionScale]);

  return <canvas ref={ref} className="darkveil-canvas" />;
}