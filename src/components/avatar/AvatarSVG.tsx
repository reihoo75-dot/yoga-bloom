import type { AvatarId } from '../../types'

interface AvatarSVGProps {
  id: AvatarId
  size?: number
  className?: string
  animate?: boolean
}

export function AvatarSVG({ id, size = 120, className = '' }: AvatarSVGProps) {
  const components: Record<AvatarId, JSX.Element> = {
    capybara: <Capybara size={size} />,
    deer: <Deer size={size} />,
    fox: <Fox size={size} />,
    cat: <Cat size={size} />,
    seal: <Seal size={size} />,
    bunny: <Bunny size={size} />,
  }
  return (
    <div className={className} style={{ width: size, height: size }}>
      {components[id]}
    </div>
  )
}

function Capybara({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {/* body */}
      <ellipse cx="60" cy="75" rx="40" ry="28" fill="#C4A07A" />
      {/* head */}
      <ellipse cx="60" cy="48" rx="28" ry="24" fill="#C4A07A" />
      {/* ears */}
      <ellipse cx="38" cy="30" rx="8" ry="6" fill="#B8906A" />
      <ellipse cx="82" cy="30" rx="8" ry="6" fill="#B8906A" />
      <ellipse cx="38" cy="30" rx="5" ry="3.5" fill="#D4A882" />
      <ellipse cx="82" cy="30" rx="5" ry="3.5" fill="#D4A882" />
      {/* eyes */}
      <circle cx="50" cy="47" r="5" fill="#5A3E28" />
      <circle cx="70" cy="47" r="5" fill="#5A3E28" />
      <circle cx="52" cy="45" r="1.5" fill="white" />
      <circle cx="72" cy="45" r="1.5" fill="white" />
      {/* nose */}
      <ellipse cx="60" cy="56" rx="6" ry="4" fill="#A87850" />
      <ellipse cx="60" cy="56" rx="3.5" ry="2.5" fill="#8C6040" />
      {/* smile */}
      <path d="M54 61 Q60 66 66 61" stroke="#8C6040" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* blush */}
      <ellipse cx="43" cy="54" rx="6" ry="3.5" fill="#F0B8A8" opacity="0.5" />
      <ellipse cx="77" cy="54" rx="6" ry="3.5" fill="#F0B8A8" opacity="0.5" />
      {/* legs */}
      <rect x="26" y="90" width="14" height="18" rx="7" fill="#B8906A" />
      <rect x="44" y="90" width="14" height="18" rx="7" fill="#B8906A" />
      <rect x="62" y="90" width="14" height="18" rx="7" fill="#B8906A" />
      <rect x="80" y="90" width="14" height="18" rx="7" fill="#B8906A" />
    </svg>
  )
}

function Deer({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {/* antlers */}
      <path d="M42 28 L35 14 M35 14 L28 8 M35 14 L40 6" stroke="#8C6840" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M78 28 L85 14 M85 14 L92 8 M85 14 L80 6" stroke="#8C6840" strokeWidth="2.5" strokeLinecap="round" />
      {/* body */}
      <ellipse cx="60" cy="78" rx="32" ry="25" fill="#D4A87A" />
      {/* head */}
      <ellipse cx="60" cy="50" rx="22" ry="26" fill="#D4A87A" />
      {/* inner face */}
      <ellipse cx="60" cy="56" rx="14" ry="16" fill="#E8C8A0" />
      {/* ears */}
      <ellipse cx="36" cy="42" rx="10" ry="7" fill="#D4A87A" />
      <ellipse cx="84" cy="42" rx="10" ry="7" fill="#D4A87A" />
      <ellipse cx="36" cy="42" rx="6" ry="4" fill="#F0C0A8" />
      <ellipse cx="84" cy="42" rx="6" ry="4" fill="#F0C0A8" />
      {/* eyes */}
      <circle cx="52" cy="46" r="5" fill="#3A2818" />
      <circle cx="68" cy="46" r="5" fill="#3A2818" />
      <circle cx="53.5" cy="44.5" r="1.5" fill="white" />
      <circle cx="69.5" cy="44.5" r="1.5" fill="white" />
      {/* nose */}
      <ellipse cx="60" cy="57" rx="4" ry="3" fill="#C08060" />
      {/* blush */}
      <ellipse cx="45" cy="52" rx="5" ry="3" fill="#F0A8A0" opacity="0.6" />
      <ellipse cx="75" cy="52" rx="5" ry="3" fill="#F0A8A0" opacity="0.6" />
      {/* legs */}
      <rect x="38" y="96" width="10" height="18" rx="5" fill="#C49060" />
      <rect x="52" y="96" width="10" height="18" rx="5" fill="#C49060" />
      <rect x="58" y="96" width="10" height="18" rx="5" fill="#C49060" />
      <rect x="72" y="96" width="10" height="18" rx="5" fill="#C49060" />
    </svg>
  )
}

