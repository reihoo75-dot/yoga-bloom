import type { BodyPartDef } from '../types'

export const BODY_PARTS: BodyPartDef[] = [
  {
    id: 'neck',
    label: '頸部',
    recommendedPoses: ['cat_cow', 'fish', 'child', 'supine_twist'],
  },
  {
    id: 'shoulders',
    label: '肩膀',
    recommendedPoses: ['downdog', 'eagle', 'fish', 'warrior2', 'cobra'],
  },
  {
    id: 'chest',
    label: '胸腔',
    recommendedPoses: ['cobra', 'camel', 'fish', 'bridge', 'updog', 'warrior1'],
  },
  {
    id: 'spine',
    label: '脊背',
    recommendedPoses: ['cat_cow', 'cobra', 'child', 'supine_twist', 'downdog'],
  },
  {
    id: 'lower_back',
    label: '下背',
    recommendedPoses: ['child', 'cat_cow', 'bridge', 'supine_twist', 'pigeon'],
  },
  {
    id: 'core',
    label: '核心',
    recommendedPoses: ['plank', 'side_plank', 'boat', 'warrior3', 'headstand'],
  },
  {
    id: 'hips',
    label: '骨盆/髖',
    recommendedPoses: ['pigeon', 'lizard', 'butterfly', 'warrior2', 'lotus'],
  },
  {
    id: 'hamstrings',
    label: '大腿後側',
    recommendedPoses: ['forward_fold', 'seated_forward', 'downdog', 'warrior1'],
  },
  {
    id: 'legs',
    label: '腿部',
    recommendedPoses: ['warrior1', 'warrior2', 'tree', 'bridge', 'legs_up'],
  },
  {
    id: 'calves',
    label: '小腿/腳踝',
    recommendedPoses: ['downdog', 'forward_fold', 'mountain', 'tree'],
  },
]

// SVG coordinate data for body figure (viewBox: 0 0 100 200)
// Each part has clickable region data
export interface BodyPartRegion {
  id: string
  label: string
  // SVG path or circle/rect definition
  type: 'circle' | 'rect' | 'path'
  cx?: number
  cy?: number
  r?: number
  x?: number
  y?: number
  width?: number
  height?: number
  d?: string
}

export const BODY_PART_REGIONS: BodyPartRegion[] = [
  // Head
  { id: 'head', label: '頭部', type: 'circle', cx: 50, cy: 18, r: 12 },
  // Neck
  { id: 'neck', label: '頸部', type: 'rect', x: 44, y: 30, width: 12, height: 8 },
  // Shoulders (left/right combined as shoulders)
  { id: 'shoulders', label: '肩膀', type: 'rect', x: 22, y: 36, width: 56, height: 10 },
  // Chest
  { id: 'chest', label: '胸腔', type: 'rect', x: 30, y: 46, width: 40, height: 18 },
  // Core/Abdomen
  { id: 'core', label: '核心', type: 'rect', x: 32, y: 64, width: 36, height: 16 },
  // Lower back / Spine (shown as spine on back)
  { id: 'lower_back', label: '下背', type: 'rect', x: 36, y: 78, width: 28, height: 12 },
  // Hips/Pelvis
  { id: 'hips', label: '骨盆/髖', type: 'rect', x: 28, y: 90, width: 44, height: 14 },
  // Legs (thighs)
  { id: 'hamstrings', label: '大腿後側', type: 'rect', x: 28, y: 104, width: 44, height: 22 },
  // Legs lower
  { id: 'legs', label: '腿部', type: 'rect', x: 30, y: 126, width: 40, height: 20 },
  // Calves/ankles
  { id: 'calves', label: '小腿/腳踝', type: 'rect', x: 32, y: 146, width: 36, height: 22 },
]
