import { TutorialStep } from './types';

export const PITS_PER_SIDE = 6;
export const INITIAL_STONES = 4;
export const TOTAL_PITS = 14; // 6 bottom + 1 store + 6 top + 1 store

// Board Indices
// Bottom Player (P1): 0, 1, 2, 3, 4, 5 | Store: 6
// Top Player (P2):    12, 11, 10, 9, 8, 7 | Store: 13 (Visual order is reversed for logic array)
// Logic Array: [P1_0, P1_1, ..., P1_Store, P2_0, P2_1, ..., P2_Store]
// Actually standardizing logic array:
// 0-5: Bottom Pits (Left to Right)
// 6: Bottom Store
// 7-12: Top Pits (Right to Left from Bottom perspective, or Left to Right from Top perspective)
// 13: Top Store

export const BOTTOM_PITS = [0, 1, 2, 3, 4, 5];
export const BOTTOM_STORE = 6;
export const TOP_PITS = [7, 8, 9, 10, 11, 12];
export const TOP_STORE = 13;

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    title: "Mangala'ya Hoşgeldin",
    description: "Mangala, Türk zeka ve strateji oyunudur. Amacın, hazinende en çok taşı toplamaktır. Oyun 48 taş ve 12 kuyu ile oynanır."
  },
  {
    title: "Başlangıç",
    description: "Her kuyuda 4 taş bulunur. Kendi tarafındaki (alt sıra) herhangi bir kuyudan taşları alarak oyuna başlarsın."
  },
  {
    title: "Dağıtım Kuralı",
    description: "Aldığın kuyudaki taşları saatin tersi yönünde (sağa doğru) tek tek kuyulara bırakırsın. Eğer aldığın kuyuda birden fazla taş varsa, ilk taşı kendi kuyuna bırakırsın. Tek taş varsa bir sonrakine ilerletirsin."
  },
  {
    title: "Hazine Kuralı",
    description: "Eğer dağıttığın son taş senin hazinene (büyük kuyu) denk gelirse, tekrar oynama hakkı kazanırsın! Stratejini buna göre kur."
  },
  {
    title: "Çift Kuralı (Baba)",
    description: "Son taşın rakibinin kuyusuna denk gelip oradaki taş sayısını ÇİFT yaparsa (2, 4, 6...), o kuyudaki tüm taşları alıp kendi hazinene atarsın."
  },
  {
    title: "Boş Kuyu Kuralı",
    description: "Eğer son taşın kendi tarafındaki boş bir kuyuya denk gelirse ve hemen karşısındaki rakip kuyusunda taş varsa; hem kendi taşını hem de rakibin taşlarını alırsın."
  },
  {
    title: "Oyun Sonu",
    description: "Kendi bölgesindeki taşları ilk bitiren oyuncu, rakibin bölgesinde kalan tüm taşları da kazanır. En çok taşı toplayan kazanır."
  }
];

export const STONE_COLORS = [
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-blue-500',
  'bg-purple-500',
  'bg-teal-400'
];