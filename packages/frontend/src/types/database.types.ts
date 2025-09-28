export interface Database {
  public: {
    Tables: {
      articles: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          excerpt: string | null
          category_id: string | null
          tags: string[] | null
          status: 'draft' | 'published' | 'archived'
          published_at: string | null
          created_at: string
          updated_at: string
          meta_title: string | null
          meta_description: string | null
          og_image_url: string | null
          view_count: number
          like_count: number
          share_count: number
          article_type: 'fuzoku' | 'fanza' | 'research'
          rating: number | null
          research_method: string | null
          research_period: string | null
          research_budget: number | null
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content: string
          excerpt?: string | null
          category_id?: string | null
          tags?: string[] | null
          status?: 'draft' | 'published' | 'archived'
          published_at?: string | null
          created_at?: string
          updated_at?: string
          meta_title?: string | null
          meta_description?: string | null
          og_image_url?: string | null
          view_count?: number
          like_count?: number
          share_count?: number
          article_type: 'fuzoku' | 'fanza' | 'research'
          rating?: number | null
          research_method?: string | null
          research_period?: string | null
          research_budget?: number | null
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: string
          excerpt?: string | null
          category_id?: string | null
          tags?: string[] | null
          status?: 'draft' | 'published' | 'archived'
          published_at?: string | null
          created_at?: string
          updated_at?: string
          meta_title?: string | null
          meta_description?: string | null
          og_image_url?: string | null
          view_count?: number
          like_count?: number
          share_count?: number
          article_type?: 'fuzoku' | 'fanza' | 'research'
          rating?: number | null
          research_method?: string | null
          research_period?: string | null
          research_budget?: number | null
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          parent_id: string | null
          sort_order: number
          article_type: 'fuzoku' | 'fanza' | 'research'
          color: string
          icon: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          parent_id?: string | null
          sort_order?: number
          article_type: 'fuzoku' | 'fanza' | 'research'
          color?: string
          icon?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          parent_id?: string | null
          sort_order?: number
          article_type?: 'fuzoku' | 'fanza' | 'research'
          color?: string
          icon?: string | null
          created_at?: string
        }
      }
      establishments: {
        Row: {
          id: string
          name: string
          type: 'soap' | 'health' | 'delivery' | 'other'
          area: string | null
          address: string | null
          phone: string | null
          website_url: string | null
          price_range: string | null
          business_hours: string | null
          services: string[] | null
          rating: number | null
          visit_count: number
          last_visit_date: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'soap' | 'health' | 'delivery' | 'other'
          area?: string | null
          address?: string | null
          phone?: string | null
          website_url?: string | null
          price_range?: string | null
          business_hours?: string | null
          services?: string[] | null
          rating?: number | null
          visit_count?: number
          last_visit_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'soap' | 'health' | 'delivery' | 'other'
          area?: string | null
          address?: string | null
          phone?: string | null
          website_url?: string | null
          price_range?: string | null
          business_hours?: string | null
          services?: string[] | null
          rating?: number | null
          visit_count?: number
          last_visit_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      fanza_works: {
        Row: {
          id: string
          fanza_id: string
          title: string
          actress_name: string | null
          director: string | null
          genre: string | null
          release_date: string | null
          duration: number | null
          fanza_url: string | null
          thumbnail_url: string | null
          price: number | null
          rating: number | null
          review_count: number
          last_checked_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          fanza_id: string
          title: string
          actress_name?: string | null
          director?: string | null
          genre?: string | null
          release_date?: string | null
          duration?: number | null
          fanza_url?: string | null
          thumbnail_url?: string | null
          price?: number | null
          rating?: number | null
          review_count?: number
          last_checked_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          fanza_id?: string
          title?: string
          actress_name?: string | null
          director?: string | null
          genre?: string | null
          release_date?: string | null
          duration?: number | null
          fanza_url?: string | null
          thumbnail_url?: string | null
          price?: number | null
          rating?: number | null
          review_count?: number
          last_checked_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      page_views: {
        Row: {
          id: string
          article_id: string | null
          ip_address: string | null
          user_agent: string | null
          referer: string | null
          country: string | null
          city: string | null
          viewed_at: string
          session_id: string | null
          is_unique_view: boolean
        }
        Insert: {
          id?: string
          article_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          referer?: string | null
          country?: string | null
          city?: string | null
          viewed_at?: string
          session_id?: string | null
          is_unique_view?: boolean
        }
        Update: {
          id?: string
          article_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          referer?: string | null
          country?: string | null
          city?: string | null
          viewed_at?: string
          session_id?: string | null
          is_unique_view?: boolean
        }
      }
      affiliate_clicks: {
        Row: {
          id: string
          article_id: string | null
          affiliate_type: 'fanza' | 'establishment' | 'other'
          affiliate_id: string | null
          clicked_at: string
          ip_address: string | null
          user_agent: string | null
          referer: string | null
          converted: boolean
          conversion_value: number | null
        }
        Insert: {
          id?: string
          article_id?: string | null
          affiliate_type: 'fanza' | 'establishment' | 'other'
          affiliate_id?: string | null
          clicked_at?: string
          ip_address?: string | null
          user_agent?: string | null
          referer?: string | null
          converted?: boolean
          conversion_value?: number | null
        }
        Update: {
          id?: string
          article_id?: string | null
          affiliate_type?: 'fanza' | 'establishment' | 'other'
          affiliate_id?: string | null
          clicked_at?: string
          ip_address?: string | null
          user_agent?: string | null
          referer?: string | null
          converted?: boolean
          conversion_value?: number | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
