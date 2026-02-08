import HelperProfileClient from './HelperProfileClient';

// Generate static params for known helper IDs
export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
  ];
}

// Static mock data - in real app, fetch from API
const mockHelperData: Record<string, any> = {
  '1': {
    id: '1',
    name: 'Maria Santos',
    age: 34,
    nationality: '菲律賓',
    experience: 5,
    rating: 4.8,
    reviews: 12,
    bio: '大家好，我叫 Maria，來自菲律賓馬尼拉。我有5年香港工作經驗，曾服務過3個家庭。我擅長照顧嬰幼兒，烹飪中西餐，以及家務管理。我性格開朗、細心、有愛心，喜歡小朋友。我希望找到一個長期穩定的家庭工作。',
    skills: ['嬰兒護理', '幼兒教育', '煮食', '家務清潔', '熨燙'],
    languages: [
      { name: '廣東話', level: '流利', percentage: 85 },
      { name: '英文', level: '良好', percentage: 75 },
      { name: '菲律賓話', level: '母語', percentage: 100 },
    ],
    certifications: [
      { name: '嬰兒急救證書', issuer: '香港紅十字會', year: '2023' },
      { name: '烹飪課程畢業', issuer: '僱員再培訓局', year: '2022' },
    ],
    workHistory: [
      {
        id: 1,
        familyName: '陳家',
        location: '西貢',
        period: '2020 - 2024',
        duration: '4年',
        role: '住家保母',
        duties: ['照顧新生嬰兒', '煮食', '家務'],
        children: '2名 (0-3歲)',
        rating: 5,
        review: 'Maria 很專業，把寶寶照顧得很好，煮的菜也很美味。'
      },
      {
        id: 2,
        familyName: '李家',
        location: '九龍塘',
        period: '2019 - 2020',
        duration: '1年',
        role: '家務助理',
        duties: ['家務清潔', '煮食', '買餸'],
        children: null,
        rating: 5,
        review: '工作勤奮，態度認真。'
      },
    ],
    availability: '即時可到職',
    expectedSalary: '$5,200',
    currentLocation: '現居香港',
    religion: '天主教',
    maritalStatus: '已婚',
    children: '2名子女在菲律賓',
    cookingPreference: '擅長中菜、西餐、烘焙',
    petFriendly: true,
    wuxing: '木',
    zodiac: '天秤座',
    zodiacEmoji: '♎',
    matchScore: 92,
    verified: true,
  },
  '2': {
    id: '2',
    name: 'Siti Rahayu',
    age: 29,
    nationality: '印尼',
    experience: 3,
    rating: 4.6,
    reviews: 8,
    bio: '我來自印尼爪哇，有3年長者護理經驗。我細心有耐性，持有護理證書。希望能找到一份照顧長者的工作。',
    skills: ['長者護理', '家務清潔', '寵物照顧', '煮食'],
    languages: [
      { name: '廣東話', level: '中等', percentage: 60 },
      { name: '英文', level: '基本', percentage: 40 },
      { name: '印尼話', level: '母語', percentage: 100 },
    ],
    certifications: [
      { name: '護理助理證書', issuer: '明愛醫院', year: '2023' },
    ],
    workHistory: [
      {
        id: 1,
        familyName: '張家',
        location: '大埔',
        period: '2021 - 2024',
        duration: '3年',
        role: '長者護理員',
        duties: ['照顧行動不便長者', '陪診', '煮食', '家務'],
        children: null,
        rating: 4.5,
        review: '細心負責，對老人家很有耐性。'
      },
    ],
    availability: '2星期後',
    expectedSalary: '$5,000',
    currentLocation: '現居香港',
    religion: '回教',
    maritalStatus: '已婚',
    children: '1名子女在印尼',
    cookingPreference: '印尼菜、簡單中菜',
    petFriendly: true,
    wuxing: '水',
    zodiac: '金牛座',
    zodiacEmoji: '♉',
    matchScore: 88,
    verified: true,
  },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function HelperProfilePage({ params }: PageProps) {
  const { id } = await params;
  const helper = mockHelperData[id] || mockHelperData['1'];

  return <HelperProfileClient helper={helper} />;
}
