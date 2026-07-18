'use client'

import { useEffect, useRef } from 'react'

const VERTEX_SHADER = `
attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

const FRAGMENT_SHADER = `
precision highp float;
uniform float u_time;
uniform float u_scroll;
uniform vec2 u_mouse;
uniform vec2 u_resolution;
varying vec2 v_texCoord;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 4; ++i) {
        v += a * snoise(p);
        p = rot * p * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

float pattern(in vec2 p, out vec2 q, out vec2 r, float t) {
    q.x = fbm(p + vec2(0.0, 0.0));
    q.y = fbm(p + vec2(5.2, 1.3));

    r.x = fbm(p + 4.0 * q + vec2(1.7, 9.2) + t * 0.15);
    r.y = fbm(p + 4.0 * q + vec2(8.3, 2.8) + t * 0.12);

    return fbm(p + 4.0 * r);
}

void main() {
    vec2 uv = v_texCoord;
    vec2 p = (uv * 2.0 - 1.0);
    p.x *= u_resolution.x / u_resolution.y;

    // Apply scroll + mouse parallax to different layers
    vec2 uvNebula = p * 1.4 + vec2(0.0, u_scroll * 0.04) + u_mouse * 0.025;
    vec2 uvStars1 = uv + vec2(0.0, u_scroll * 0.08) + u_mouse * 0.04;
    vec2 uvStars2 = uv + vec2(0.0, u_scroll * 0.05) + u_mouse * 0.025;

    // Deep space base color
    vec3 color = vec3(0.04, 0.02, 0.07);

    // Calculate domain warped FBM nebula noise
    vec2 q, r;
    float n = pattern(uvNebula, q, r, u_time);

    // Cosmic colors matching exact Hex codes
    vec3 nebulaViolet = vec3(0.52, 0.22, 0.96); // Vivid Cosmic Violet
    vec3 nebulaPink = vec3(1.0, 0.25, 0.55); // Neon Pink (#ff4b91)
    vec3 nebulaCyan = vec3(0.0, 0.75, 0.85); // Light highlights

    // Accumulate nebula colors from fractal coordinates
    color += nebulaViolet * clamp(q.x * q.x * 1.5, 0.0, 1.0) * 0.75;
    color += nebulaPink * clamp(r.y * r.y * 1.3, 0.0, 1.0) * 0.65;
    color += nebulaCyan * clamp(n * n * 0.9, 0.0, 1.0) * 0.3;

    // Twinkling Star Layer 1
    float starLayer1 = fract(sin(dot(uvStars1.xy, vec2(12.9898, 78.233))) * 43758.5453);
    if(starLayer1 > 0.993) {
        float twinkle = sin(u_time * 2.0 + starLayer1 * 100.0) * 0.5 + 0.5;
        color += vec3(1.0, 0.95, 1.0) * twinkle * 1.6;
    }

    // Twinkling Star Layer 2
    float starLayer2 = fract(sin(dot(uvStars2.xy + 0.5, vec2(15.123, 94.567))) * 23456.789);
    if(starLayer2 > 0.995) {
        float twinkle = cos(u_time * 1.4 + starLayer2 * 50.0) * 0.4 + 0.6;
        color += vec3(0.9, 0.95, 1.0) * twinkle * 1.2;
    }

    // Vignette / Depth wash
    float dist = length(p);
    color *= 1.35 - smoothstep(0.3, 1.8, dist);

    gl_FragColor = vec4(color, 1.0);
}
`

function compileShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  return shader
}

export function NebulaShader() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationRef = useRef<number | null>(null)
  const scrollRef = useRef<number>(0)
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current = window.scrollY / window.innerHeight
    }

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates to [-1, 1]
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    const canvas = canvasRef.current
    if (!canvas) return

    const syncSize = () => {
      const w = canvas.clientWidth || 1280
      const h = canvas.clientHeight || 720
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
    }

    let resizeObserver: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(syncSize)
      resizeObserver.observe(canvas)
    }
    syncSize()

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (!gl) return
    const glCtx = gl as WebGLRenderingContext

    const prog = glCtx.createProgram()
    if (!prog) return

    const vs = compileShader(glCtx, glCtx.VERTEX_SHADER, VERTEX_SHADER)
    const fs = compileShader(glCtx, glCtx.FRAGMENT_SHADER, FRAGMENT_SHADER)
    if (!vs || !fs) return

    glCtx.attachShader(prog, vs)
    glCtx.attachShader(prog, fs)
    glCtx.linkProgram(prog)
    glCtx.useProgram(prog)

    const buf = glCtx.createBuffer()
    glCtx.bindBuffer(glCtx.ARRAY_BUFFER, buf)
    glCtx.bufferData(
      glCtx.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      glCtx.STATIC_DRAW
    )

    const pos = glCtx.getAttribLocation(prog, 'a_position')
    glCtx.enableVertexAttribArray(pos)
    glCtx.vertexAttribPointer(pos, 2, glCtx.FLOAT, false, 0, 0)

    const uTime = glCtx.getUniformLocation(prog, 'u_time')
    const uScroll = glCtx.getUniformLocation(prog, 'u_scroll')
    const uMouse = glCtx.getUniformLocation(prog, 'u_mouse')
    const uRes = glCtx.getUniformLocation(prog, 'u_resolution')

    const render = (t: number) => {
      if (typeof ResizeObserver === 'undefined') syncSize()
      glCtx.viewport(0, 0, canvas.width, canvas.height)
      if (uTime) glCtx.uniform1f(uTime, t * 0.001)
      if (uScroll) glCtx.uniform1f(uScroll, scrollRef.current)
      if (uMouse) glCtx.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y)
      if (uRes) glCtx.uniform2f(uRes, canvas.width, canvas.height)
      glCtx.drawArrays(glCtx.TRIANGLE_STRIP, 0, 4)
      animationRef.current = requestAnimationFrame(render)
    }

    animationRef.current = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current)
      }
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
    }
  }, [])

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none opacity-100 bg-[#05030b]">
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
      />
    </div>


  )
}


