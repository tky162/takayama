import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export const updateSession = async (request: NextRequest) => {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // Supabase環境変数がない場合は、認証なしで続行
    console.warn('Supabase環境変数が設定されていません。認証なしで続行します。')
    return supabaseResponse
  }

  let supabase
  try {
    supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    })
  } catch (error) {
    console.error('Supabaseクライアント作成エラー:', error)
    return supabaseResponse
  }

  try {
    // refreshing the auth token
    await supabase.auth.getUser()
  } catch (error) {
    // 認証エラーの場合は無視して続行
    console.warn('Supabase auth error:', error)
  }

  return supabaseResponse
}
