import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

interface ProfileCardProps {
    name: string
    totalWasted: number
    rank: number
    txCount: number
    memberSince: string
    onClose: () => void
}

function getRankTitle(rank: number) {
    if (rank === 1) return 'Supreme Waster'
    if (rank <= 3) return 'Elite Waster'
    if (rank <= 10) return 'Top Waster'
    if (rank <= 25) return 'Dedicated Waster'
    return 'Certified Waster'
}

/** Draw a circle-slash icon (ban icon) */
function drawBanIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, color: string) {
    ctx.strokeStyle = color
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(cx - r * 0.7, cy + r * 0.7)
    ctx.lineTo(cx + r * 0.7, cy - r * 0.7)
    ctx.stroke()
}

/** Draw a small trophy icon */
function drawTrophyIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, color: string) {
    ctx.fillStyle = color
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    // Cup body
    ctx.beginPath()
    ctx.moveTo(cx - size * 0.4, cy - size * 0.4)
    ctx.lineTo(cx - size * 0.3, cy + size * 0.15)
    ctx.lineTo(cx + size * 0.3, cy + size * 0.15)
    ctx.lineTo(cx + size * 0.4, cy - size * 0.4)
    ctx.closePath()
    ctx.fill()
    // Stem
    ctx.fillRect(cx - size * 0.06, cy + size * 0.15, size * 0.12, size * 0.2)
    // Base
    ctx.fillRect(cx - size * 0.2, cy + size * 0.35, size * 0.4, size * 0.06)
}

/** Draw a small flame icon */
function drawFlameIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, color: string) {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(cx, cy - size * 0.5)
    ctx.bezierCurveTo(cx + size * 0.35, cy - size * 0.15, cx + size * 0.4, cy + size * 0.2, cx, cy + size * 0.5)
    ctx.bezierCurveTo(cx - size * 0.4, cy + size * 0.2, cx - size * 0.35, cy - size * 0.15, cx, cy - size * 0.5)
    ctx.fill()
}

