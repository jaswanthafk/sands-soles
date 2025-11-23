
import React, { useState, Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF, Clone } from '@react-three/drei';
import { ShoppingBag, ArrowLeft, RotateCcw } from 'lucide-react';
import { Product } from '../types';
import * as THREE from 'three';

interface CustomizeViewProps {
  onAddToCart: (product: Product, size: string) => void;
}

// A component to handle the sneaker model and color changing
const CustomSneaker = ({ color }: { color: string }) => {
  const { scene } = useGLTF("https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb");
  const objectRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (objectRef.current) {
        objectRef.current.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            if (Array.isArray(mesh.material)) {
                mesh.material.forEach(m => (m as THREE.MeshStandardMaterial).color.set(color));
            } else {
                (mesh.material as THREE.MeshStandardMaterial).color.set(color);
            }
          }
        });
    }
  }, [color]);

  return <Clone ref={objectRef} object={scene} scale={10} rotation={[0, Math.PI / 2, 0]} />;
};

const COLORS = [
  { name: 'Sand', hex: '#EBEBE9' },
  { name: 'Midnight', hex: '#1F2937' },
  { name: 'Neon', hex: '#C1F055' },
  { name: 'Clay', hex: '#B45309' },
  { name: 'Ocean', hex: '#0EA5E9' },
];

const SIZES = ['US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12'];

const CustomizeView: React.FC<CustomizeViewProps> = ({ onAddToCart }) => {
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedSize, setSelectedSize] = useState('');

  const handleAddToCart = () => {
    if (!selectedSize) return;
    
    const customProduct: Product = {
      id: `custom-${Date.now()}`,
      name: `Dune One (${selectedColor.name})`,
      brand: 'Sands & Souls',
      price: 85.000,
      image: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb', // Placeholder for cart image logic
      description: 'Custom designed sneaker with premium materials.',
      tags: ['custom', 'exclusive'],
      color: selectedColor.name,
      category: 'UNISEX'
    };

    onAddToCart(customProduct, selectedSize);
  };

  return (
    <div className="min-h-screen bg-[#EBEBE9] flex flex-col pt-20 transition-colors duration-300">
      <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-80px)]">
        
        {/* 3D Canvas Area */}
        <div className="w-full lg:w-2/3 relative bg-[#E0E0DC] border-b lg:border-b-0 lg:border-r border-white/20">
          <div className="absolute top-6 left-6 z-10">
             <h2 className="text-4xl md:text-6xl font-display font-bold text-gray-900/10 uppercase pointer-events-none select-none">
                Create
             </h2>
          </div>
          
          <div className="absolute top-6 right-6 z-10 flex gap-2">
             <div className="bg-white/50 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-600 flex items-center gap-1">
                <RotateCcw size={12} /> 360° VIEW
             </div>
          </div>

          {/* Adjusted camera position to zoom in */}
          <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 25], fov: 45 }}>
             <Suspense fallback={null}>
                <Stage environment="city" intensity={0.7} adjustCamera={false}>
                   <CustomSneaker color={selectedColor.hex} />
                </Stage>
                <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 1.8} />
             </Suspense>
          </Canvas>
        </div>

        {/* Controls Area */}
        <div className="w-full lg:w-1/3 bg-white p-8 flex flex-col overflow-y-auto border-l border-gray-100 transition-colors">
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold text-gray-900 uppercase mb-2">Dune One Custom</h1>
                <p className="text-gray-500 text-sm">Designed by You. Crafted by Sands & Souls.</p>
                <p className="text-2xl font-bold text-gray-900 mt-4">KWD 85.000</p>
            </div>

            {/* Color Picker */}
            <div className="mb-8">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-3">Select Material Color</label>
                <div className="grid grid-cols-5 gap-3">
                    {COLORS.map((c) => (
                        <button
                            key={c.name}
                            onClick={() => setSelectedColor(c)}
                            className={`
                                w-10 h-10 rounded-full border-2 transition-all relative group
                                ${selectedColor.name === c.name ? 'border-black scale-110' : 'border-gray-100 hover:border-gray-300'}
                            `}
                            style={{ backgroundColor: c.hex }}
                            aria-label={c.name}
                        >
                            {selectedColor.name === c.name && (
                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-black whitespace-nowrap">
                                    {c.name}
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Size Picker */}
            <div className="mb-auto">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-3">Select Size</label>
                <div className="grid grid-cols-3 gap-2">
                    {SIZES.map((s) => (
                        <button
                            key={s}
                            onClick={() => setSelectedSize(s)}
                            className={`
                                py-3 rounded-xl text-sm font-bold border transition-all
                                ${selectedSize === s 
                                    ? 'bg-black text-white border-black' 
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-black'}
                            `}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Action Button */}
            <div className="pt-8 border-t border-gray-100 mt-8">
                <button
                    onClick={handleAddToCart}
                    disabled={!selectedSize}
                    className="w-full py-4 bg-accent text-black font-bold rounded-xl hover:bg-lime-400 disabled:bg-gray-100 disabled:text-gray-400 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-accent/20 disabled:shadow-none"
                >
                    <ShoppingBag size={20} />
                    {selectedSize ? 'ADD TO BAG' : 'SELECT SIZE'}
                </button>
                <p className="text-[10px] text-gray-400 text-center mt-4">
                    Custom orders take 2-3 weeks for delivery.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizeView;