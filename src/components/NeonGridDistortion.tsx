import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface NeonGridDistortionProps {
  grid?: number;
  mouse?: number;
  strength?: number;
  relaxation?: number;
  className?: string;
}

const vertexShader = `
uniform float time;
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform float time;
uniform vec4 resolution;
uniform sampler2D uDataTexture;
varying vec2 vUv;

// Neon gradient colors
vec3 neonPink = vec3(1.0, 0.2, 0.8);
vec3 neonBlue = vec3(0.2, 0.8, 1.0);
vec3 neonPurple = vec3(0.8, 0.2, 1.0);
vec3 neonCyan = vec3(0.0, 1.0, 1.0);

float noise(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 uv = vUv;
  
  // Add grid distortion
  vec4 offset = texture2D(uDataTexture, uv);
  vec2 distortedUV = uv + offset.rg * 0.02;
  
  // Create animated gradient background
  float time1 = time * 0.5;
  float time2 = time * 0.3;
  
  // Multiple gradient layers for depth
  vec3 color1 = mix(neonPink, neonBlue, sin(distortedUV.x + time1) * 0.5 + 0.5);
  vec3 color2 = mix(neonPurple, neonCyan, cos(distortedUV.y + time2) * 0.5 + 0.5);
  
  // Combine gradients
  vec3 finalColor = mix(color1, color2, 0.5);
  
  // Add some noise for texture
  float n = noise(distortedUV * 10.0 + time);
  finalColor += vec3(n * 0.1);
  
  // Add radial gradient from center
  vec2 center = vec2(0.5);
  float dist = distance(uv, center);
  float radialFade = 1.0 - smoothstep(0.0, 0.8, dist);
  finalColor *= radialFade * 0.8 + 0.2;
  
  // Add neon glow effect
  float glow = sin(distortedUV.x * 20.0 + time * 2.0) * 0.1 + 0.9;
  glow *= cos(distortedUV.y * 15.0 + time * 1.5) * 0.1 + 0.9;
  finalColor *= glow;
  
  gl_FragColor = vec4(finalColor, 1.0);
}
`;

const NeonGridDistortion: React.FC<NeonGridDistortionProps> = ({
  grid = 20,
  mouse = 0.15,
  strength = 0.2,
  relaxation = 0.8,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const planeRef = useRef<THREE.Mesh | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const camera = new THREE.OrthographicCamera(0, 0, 0, 0, -1000, 1000);
    camera.position.z = 2;
    cameraRef.current = camera;

    const uniforms = {
      time: { value: 0 },
      resolution: { value: new THREE.Vector4() },
      uDataTexture: { value: null as THREE.DataTexture | null }
    };

    // Create data texture for grid distortion
    const size = grid;
    const data = new Float32Array(4 * size * size);
    for (let i = 0; i < size * size; i++) {
      data[i * 4] = Math.random() * 2 - 1;
      data[i * 4 + 1] = Math.random() * 2 - 1;
    }

    const dataTexture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat, THREE.FloatType);
    dataTexture.needsUpdate = true;
    uniforms.uDataTexture.value = dataTexture;

    const material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: false
    });

    const geometry = new THREE.PlaneGeometry(1, 1, size - 1, size - 1);
    const plane = new THREE.Mesh(geometry, material);
    planeRef.current = plane;
    scene.add(plane);

    const handleResize = () => {
      if (!container || !renderer || !camera) return;

      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      if (width === 0 || height === 0) return;

      const containerAspect = width / height;

      renderer.setSize(width, height);

      if (plane) {
        plane.scale.set(containerAspect, 1, 1);
      }

      const frustumHeight = 1;
      const frustumWidth = frustumHeight * containerAspect;
      camera.left = -frustumWidth / 2;
      camera.right = frustumWidth / 2;
      camera.top = frustumHeight / 2;
      camera.bottom = -frustumHeight / 2;
      camera.updateProjectionMatrix();

      uniforms.resolution.value.set(width, height, 1, 1);
    };

    if (window.ResizeObserver) {
      const resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      resizeObserver.observe(container);
      resizeObserverRef.current = resizeObserver;
    } else {
      window.addEventListener('resize', handleResize);
    }

    const mouseState = {
      x: 0,
      y: 0,
      prevX: 0,
      prevY: 0,
      vX: 0,
      vY: 0
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1 - (e.clientY - rect.top) / rect.height;
      mouseState.vX = x - mouseState.prevX;
      mouseState.vY = y - mouseState.prevY;
      Object.assign(mouseState, { x, y, prevX: x, prevY: y });
    };

    const handleMouseLeave = () => {
      Object.assign(mouseState, {
        x: 0.5,
        y: 0.5,
        prevX: 0.5,
        prevY: 0.5,
        vX: 0,
        vY: 0
      });
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    handleResize();

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      if (!renderer || !scene || !camera || !dataTexture || !dataTexture.image || !dataTexture.image.data) return;

      uniforms.time.value += 0.05;

      if (!(dataTexture.image.data instanceof Float32Array)) {
        return;
      }
      const data: Float32Array = dataTexture.image.data;
      
      // Apply relaxation (damping)
      for (let i = 0; i < size * size; i++) {
        data[i * 4] *= relaxation;
        data[i * 4 + 1] *= relaxation;
      }

      // Apply mouse influence
      const gridMouseX = size * mouseState.x;
      const gridMouseY = size * mouseState.y;
      const maxDist = size * mouse;

      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const distSq = Math.pow(gridMouseX - i, 2) + Math.pow(gridMouseY - j, 2);
          if (distSq < maxDist * maxDist) {
            const index = 4 * (i + size * j);
            const power = Math.min(maxDist / Math.sqrt(distSq), 10);
            
            data[index] += strength * 100 * mouseState.vX * power;
            data[index + 1] -= strength * 100 * mouseState.vY * power;
          }
        }
      }

      dataTexture.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }

      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      } else {
        window.removeEventListener('resize', handleResize);
      }

      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);

      if (renderer) {
        renderer.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }

      if (geometry) geometry.dispose();
      if (material) material.dispose();
      if (dataTexture) dataTexture.dispose();

      sceneRef.current = null;
      rendererRef.current = null;
      cameraRef.current = null;
      planeRef.current = null;
    };
  }, [grid, mouse, strength, relaxation]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 ${className}`}
      style={{
        width: '100%',
        height: '100%'
      }}
    />
  );
};

export default NeonGridDistortion;