/** Draw a skull icon */
function drawSkullIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, color: string) {
    ctx.fillStyle = color
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    // Head
    ctx.beginPath()
    ctx.arc(cx, cy - size * 0.05, size * 0.35, Math.PI, 0)
    ctx.lineTo(cx + size * 0.35, cy + size * 0.2)
    ctx.lineTo(cx - size * 0.35, cy + size * 0.2)
    ctx.closePath()
    ctx.stroke()
    // Eyes
    ctx.beginPath()
    ctx.arc(cx - size * 0.12, cy - size * 0.05, size * 0.08, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(cx + size * 0.12, cy - size * 0.05, size * 0.08, 0, Math.PI * 2)
    ctx.fill()
}

/** Draw the card image on a canvas and return as data URL */
function drawCardToCanvas(props: { name: string; totalWasted: number; rank: number; txCount: number; memberSince: string }): string {
    const W = 880 // 2x for retina
    const H = 600
    const canvas = document.createElement('canvas')
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext('2d')!

    // === Background ===
    const bgGrad = ctx.createLinearGradient(0, 0, W, H)
    bgGrad.addColorStop(0, '#1a1025')
    bgGrad.addColorStop(0.5, '#0d0d1a')
    bgGrad.addColorStop(1, '#12071f')
    ctx.fillStyle = bgGrad
    roundRect(ctx, 0, 0, W, H, 40)
    ctx.fill()

    // === Ambient glow effects ===
    ctx.save()
    const glow1 = ctx.createRadialGradient(W - 120, 80, 0, W - 120, 80, 200)
    glow1.addColorStop(0, 'rgba(139, 92, 246, 0.12)')
    glow1.addColorStop(1, 'rgba(139, 92, 246, 0)')
    ctx.fillStyle = glow1
    ctx.fillRect(0, 0, W, H)
    const glow2 = ctx.createRadialGradient(200, H - 100, 0, 200, H - 100, 180)
    glow2.addColorStop(0, 'rgba(217, 70, 239, 0.08)')
    glow2.addColorStop(1, 'rgba(217, 70, 239, 0)')
    ctx.fillStyle = glow2
    ctx.fillRect(0, 0, W, H)
    ctx.restore()

    // === Border ===
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.25)'
    ctx.lineWidth = 2
    roundRect(ctx, 1, 1, W - 2, H - 2, 40)
    ctx.stroke()

    // === Top gradient bar ===
    const barGrad = ctx.createLinearGradient(0, 0, W, 0)
    barGrad.addColorStop(0, '#8b5cf6')
    barGrad.addColorStop(0.5, '#d946ef')
    barGrad.addColorStop(1, '#8b5cf6')
    ctx.save()
    roundRect(ctx, 0, 0, W, 8, 40)
    ctx.clip()
    ctx.fillStyle = barGrad
    ctx.fillRect(0, 0, W, 8)
    ctx.restore()

    const pad = 64

    // === Logo area ===
    const logoGrad = ctx.createLinearGradient(pad, 40, pad + 56, 96)
    logoGrad.addColorStop(0, '#8b5cf6')
    logoGrad.addColorStop(1, '#d946ef')
    ctx.fillStyle = logoGrad
    roundRect(ctx, pad, 44, 56, 56, 14)
    ctx.fill()
    // Draw ban icon inside logo
    drawBanIcon(ctx, pad + 28, 72, 16, 'white')

    // Brand name
    ctx.font = 'bold 28px system-ui, -apple-system, sans-serif'
    ctx.fillStyle = '#e2e8f0'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillText('SubForNothing', pad + 72, 72)

    // Receipt label
    ctx.font = '600 20px system-ui, sans-serif'
    ctx.fillStyle = 'rgba(139, 92, 246, 0.6)'
    ctx.textAlign = 'right'
    ctx.letterSpacing = '2px'
    ctx.fillText('RECEIPT OF NOTHING', W - pad, 72)

    // === Username ===
    const nameGrad = ctx.createLinearGradient(pad, 130, pad + 400, 130)
    nameGrad.addColorStop(0, '#c4b5fd')
    nameGrad.addColorStop(1, '#f0abfc')
    ctx.font = '800 52px system-ui, -apple-system, sans-serif'
    ctx.fillStyle = nameGrad
    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'
    ctx.fillText(props.name, pad, 150)

    // Rank title
    ctx.font = '500 22px system-ui, sans-serif'
    ctx.fillStyle = 'rgba(226, 232, 240, 0.45)'
    ctx.fillText(getRankTitle(props.rank), pad, 180)

    // === Main stat box ===
    const boxY = 210
    const boxH = 160
    const boxGrad = ctx.createLinearGradient(pad, boxY, W - pad, boxY + boxH)
    boxGrad.addColorStop(0, 'rgba(139, 92, 246, 0.1)')
    boxGrad.addColorStop(1, 'rgba(217, 70, 239, 0.04)')
    ctx.fillStyle = boxGrad
    roundRect(ctx, pad, boxY, W - pad * 2, boxH, 28)
    ctx.fill()
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.15)'
    ctx.lineWidth = 2
    roundRect(ctx, pad, boxY, W - pad * 2, boxH, 28)
    ctx.stroke()

    // "TOTAL MONEY WASTED" label
    ctx.font = '600 18px system-ui, sans-serif'
    ctx.fillStyle = 'rgba(226, 232, 240, 0.35)'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('TOTAL MONEY WASTED', W / 2, boxY + 34)

    // Amount
    const amtGrad = ctx.createLinearGradient(W / 2 - 180, 0, W / 2 + 180, 0)
    amtGrad.addColorStop(0, '#a78bfa')
    amtGrad.addColorStop(0.5, '#e879f9')
    amtGrad.addColorStop(1, '#f472b6')
    ctx.font = '800 76px system-ui, -apple-system, sans-serif'
    ctx.fillStyle = amtGrad
    ctx.fillText('$' + props.totalWasted.toLocaleString(), W / 2, boxY + 96)

    // "on absolutely nothing"
    ctx.font = '400 20px system-ui, sans-serif'
    ctx.fillStyle = 'rgba(226, 232, 240, 0.25)'
    ctx.fillText('on absolutely nothing', W / 2, boxY + 138)

    // === Stats row ===
    const statsY = 396
    const statsH = 110
    const gap = 20
    const colW = (W - pad * 2 - gap * 2) / 3

    const statsData = [
        { label: 'RANK', value: '#' + (props.rank || '—'), color: '#facc15', iconDraw: (cx: number, cy: number) => drawTrophyIcon(ctx, cx, cy, 28, '#facc15') },
        { label: 'PAYMENTS', value: String(props.txCount), color: '#e2e8f0', iconDraw: (cx: number, cy: number) => drawFlameIcon(ctx, cx, cy, 26, '#f97316') },
        { label: 'VALUE', value: '$0', color: '#ef4444', iconDraw: (cx: number, cy: number) => drawSkullIcon(ctx, cx, cy, 28, '#ef4444') },
    ]

    statsData.forEach((stat, i) => {
        const x = pad + i * (colW + gap)
        // Box bg
        ctx.fillStyle = 'rgba(255, 255, 255, 0.03)'
        roundRect(ctx, x, statsY, colW, statsH, 20)
        ctx.fill()
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)'
        ctx.lineWidth = 1
        roundRect(ctx, x, statsY, colW, statsH, 20)
        ctx.stroke()

        // Label (centered, no icon overlap)
        ctx.font = '600 16px system-ui, sans-serif'
        ctx.fillStyle = 'rgba(226, 232, 240, 0.35)'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(stat.label, x + colW / 2, statsY + 30)

        // Value
        ctx.font = '700 38px system-ui, -apple-system, sans-serif'
        ctx.fillStyle = stat.color
        ctx.textAlign = 'center'
        ctx.fillText(stat.value, x + colW / 2, statsY + 74)
    })

    // === Footer ===
    const footY = H - 44
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(pad, footY - 22)
    ctx.lineTo(W - pad, footY - 22)
    ctx.stroke()

    ctx.font = '400 20px system-ui, sans-serif'
    ctx.fillStyle = 'rgba(226, 232, 240, 0.25)'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    const memberDate = new Date(props.memberSince).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    ctx.fillText('Member since ' + memberDate, pad, footY)

    ctx.font = '600 20px system-ui, sans-serif'
    ctx.fillStyle = 'rgba(139, 92, 246, 0.45)'
    ctx.textAlign = 'right'
    ctx.fillText('subfornothing.vercel.app', W - pad, footY)

    return canvas.toDataURL('image/png')
}

