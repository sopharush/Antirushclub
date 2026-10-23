import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { prefersReducedMotion } from '../lib/motion'

/**
 * A calm warm "mist" — slow fractal-noise haze in cream/tan over the paper
 * ground. Low contrast by design so the chocolate type stays crisp on top.
 * Caps DPR, pauses when offscreen or tab hidden, renders one static frame
 * under reduced motion, and disposes on unmount.
 */
const FRAG = /* glsl */ `
precision highp float;
uniform float uTime;
uniform vec2 uRes;

// cream / warm-white / faint tan — stays close to the paper ground
const vec3 CREAM = vec3(0.980, 0.969, 0.949);
const vec3 WARM  = vec3(0.937, 0.894, 0.831);
const vec3 TAN   = vec3(0.886, 0.812, 0.706);

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}
float fbm(vec2 p){
  float v = 0.0; float amp = 0.5;
  for (int i = 0; i < 5; i++){ v += amp * noise(p); p *= 2.02; amp *= 0.5; }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes.xy;
  vec2 p = uv;
  p.x *= uRes.x / uRes.y;

  float t = uTime * 0.025;
  vec2 q = vec2(fbm(p * 1.6 + vec2(0.0, t)), fbm(p * 1.6 + vec2(5.2, -t)));
  float f = fbm(p * 2.1 + q * 1.4 + vec2(t * 0.5, 0.0));

  vec3 col = mix(CREAM, WARM, smoothstep(0.25, 0.85, f));
  col = mix(col, TAN, smoothstep(0.62, 1.0, f) * 0.5);

  // soft top-down light + gentle edge warmth (vignette)
  col += (1.0 - uv.y) * 0.015;
  float d = distance(uv, vec2(0.5, 0.46));
  col = mix(col, WARM, smoothstep(0.35, 0.95, d) * 0.35);

  gl_FragColor = vec4(col, 1.0);
}
`

const VERT = /* glsl */ `
void main(){ gl_Position = vec4(position, 1.0); }
`

export default function HeroShader() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = ref.current
    if (!mount) return

    const reduced = prefersReducedMotion()
    const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    mount.appendChild(renderer.domElement)
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.display = 'block'

    const scene = new THREE.Scene()
    const camera = new THREE.Camera()
    const uniforms = {
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(mount.clientWidth, mount.clientHeight) },
    }
    const material = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms })
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material)
    scene.add(mesh)

    const dpr = Math.min(window.devicePixelRatio, 1.75)
    const resize = () => {
      const w = mount.clientWidth, h = mount.clientHeight
      renderer.setSize(w, h)
      uniforms.uRes.value.set(w * dpr, h * dpr)
    }
    resize()
    window.addEventListener('resize', resize)

    let raf = 0
    let visible = true
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }, { threshold: 0 })
    io.observe(mount)

    const start = performance.now()
    const loop = () => {
      raf = requestAnimationFrame(loop)
      if (!visible || document.hidden) return
      uniforms.uTime.value = (performance.now() - start) / 1000
      renderer.render(scene, camera)
    }

    if (reduced) {
      uniforms.uTime.value = 12
      renderer.render(scene, camera)
    } else {
      raf = requestAnimationFrame(loop)
    }

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
