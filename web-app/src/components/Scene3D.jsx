import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

function Geometries() {
  const group = useRef()
  const torus = useRef()
  const cube = useRef()
  const ico = useRef()
  const ring = useRef()
  const oct = useRef()

  const concreteMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#B8B8B2', roughness: 0.55, metalness: 0.45
  }), [])
  const darkMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#888882', roughness: 0.6, metalness: 0.4
  }), [])
  const lightMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#D4D4D0', roughness: 0.5, metalness: 0.5
  }), [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (torus.current) { torus.current.rotation.x += 0.002; torus.current.rotation.y += 0.003 }
    if (cube.current) { cube.current.rotation.x += 0.003; cube.current.rotation.y += 0.002 }
    if (ico.current) { ico.current.rotation.y += 0.005 }
    if (ring.current) { ring.current.rotation.z += 0.001; ring.current.rotation.x += 0.002 }
    if (oct.current) { oct.current.rotation.x += 0.004; oct.current.rotation.z += 0.003 }
  })

  return (
    <group ref={group}>
      <Float speed={0.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <mesh ref={torus} position={[3.5, 1.5, -2]} material={concreteMat}>
          <torusKnotGeometry args={[1, 0.2, 100, 16]} />
        </mesh>
      </Float>
      <Float speed={0.7} rotationIntensity={0.3} floatIntensity={0.4}>
        <mesh ref={cube} position={[-3, -0.5, -1.5]} rotation={[0.5, 0.8, 0.3]} material={darkMat}>
          <boxGeometry args={[1.4, 1.4, 1.4]} />
        </mesh>
      </Float>
      <Float speed={0.9} rotationIntensity={0.4} floatIntensity={0.5}>
        <mesh ref={ico} position={[2, 3, -2.5]} material={lightMat}>
          <icosahedronGeometry args={[0.45, 1]} />
        </mesh>
      </Float>
      <Float speed={0.4} rotationIntensity={0.15} floatIntensity={0.25}>
        <mesh ref={ring} position={[-2, 1.5, -3.5]} rotation={[1.2, 0.3, 0]} material={concreteMat}>
          <torusGeometry args={[0.8, 0.06, 32, 80]} />
        </mesh>
      </Float>
      <Float speed={0.6} rotationIntensity={0.25} floatIntensity={0.35}>
        <mesh ref={oct} position={[3, -2, -2]} material={darkMat}>
          <octahedronGeometry args={[0.5, 0]} />
        </mesh>
      </Float>
    </group>
  )
}

export default function Scene3D() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 6], fov: 55 }} dpr={[1, 1.5]} gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0 }}>
        <fog attach="fog" args={['#0D0D0C', 4, 14]} />
        <ambientLight intensity={0.3} color="#666666" />
        <directionalLight position={[5, 8, 5]} intensity={2} color="#ffffff" castShadow />
        <directionalLight position={[-3, -1, -3]} intensity={1} color="#888888" />
        <pointLight position={[3, 2, -2]} intensity={20} color="#ffffff" />
        <pointLight position={[-4, -1, -1]} intensity={12} color="#888888" />
        <Geometries />
      </Canvas>
    </div>
  )
}