/** Helper: draw a rounded rectangle path */
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + r)
    ctx.lineTo(x + w, y + h - r)
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    ctx.lineTo(x + r, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - r)
    ctx.lineTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
    ctx.closePath()
}

export default function ProfileCard({ name, totalWasted, rank, txCount, memberSince, onClose }: ProfileCardProps) {
    const [isCapturing, setIsCapturing] = useState(false)

    const handleDownload = () => {
        setIsCapturing(true)
        try {
            const dataUrl = drawCardToCanvas({ name, totalWasted, rank, txCount, memberSince })
            const link = document.createElement('a')
            link.href = dataUrl
            link.download = `subfornothing-${name.toLowerCase().replace(/\s+/g, '-')}.png`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (err) {
            console.error('[ProfileCard] download failed:', err)
        } finally {
            setIsCapturing(false)
        }
    }

    const handleShareX = () => {
        handleDownload()
        const tweetText = encodeURIComponent(
            `I just wasted $${totalWasted.toLocaleString()} on absolutely nothing 🔥\n\nRank #${rank} on the leaderboard of shame.\n\nsubfornothing.vercel.app`
        )
        window.open(`https://x.com/intent/tweet?text=${tweetText}`, '_blank')
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            {/* Close on backdrop click */}
            <div className="absolute inset-0" onClick={onClose} />

            <div className="relative z-10 flex flex-col items-center gap-4 max-w-md w-full">
                {/* Visual preview card */}
                <div
                    style={{
                        width: '440px',
                        padding: '0',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        background: 'linear-gradient(135deg, #1a1025 0%, #0d0d1a 50%, #12071f 100%)',
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                    }}
                >
                    {/* Top gradient bar */}
                    <div style={{ height: '4px', background: 'linear-gradient(90deg, #8b5cf6, #d946ef, #8b5cf6)' }} />

                    <div style={{ padding: '32px' }}>
                        {/* Header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{
                                    width: '32px', height: '32px', borderRadius: '8px',
                                    background: 'linear-gradient(135deg, #8b5cf6, #d946ef)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
                                }}>🚫</div>
                                <span style={{ fontSize: '14px', fontWeight: 700, color: '#e2e8f0' }}>SubForNothing</span>
                            </div>
                            <span style={{ fontSize: '11px', color: 'rgba(139, 92, 246, 0.7)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' as const }}>
                                Receipt of Nothing
                            </span>
                        </div>

                        {/* Name */}
                        <div style={{ marginBottom: '24px' }}>
                            <h2 style={{
                                fontSize: '28px', fontWeight: 800,
                                background: 'linear-gradient(90deg, #c4b5fd, #f0abfc)',
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                                marginBottom: '6px', lineHeight: 1.2,
                            }}>{name}</h2>
                            <p style={{ fontSize: '13px', color: 'rgba(226, 232, 240, 0.5)', fontWeight: 500 }}>{getRankTitle(rank)}</p>
                        </div>

                        {/* Main stat */}
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(217, 70, 239, 0.05))',
                            border: '1px solid rgba(139, 92, 246, 0.15)', borderRadius: '14px',
                            padding: '24px', marginBottom: '20px', textAlign: 'center' as const,
                        }}>
                            <p style={{ fontSize: '11px', color: 'rgba(226, 232, 240, 0.4)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: '8px' }}>
                                Total Money Wasted
                            </p>
                            <p style={{
                                fontSize: '42px', fontWeight: 800,
                                background: 'linear-gradient(90deg, #a78bfa, #e879f9, #f472b6)',
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                                lineHeight: 1.1, letterSpacing: '-0.02em',
                            }}>${totalWasted.toLocaleString()}</p>
                            <p style={{ fontSize: '12px', color: 'rgba(226, 232, 240, 0.3)', marginTop: '6px' }}>on absolutely nothing</p>
                        </div>

                        {/* Stats row */}
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                            {[
                                { emoji: '🏆', label: 'Rank', value: `#${rank || '—'}`, color: '#facc15' },
                                { emoji: '🔥', label: 'Payments', value: String(txCount), color: '#e2e8f0' },
                                { emoji: '💀', label: 'Value', value: '$0', color: '#ef4444' },
                            ].map((s, i) => (
                                <div key={i} style={{
                                    flex: 1, background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid rgba(255, 255, 255, 0.05)',
                                    borderRadius: '10px', padding: '14px', textAlign: 'center' as const,
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '4px' }}>
                                        <span style={{ fontSize: '12px' }}>{s.emoji}</span>
                                        <span style={{ fontSize: '10px', color: 'rgba(226, 232, 240, 0.4)', fontWeight: 600, textTransform: 'uppercase' as const }}>{s.label}</span>
                                    </div>
                                    <p style={{ fontSize: '20px', fontWeight: 700, color: s.color }}>{s.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                        }}>
                            <span style={{ fontSize: '11px', color: 'rgba(226, 232, 240, 0.3)' }}>
                                Member since {new Date(memberSince).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </span>
                            <span style={{ fontSize: '11px', color: 'rgba(139, 92, 246, 0.5)', fontWeight: 600 }}>
                                subfornothing.vercel.app
                            </span>
                        </div>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 w-full max-w-[440px]">
                    <Button
                        onClick={handleDownload}
                        disabled={isCapturing}
                        variant="outline"
                        className="flex-1 border-violet-500/20 hover:border-violet-500/40 hover:bg-violet-500/10 cursor-pointer gap-2"
                    >
                        <Download className="h-4 w-4" />
                        {isCapturing ? 'Capturing...' : 'Save Image'}
                    </Button>
                    <Button
                        onClick={handleShareX}
                        disabled={isCapturing}
                        className="flex-1 bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-500 hover:to-fuchsia-400 text-white cursor-pointer gap-2"
                    >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                        Share on X
                    </Button>
                </div>

                <Button onClick={onClose} variant="ghost" className="text-muted-foreground hover:text-foreground text-xs cursor-pointer">
                    Close
                </Button>
            </div>
        </div>
    )
}
