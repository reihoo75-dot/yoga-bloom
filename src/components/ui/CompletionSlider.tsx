interface CompletionSliderProps {
  value: number
  onChange: (v: number) => void
}

const LABELS = [
  { range: [0, 25], label: '剛開始' },
  { range: [26, 50], label: '一半' },
  { range: [51, 75], label: '大部分' },
  { range: [76, 99], label: '幾乎完成' },
  { range: [100, 100], label: '完整完成' },
]

function getLabel(v: number) {
  return LABELS.find(l => v >= l.range[0] && v <= l.range[1])?.label ?? ''
}

export function CompletionSlider({ value, onChange }: CompletionSliderProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm text-warm-400">完成程度</p>
        <span className="text-sm font-medium text-sage-500">{getLabel(value)}</span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 appearance-none cursor-pointer rounded-full"
          style={{
            background: `linear-gradient(to right, #8FAF8F ${value}%, #E5CDB5 ${value}%)`,
          }}
        />
        <div
          className="absolute -top-6 text-xs text-sage-500 font-medium pointer-events-none"
          style={{ left: `calc(${value}% - 16px)` }}
        >
          {value}%
        </div>
      </div>
    </div>
  )
}
