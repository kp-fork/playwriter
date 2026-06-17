/**
 * Full-bleed hero for the Playwriter landing page.
 * Breaks out of the Above column constraint via w-screen + negative margin
 * (same pattern as sigillo's hero-section.tsx).
 *
 * Shows logo, tagline, CTA buttons (Chrome Extension + GitHub), and a
 * 4.7-star Chrome Web Store rating badge. Background uses VideoBackgroundShader
 * with a dot-grid fluid sim (video copied from sigillo).
 */
'use client'

import { VideoBackgroundShader } from '@holocron.so/vite/mdx'

function GithubIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox='0 0 24 24' fill='currentColor'>
      <path d='M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z' />
    </svg>
  )
}

/** Chrome icon from Element Plus, inherits currentColor. */
function ChromeIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox='0 0 1024 1024' fill='currentColor'>
      <path d='M938.7 512c0-44.6-6.9-87.6-19.6-128H682.7a212 212 0 0 1 42.6 128c.1 38.7-10.4 76.7-30.4 109.9L512 938.7c235.7 0 426.7-191 426.7-426.7' />
      <path d='M576.8 401.6a128 128 0 0 0-63.6-17.6a128 128 0 0 0-111.1 62.4a128 128 0 0 0-2.2 127.5l1.3 2.1a128 128 0 0 0 46.3 46.6A128 128 0 0 0 511 640c22.3.2 44.3-5.4 63.7-16.3a128 128 0 0 0 47.2-45.8l1-1.9a128 128 0 0 0 .4-127.5a128 128 0 0 0-46.4-46.9' />
      <path d='M394.5 334A213 213 0 0 1 512 298.7h369.6A427 427 0 0 0 512 85.3a426 426 0 0 0-171.7 36a426 426 0 0 0-142.7 102.2l118.2 204.7a213 213 0 0 1 78.6-94.2m20.4 368a213 213 0 0 1-89.6-86.9L142.5 298.6a426.8 426.8 0 0 0 276.8 630l118.2-204.7a213 213 0 0 1-122.7-22' />
    </svg>
  )
}

function StarIcon({ filled, half }: { filled?: boolean; half?: boolean }) {
  if (half) {
    return (
      <svg width={14} height={14} viewBox='0 0 24 24'>
        <defs>
          <linearGradient id='half-star'>
            <stop offset='50%' stopColor='#FACC15' />
            <stop offset='50%' stopColor='transparent' />
          </linearGradient>
        </defs>
        <path
          d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'
          fill='url(#half-star)'
          stroke='#FACC15'
          strokeWidth={1.5}
        />
      </svg>
    )
  }
  return (
    <svg width={14} height={14} viewBox='0 0 24 24'>
      <path
        d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'
        fill={filled ? '#FACC15' : 'none'}
        stroke='#FACC15'
        strokeWidth={1.5}
      />
    </svg>
  )
}

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating)
  const hasHalf = rating - fullStars >= 0.3
  const stars: React.ReactNode[] = Array.from({ length: 5 }, (_, i) => {
    if (i < fullStars) {
      return <StarIcon key={i} filled />
    }
    if (i === fullStars && hasHalf) {
      return <StarIcon key={i} half />
    }
    return <StarIcon key={i} />
  })

  return (
    <a
      href='https://chromewebstore.google.com/detail/playwriter/jfeammnjpkecdekppnclgkkffahnhfhe'
      target='_blank'
      rel='noopener noreferrer'
      className='flex items-center gap-2 mt-5 no-underline text-foreground/50 hover:text-foreground/70 transition-colors'
    >
      <div className='flex items-center gap-0.5'>{stars}</div>
      <span className='text-[13px] font-medium'>{rating}</span>
      <span className='text-[12px] text-foreground/40'>·</span>
      <span className='text-[12px] text-foreground/40'>20k+ users</span>
    </a>
  )
}

const HERO_FONT = "'IvarText', serif"

const CHROME_EXTENSION_URL =
  'https://chromewebstore.google.com/detail/playwriter/jfeammnjpkecdekppnclgkkffahnhfhe'
const GITHUB_URL = 'https://github.com/remorses/playwriter'

export function HeroSection() {
  return (
    <div className='relative mt-2 lg:mt-4 mb-4 lg:mb-6 w-screen ml-[calc(-50vw+50%)] flex flex-col items-center overflow-hidden'>
      <VideoBackgroundShader
        src='/assets/hero-bg.mp4'
        className='absolute inset-0 w-full h-full'
        canvasClassName='dark:opacity-60 opacity-40'
        dotColor='rgba(255, 149, 0, 0.7)'
        dotSize={6}
        minDotSize={1}
        dotMargin={1}
        animSpeed={3}
        gamma={0.8}
        enableMask={false}
        fluidStrength={0.15}
        fluidCurl={80}
      />

      {/* Foreground content */}
      <div className='relative z-[2] flex flex-col items-center justify-center px-6 pt-10 sm:pt-14 pb-4'>
        <div className='flex flex-col items-center text-center'>
          <img
            src='/playwriter-logo.svg'
            alt='Playwriter'
            className='h-8 mb-5 dark:invert'
          />
          <h1 className='flex flex-col items-center leading-tight'>
            <span
              className='text-[28px] sm:text-[36px] md:text-[44px] text-foreground'
              style={{ fontFamily: HERO_FONT }}
            >
              let agents control
            </span>
            <span
              className='text-[28px] sm:text-[36px] md:text-[44px] text-foreground -mt-1 sm:-mt-2'
              style={{ fontFamily: HERO_FONT }}
            >
              your Chrome browser.
            </span>
          </h1>

          {/* CTA buttons */}
          <div className='flex items-center gap-3 mt-7 sm:mt-8'>
            <a
              href={CHROME_EXTENSION_URL}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-2 px-4 py-2 bg-white text-black hover:opacity-90 transition-opacity rounded-md font-medium text-xs cursor-pointer no-underline'
            >
              <ChromeIcon size={16} />
              Chrome Extension
            </a>
            <a
              href={GITHUB_URL}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-2 px-4 py-2 border border-border bg-background hover:bg-muted transition-colors rounded-md font-medium text-xs cursor-pointer no-underline'
            >
              <GithubIcon size={14} />
              GitHub
            </a>
          </div>

          {/* 4.7 star rating */}
          <StarRating rating={4.7} />

          <a
            href='#getting-started'
            className='mt-6 mb-2 flex flex-col items-center gap-1 text-[11px] font-mono text-foreground/30 hover:text-foreground/60 transition-colors no-underline'
          >
            Learn more
            <ArrowDownIcon />
          </a>
        </div>
      </div>
    </div>
  )
}

function ArrowDownIcon() {
  return (
    <svg
      width={12}
      height={12}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M12 5v14M19 12l-7 7-7-7' />
    </svg>
  )
}