function Fox({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {/* ears */}
      <polygon points="35,38 28,14 50,30" fill="#D4642A" />
      <polygon points="85,38 92,14 70,30" fill="#D4642A" />
      <polygon points="37,36 32,18 50,30" fill="#F0A878" />
      <polygon points="83,36 88,18 70,30" fill="#F0A878" />
      {/* body */}
      <ellipse cx="60" cy="78" rx="33" ry="26" fill="#D4642A" />
      {/* belly */}
      <ellipse cx="60" cy="82" rx="20" ry="18" fill="#F0D0B0" />
      {/* head */}
      <ellipse cx="60" cy="50" rx="25" ry="24" fill="#D4642A" />
      {/* face mask */}
      <ellipse cx="60" cy="56" rx="16" ry="16" fill="#F0D0B0" />
      {/* eyes */}
      <circle cx="50" cy="45" r="6" fill="#3A2010" />
      <circle cx="70" cy="45" r="6" fill="#3A2010" />
      <circle cx="52" cy="43" r="2" fill="white" />
      <circle cx="72" cy="43" r="2" fill="white" />
      {/* nose */}
      <ellipse cx="60" cy="56" rx="5" ry="3.5" fill="#8C3818" />
      {/* smile line */}
      <path d="M55 60 Q60 64 65 60" stroke="#8C3818" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* whiskers */}
      <line x1="30" y1="54" x2="50" y2="57" stroke="#8C6840" strokeWidth="1" opacity="0.6" />
      <line x1="30" y1="58" x2="50" y2="59" stroke="#8C6840" strokeWidth="1" opacity="0.6" />
      <line x1="90" y1="54" x2="70" y2="57" stroke="#8C6840" strokeWidth="1" opacity="0.6" />
      <line x1="90" y1="58" x2="70" y2="59" stroke="#8C6840" strokeWidth="1" opacity="0.6" />
      {/* tail */}
      <path d="M93 78 Q115 65 112 90 Q108 105 90 98" fill="#D4642A" />
      <path d="M108 90 Q106 100 92 97" fill="#F0F0F0" />
      {/* legs */}
      <rect x="38" y="96" width="12" height="16" rx="6" fill="#C05020" />
      <rect x="54" y="96" width="12" height="16" rx="6" fill="#C05020" />
      <rect x="68" y="96" width="12" height="16" rx="6" fill="#C05020" />
    </svg>
  )
}

function Cat({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {/* ears */}
      <polygon points="38,38 30,16 54,34" fill="#C8A0B4" />
      <polygon points="82,38 90,16 66,34" fill="#C8A0B4" />
      <polygon points="40,36 34,20 52,33" fill="#F0C8DC" />
      <polygon points="80,36 86,20 68,33" fill="#F0C8DC" />
      {/* body */}
      <ellipse cx="60" cy="80" rx="32" ry="26" fill="#C8A0B4" />
      {/* belly */}
      <ellipse cx="60" cy="84" rx="18" ry="16" fill="#F0D8E8" />
      {/* head */}
      <ellipse cx="60" cy="50" rx="26" ry="24" fill="#C8A0B4" />
      {/* eyes - almond shaped */}
      <ellipse cx="49" cy="46" rx="7" ry="5" fill="#3A2838" />
      <ellipse cx="71" cy="46" rx="7" ry="5" fill="#3A2838" />
      <ellipse cx="49" cy="46" rx="3.5" ry="4.5" fill="#1A1020" />
      <ellipse cx="71" cy="46" rx="3.5" ry="4.5" fill="#1A1020" />
      <circle cx="50" cy="44" r="1.5" fill="white" />
      <circle cx="72" cy="44" r="1.5" fill="white" />
      {/* nose */}
      <path d="M57 55 L60 52 L63 55 Z" fill="#D08090" />
      {/* whiskers */}
      <line x1="28" y1="52" x2="50" y2="55" stroke="#9A7888" strokeWidth="1" opacity="0.5" />
      <line x1="28" y1="56" x2="50" y2="57" stroke="#9A7888" strokeWidth="1" opacity="0.5" />
      <line x1="92" y1="52" x2="70" y2="55" stroke="#9A7888" strokeWidth="1" opacity="0.5" />
      <line x1="92" y1="56" x2="70" y2="57" stroke="#9A7888" strokeWidth="1" opacity="0.5" />
      {/* mouth */}
      <path d="M60 55 Q56 59 53 57" stroke="#D08090" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M60 55 Q64 59 67 57" stroke="#D08090" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      {/* blush */}
      <ellipse cx="44" cy="53" rx="6" ry="3" fill="#F0A8B8" opacity="0.5" />
      <ellipse cx="76" cy="53" rx="6" ry="3" fill="#F0A8B8" opacity="0.5" />
      {/* tail */}
      <path d="M92 86 Q110 78 108 98 Q106 110 90 100" fill="#C8A0B4" strokeWidth="2" />
      {/* legs */}
      <rect x="38" y="98" width="12" height="14" rx="6" fill="#B890A4" />
      <rect x="54" y="98" width="12" height="14" rx="6" fill="#B890A4" />
      <rect x="70" y="98" width="12" height="14" rx="6" fill="#B890A4" />
    </svg>
  )
}

