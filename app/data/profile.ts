// モックデータ。中身は後で本物に差し替える。

export const profile = {
  name: 'いぶき',
  nameEn: 'Ibuki',
  role: 'Software Engineer',
  catchphrase: 'いぶきのポートフォリオサイトへようこそ！',
  about: [
    '〇〇大学 〇〇学部に在籍しています（〇〇卒見込み）。',
    'Web 開発を中心に、個人開発やハッカソンに取り組んでいます。'
  ],
  vision: 'ここに目指すエンジニア像を書きます。',
  links: {
    github: 'https://github.com/ibuki3268',
    twitter: '#',
    email: '#'
  }
}

export const stats = [
  { label: 'プロジェクト', value: '00+' },
  { label: '経験・実績', value: '00+' },
  { label: '学習期間', value: '0年' },
  { label: '技術スタック', value: '00+' }
]

export type Skill = { name: string, level: string, category: string }

export const skills: Skill[] = [
  { name: 'TypeScript', level: '中級', category: 'Language' },
  { name: 'JavaScript', level: '中級', category: 'Language' },
  { name: 'Vue.js', level: '中級', category: 'Frontend' },
  { name: 'Nuxt', level: '初級', category: 'Frontend' },
  { name: 'Node.js', level: '初級', category: 'Backend' },
  { name: 'Git', level: '中級', category: 'Tool' }
]

export type Work = {
  title: string
  description: string
  date: string
  tags: string[]
  url?: string
}

export const works: Work[] = [
  { title: '作品タイトル 1', description: '作品の説明が入ります。', date: '2026/09', tags: ['Vue', 'TypeScript'] },
  { title: '作品タイトル 2', description: '作品の説明が入ります。', date: '2026/08', tags: ['Nuxt'] },
  { title: '作品タイトル 3', description: '作品の説明が入ります。', date: '2026/07', tags: ['Node.js'] },
  { title: '作品タイトル 4', description: '作品の説明が入ります。', date: '2026/06', tags: ['Python'] },
  { title: 'このサイト', description: 'Nuxt で作ったポートフォリオサイト。', date: '2026/10', tags: ['Nuxt', 'Vue'] }
]

export type Activity = {
  title: string
  description: string
  date: string
  category: 'ハッカソン' | 'イベント' | 'インターン' | '開発'
}

export const activities: Activity[] = [
  { title: '〇〇ハッカソン 参加', description: '活動の説明が入ります。', date: '2026/09', category: 'ハッカソン' },
  { title: '〇〇 LT 会 登壇', description: '活動の説明が入ります。', date: '2026/08', category: 'イベント' },
  { title: '〇〇株式会社 サマーインターン', description: '活動の説明が入ります。', date: '2026/08', category: 'インターン' },
  { title: '〇〇大学 入学', description: '活動の説明が入ります。', date: '2023/04', category: '開発' }
]
