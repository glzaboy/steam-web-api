
import Form from "./MyForm";
import { Suspense, use } from 'react';
import type { Metadata } from "next";
interface Joke {
  value: string
  categories: string[]
  created_at: string
  icon_url: string
  id: string
  updated_at: string
  url: string
}


export const metadata: Metadata = {
  title: "Steam Sda 超级Steam CsGo 饰品购买出售工具",
  description: "Steam Sda 超级Steam CsGo 饰品购买出售工具，让你轻松购买和出售CSGO饰品，让你的CSGO游戏更加丰富！",
  keywords: "Steam Sda 超级Steam CsGo 饰品购买出售工具，让你轻松购买和出售CSGO饰品，让你的CSGO游戏更加丰富！",
  openGraph: {
    title: "Steam Sda 超级Steam CsGo 饰品购买出售工具",
    description: "Steam Sda 超级Steam CsGo 饰品购买出售工具，让你轻松购买和出售CSGO饰品，让你的CSGO游戏更加丰富！",
  },
  twitter: {
    title: "Steam Sda 超级Steam CsGo 饰品购买出售工具",
    description: "Steam Sda 超级Steam CsGo 饰品购买出售工具，让你轻松购买和出售CSGO饰品，让你的CSGO游戏更加丰富！",
  },
  authors: [
    { name: "glzaboy", url: "github.com/SteamSda" }
  ]
};
// 定义服务端动作
async function submitData(formData: FormData) {
  'use server' // 必须标记！
  // 处理表单数据（如写入数据库）
  console.log('Server action:', formData.get('name'))
}
export default async function Home() {
  // 定义 API 函数类型
  const fetchJoke = async (): Promise<Joke> => {
    const res = await fetch('https://api.chucknorris.io/jokes/random')
    if (!res.ok) throw new Error('Failed to fetch joke')
    return res.json() as Promise<Joke>
  }
  interface ItemProps {
    api: Promise<Joke>
  }
  const Item = (props: ItemProps) => {
    const joke = use(props.api)
    return (
      <div>
        <div>{joke.value}</div>
      </div>
    )
  }

  const __api = fetchJoke()
  return <>
    <div id='tips'>每日一名</div>
    <Suspense fallback={<div>loading...</div>}>
      <Item api={__api} />
    </Suspense>
    <div>内容建设中</div>
    <Form action={submitData} />
  </>
}