function Seal({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {/* body - round blob shape */}
      <ellipse cx="60" cy="80" rx="38" ry="30" fill="#7AAAB8" />
      {/* belly */}
      <ellipse cx="60" cy="86" rx="24" ry="20" fill="#D8EEF5" />
      {/* head */}
      <ellipse cx="60" cy="46" rx="28" ry="26" fill="#7AAAB8" />
      {/* eyes - big round */}
      <circle cx="48" cy="42" r="8" fill="#1A2838" />
      <circle cx="72" cy="42" r="8" fill="#1A2838" />
      <circle cx="50" cy="39" r="3" fill="white" />
      <circle cx="74" cy="39" r="3" fill="white" />
      {/* nose */}
      <ellipse cx="60" cy="54" rx="5" ry="3.5" fill="#5A8898" />
      <ellipse cx="60" cy="54" rx="3" ry="2" fill="#3A6878" />
      {/* whiskers */}
      <line x1="30" y1="52" x2="50" y2="55" stroke="#6090A0" strokeWidth="1" opacity="0.6" />
      <line x1="30" y1="56" x2="50" y2="57" stroke="#6090A0" strokeWidth="1" opacity="0.6" />
      <line x1="90" y1="52" x2="70" y2="55" stroke="#6090A0" strokeWidth="1" opacity="0.6" />
      <line x1="90" y1="56" x2="70" y2="57" stroke="#6090A0" strokeWidth="1" opacity="0.6" />
      {/* smile */}
      <path d="M54 59 Q60 64 66 59" stroke="#3A6878" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      {/* blush */}
      <ellipse cx="42" cy="50" rx="7" ry="4" fill="#A8D8E8" opacity="0.5" />
      <ellipse cx="78" cy="50" rx="7" ry="4" fill="#A8D8E8" opacity="0.5" />
      {/* flippers */}
      <ellipse cx="22" cy="80" rx="14" ry="8" fill="#6090A0" transform="rotate(-20 22 80)" />
      <ellipse cx="98" cy="80" rx="14" ry="8" fill="#6090A0" transform="rotate(20 98 80)" />
      {/* tail flipper */}
      <ellipse cx="60" cy="108" rx="24" ry="10" fill="#6090A0" />
      <path d="M36 108 Q60 116 84 108" fill="#5080A0" />
    </svg>
  )
}

function Bunny({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {/* ears - long */}
      <ellipse cx="44" cy="22" rx="10" ry="22" fill="#E8C8D8" />
      <ellipse cx="76" cy="22" rx="10" ry="22" fill="#E8C8D8" />
      <ellipse cx="44" cy="22" rx="6" ry="18" fill="#F0B0C8" />
      <ellipse cx="76" cy="22" rx="6" ry="18" fill="#F0B0C8" />
      {/* body */}
      <ellipse cx="60" cy="82" rx="34" ry="28" fill="#E8C8D8" />
      {/* belly */}
      <ellipse cx="60" cy="87" rx="20" ry="17" fill="#F8EEF2" />
      {/* head */}
      <circle cx="60" cy="52" r="26" fill="#E8C8D8" />
      {/* eyes */}
      <circle cx="50" cy="48" r="6" fill="#C870A0" />
      <circle cx="70" cy="48" r="6" fill="#C870A0" />
      <circle cx="50" cy="48" r="3" fill="#8C3070" />
      <circle cx="70" cy="48" r="3" fill="#8C3070" />
      <circle cx="51.5" cy="46.5" r="1.5" fill="white" />
      <circle cx="71.5" cy="46.5" r="1.5" fill="white" />
      {/* nose */}
      <ellipse cx="60" cy="57" rx="3.5" ry="2.5" fill="#D87090" />
      {/* mouth */}
      <path d="M56 60 Q60 64 64 60" stroke="#D87090" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* whiskers */}
      <line x1="32" y1="55" x2="52" y2="57" stroke="#C8A0B8" strokeWidth="1" opacity="0.5" />
      <line x1="32" y1="59" x2="52" y2="59" stroke="#C8A0B8" strokeWidth="1" opacity="0.5" />
      <line x1="88" y1="55" x2="68" y2="57" stroke="#C8A0B8" strokeWidth="1" opacity="0.5" />
      <line x1="88" y1="59" x2="68" y2="59" stroke="#C8A0B8" strokeWidth="1" opacity="0.5" />
      {/* blush */}
      <ellipse cx="44" cy="55" rx="7" ry="4" fill="#F0A0C0" opacity="0.5" />
      <ellipse cx="76" cy="55" rx="7" ry="4" fill="#F0A0C0" opacity="0.5" />
      {/* tail */}
      <circle cx="92" cy="86" r="10" fill="#F8EEF2" />
      {/* legs */}
      <ellipse cx="40" cy="106" rx="14" ry="8" fill="#D8B0C8" />
      <ellipse cx="80" cy="106" rx="14" ry="8" fill="#D8B0C8" />
    </svg>
  )
}
