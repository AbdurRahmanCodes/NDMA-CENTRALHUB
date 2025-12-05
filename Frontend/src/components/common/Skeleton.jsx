import React from 'react';
import { motion } from 'framer-motion';

/**
 * Skeleton loader with shimmer effect
 */
export const Skeleton = ({ className = '', width = '100%', height = '20px', rounded = 'rounded-md' }) => (
    <div
        className={`relative overflow-hidden bg-gray-800 ${rounded} ${className}`}
        style={{ width, height }}
    >
        <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700/50 to-transparent"
            animate={{
                x: ['-100%', '100%']
            }}
            transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: 'linear'
            }}
        />
    </div>
);

/**
 * Metric card skeleton
 */
export const MetricCardSkeleton = () => (
    <div className="rounded-xl p-4 bg-gray-800/50 border border-gray-700/50">
        <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
                <Skeleton width="60%" height="12px" />
                <Skeleton width="80%" height="32px" />
                <Skeleton width="40%" height="10px" />
            </div>
            <Skeleton width="40px" height="40px" rounded="rounded-lg" />
        </div>
    </div>
);

/**
 * City list item skeleton
 */
export const CityItemSkeleton = () => (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
            <Skeleton width="100px" height="16px" />
            <Skeleton width="50px" height="16px" />
        </div>
        <div className="flex gap-3">
            <Skeleton width="60px" height="12px" />
            <Skeleton width="70px" height="12px" />
        </div>
    </div>
);

/**
 * Sidebar loading skeleton
 */
export const SidebarLoadingSkeleton = () => (
    <div className="h-full flex flex-col bg-gray-900 border-r border-gray-800">
        {/* Search skeleton */}
        <div className="p-5 border-b border-gray-800">
            <Skeleton height="40px" rounded="rounded-xl" />
        </div>

        {/* Location info skeleton */}
        <div className="p-5 border-b border-gray-800">
            <Skeleton width="40%" height="12px" className="mb-2" />
            <Skeleton width="70%" height="18px" className="mb-2" />
            <Skeleton width="50%" height="10px" />
        </div>

        {/* Metric cards skeleton */}
        <div className="p-5 border-b border-gray-800 space-y-3">
            <Skeleton width="50%" height="12px" className="mb-3" />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
        </div>

        {/* Cities list skeleton */}
        <div className="flex-1 overflow-hidden p-5">
            <Skeleton width="40%" height="12px" className="mb-3" />
            <div className="space-y-2">
                <CityItemSkeleton />
                <CityItemSkeleton />
                <CityItemSkeleton />
                <CityItemSkeleton />
            </div>
        </div>
    </div>
);

export default SidebarLoadingSkeleton;
