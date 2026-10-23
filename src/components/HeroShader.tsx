import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { prefersReducedMotion } from '../lib/motion'

/**
 * Warm film "light leak" — slow drifting amber/gold glow, screen-blended over
 * the hero photograph so it adds nostalgic light without washing out the type.
 * DPR-capped, pauses offscreen/hidden, one static frame under reduced motion,
 * disposes on unmount.
 */
const FRAG = /* glsl */ `
precision highp float;
uniform float uTime;
uniform vec2 uRes;

const vec3 AMBER = vec3(0.95, 0.62, 0.28);
const vec3 GOLD  = vec3(1.0, 0.82, 0.45);
const vec3 EMBER = vec3(0.78, 0.33, 0.16);

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p);
  float a = hash(i), b = hash(i + vec2(1.0,0.0)), c = hash(i + vec2(0.0,1.0)), d = hash(i + vec2(1.0,1.0));
  vec2 u = f*f*(3.0-2.0*f);
  return mix(a,b,u.x) + (c-a)*u.y*(1.0-u.x) + (d-b)*u.x*u.y;
}
float fbm(vec2 p){ float v=0.0, a=0.5; for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.03; a*=0.5; } return v; }

void main(){
  vec2 uv = gl_FragCoord.xy / uRes.xy;
  vec2 p = uv; p.x *= uRes.x / uRes.y;
  float t = uTime * 0.03;

  vec2 q = vec2(fbm(p*1.3 + vec2(0.0,t)), fbm(p*1.3 + vec2(4.0,-t*0.8)));
  float f = fbm(p*1.8 + q*1.6 + vec2(t*0.4, t*0.2));

  // glow pools, strongest toward the upper corners (classic light-leak feel)
  float corner = smoothstep(0.2, 1.0, (1.0 - uv.y)) * (0.5 + 0.5*abs(uv.x-0.5)*2.0);
  float glow = smoothstep(0.52, 1.0, f) * (0.55 + 0.75*corner);

  vec3 col = mix(EMBER, AMBER, smoothstep(0.4, 0.9, f));
  col = mix(col, GOLD, smoothstep(0.75, 1.0, f));
  col *= glow;

  gl_FragColor = vec4(col, 1.0);
}
`
const VERT = /* glsl */ `void main(){ gl_Position = vec4(position, 1.0); }`

export default function HeroShader() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = ref.current
    if (!mount) return
    const reduced = prefersReducedMotion()

    const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance', alpha: true })
    const dpr = Math.min(window.devicePixelRatio, 1.75)
    renderer.setPixelRatio(dpr)
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    mount.appendChild(renderer.domElement)
    Object.assign(renderer.domElement.style, {
      width: '100%', height: '100%', display: 'block',
      mixBlendMode: 'screen', opacity: '0.6',
    })

    const scene = new THREE.Scene()
    const camera = new THREE.Camera()
    const uniforms = {
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(mount.clientWidth * dpr, mount.clientHeight * dpr) },
    }
    const material = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms })
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material)
    scene.add(mesh)

    const resize = () => {
      const w = mount.clientWidth, h = mount.clientHeight
      renderer.setSize(w, h)
      uniforms.uRes.value.set(w * dpr, h * dpr)
    }
    resize()
    window.addEventListener('resize', resize)

    let raf = 0, visible = true
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }, { threshold: 0 })
    io.observe(mount)

    const start = performance.now()
    const loop = () => {
      raf = requestAnimationFrame(loop)
      if (!visible || document.hidden) return
      uniforms.uTime.value = (performance.now() - start) / 1000
      renderer.render(scene, camera)
    }
    if (reduced) { uniforms.uTime.value = 8; renderer.render(scene, camera) }
    else raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', resize)
      mesh.geometry.dispose()
      material.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={ref} className="absolute inset-0 h-full w-full" aria-hidden="true" />
}
