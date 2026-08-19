import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0A0A0A',
          borderRadius: '44px',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          width="120"
          height="120"
        >
          {/* 'U' Monogram Shackle */}
          <path
            d="M 194 236 V 174 C 194 139.75 221.75 112 256 112 C 290.25 112 318 139.75 318 174 V 236"
            fill="none"
            stroke="#F8F7F4"
            strokeWidth="38"
            strokeLinecap="round"
          />
          {/* Vault Body */}
          <rect x="154" y="226" width="204" height="174" rx="32" fill="#F8F7F4" />
          {/* Minimalist Center Slot */}
          <rect x="243" y="278" width="26" height="70" rx="13" fill="#0A0A0A" />
        </svg>
      </div>
    ),
    { ...size }
  )
}
