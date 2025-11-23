
import React, { Suspense, useRef, useLayoutEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF, Float, Clone } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SneakerModel = () => {
  // Using a standard sample GLTF for reliability. In a real app, this would be the specific product asset.
  const { scene } = useGLTF("https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb");
  
  return (
    <Clone 
      object={scene} 
      scale={10} 
      rotation={[0, Math.PI / 2, 0]} 
    />
  );
};

const Showcase: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  // Fix: useRef<number>() requires an argument in some TS configurations. Initializing with null.
  const timerRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
        gsap.fromTo(".showcase-text > *", 
            { y: 50, opacity: 0 },
            { 
                y: 0, 
                opacity: 1, 
                duration: 0.8, 
                stagger: 0.1,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                }
            }
        );

        gsap.fromTo(".showcase-model",
            { x: 50, opacity: 0 },
            {
                x: 0,
                opacity: 1,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 75%",
                }
            }
        );

    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleStart = () => {
    setAutoRotate(false);
    if (timerRef.current) {
        clearTimeout(timerRef.current);
    }
  };

  const handleEnd = () => {
    timerRef.current = window.setTimeout(() => {
        setAutoRotate(true);
    }, 3000); // Restart after 3 seconds of inactivity
  };

  return (
    <section ref={containerRef} className="py-20 relative">
        <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Text Content */}
            <div className="w-full md:w-1/2 space-y-6 z-10 showcase-text">
                <h4 className="text-accent font-bold tracking-widest uppercase text-sm">Featured Collection</h4>
                <h2 className="text-5xl md:text-7xl font-display font-bold text-gray-900 leading-none">
                    THE DUNE <br /> SERIES
                </h2>
                <p className="text-gray-500 max-w-md leading-relaxed">
                    Experience our latest silhouette in full 3D. Inspired by the shifting sands of the Arabian desert. Rotate the model to see the rugged textures designed for the heat.
                </p>
                <button className="px-8 py-4 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-all flex items-center gap-2 group">
                    EXPLORE COLLECTION
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
            </div>

            {/* 3D Model Canvas */}
            <div className="w-full md:w-1/2 h-[400px] md:h-[500px] relative bg-[#DFDFD9] rounded-3xl overflow-hidden shadow-inner border border-white/20 showcase-model">
                 <div className="absolute top-4 right-4 z-20 bg-white/50 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-600 pointer-events-none">
                    INTERACTIVE 3D
                 </div>
                 
                 <Canvas shadows dpr={[1, 2]} camera={{ fov: 45 }}>
                    <Suspense fallback={null}>
                        <Stage environment="city" intensity={0.6}>
                            <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                                <SneakerModel />
                            </Float>
                        </Stage>
                        <OrbitControls 
                            autoRotate={autoRotate}
                            autoRotateSpeed={1.5}
                            enableZoom={false}
                            minPolarAngle={Math.PI / 4}
                            maxPolarAngle={Math.PI / 2}
                            onStart={handleStart}
                            onEnd={handleEnd}
                        />
                    </Suspense>
                 </Canvas>
            </div>
        </div>
    </section>
  );
};

export default Showcase;
