"use client";

import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";

interface SandglassProps {
    percentage: number; // 0 to 100
}

export function Sandglass({ percentage }: SandglassProps) {
    // Clamp percentage
    const p = Math.min(100, Math.max(0, percentage));

    // Calculate heights for sand
    // Total height of one bulb part (approx)
    const bulbHeight = 100;

    // Bottom sand height grows with percentage
    const bottomSandHeight = (p / 100) * bulbHeight;

    // Top sand height shrinks
    const topSandHeight = bulbHeight - bottomSandHeight;

    return (
        <div className="relative w-64 h-96 flex justify-center items-center">
            {/* Glow Effects */}
            <div className="absolute inset-0 bg-brand-500/20 blur-[60px] rounded-full animate-pulse-slow" />

            <svg
                width="200"
                height="350"
                viewBox="0 0 200 350"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="z-10 drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]"
            >
                {/* Glass Container */}
                <path
                    d="M40 10 
             H160 
             C160 10 170 80 100 175 
             C30 80 40 10 40 10 
             Z"
                    className="stroke-slate-500/50 stroke-2 fill-surface-card/10 backdrop-blur-sm"
                />
                <path
                    d="M100 175
              C170 270 160 340 160 340
              H40
              C40 340 30 270 100 175
              Z"
                    className="stroke-slate-500/50 stroke-2 fill-surface-card/10 backdrop-blur-sm"
                />

                {/* Top Sand (Remaining) */}
                <mask id="topSandMask">
                    <path d="M40 10 H160 C160 10 170 80 100 175 C30 80 40 10 40 10 Z" fill="white" />
                </mask>
                <motion.rect
                    x="0"
                    y={10 + (bulbHeight - topSandHeight)} // Start lower as sand drains
                    width="200"
                    height={topSandHeight}
                    fill="url(#sandGradient)"
                    mask="url(#topSandMask)"
                    initial={{ y: 0, height: 100 }} // animate properly in real usage
                    animate={{
                        y: 10 + (100 - (100 - (p / 100) * 100)), // dynamic calculation simplified
                        height: (100 - p)
                    }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                />

                {/* Bottom Sand (Accumulated) */}
                <mask id="bottomSandMask">
                    <path d="M100 175 C170 270 160 340 160 340 H40 C40 340 30 270 100 175 Z" fill="white" />
                </mask>
                <motion.rect
                    x="0"
                    y={340 - bottomSandHeight}
                    width="200"
                    height={bottomSandHeight}
                    fill="url(#sandGradient)"
                    mask="url(#bottomSandMask)"
                    initial={{ height: 0, y: 340 }}
                    animate={{ height: p, y: 340 - p }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                />

                {/* Falling Stream */}
                {p < 100 && (
                    <motion.path
                        d="M100 175 V340"
                        stroke="url(#sandGradient)"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        animate={{ strokeDashoffset: [0, -8] }}
                        transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
                    />
                )}

                {/* Definitions */}
                <defs>
                    <linearGradient id="sandGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="50%" stopColor="#d946ef" />
                        <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Percentage Text Overlay */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-20 text-center z-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-5xl font-bold text-white drop-shadow-lg"
                >
                    {Math.round(p)}%
                </motion.div>
                <p className="text-slate-400 text-sm tracking-wider uppercase mt-1">Learned</p>
            </div>

            {/* Particles System (Simple CSS/JS approach for 'colorful cool effects') */}
            <Particles />
        </div>
    );
}

function Particles() {
    // Generate random particles
    const particles = Array.from({ length: 20 });

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {particles.map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full bg-brand-400"
                    initial={{
                        x: Math.random() * 200 - 100 + "px", // random start relative to center
                        y: Math.random() * 300 - 150 + "px",
                        opacity: 0,
                        scale: 0
                    }}
                    animate={{
                        y: [null, Math.random() * 100 + 50], // fall down or float
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                    }}
                    transition={{
                        duration: 2 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                        ease: "easeInOut"
                    }}
                    style={{
                        left: "50%",
                        top: "50%",
                        backgroundColor: ["#8b5cf6", "#d946ef", "#06b6d4"][Math.floor(Math.random() * 3)]
                    }}
                />
            ))}
        </div>
    );
}
