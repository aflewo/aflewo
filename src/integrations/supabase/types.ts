export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      alumni: {
        Row: {
          bio: string | null
          created_at: string | null
          id: string
          image: string | null
          name: string
          organization: string | null
          role: string
          year_joined: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          id?: string
          image?: string | null
          name: string
          organization?: string | null
          role: string
          year_joined?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          id?: string
          image?: string | null
          name?: string
          organization?: string | null
          role?: string
          year_joined?: string | null
        }
        Relationships: []
      }
      attendance: {
        Row: {
          event_id: string
          id: string
          marked_at: string | null
          marked_by: string | null
          notes: string | null
          status: Database["public"]["Enums"]["attendance_status"]
          user_id: string
        }
        Insert: {
          event_id: string
          id?: string
          marked_at?: string | null
          marked_by?: string | null
          notes?: string | null
          status?: Database["public"]["Enums"]["attendance_status"]
          user_id: string
        }
        Update: {
          event_id?: string
          id?: string
          marked_at?: string | null
          marked_by?: string | null
          notes?: string | null
          status?: Database["public"]["Enums"]["attendance_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "chapter_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_marked_by_fkey"
            columns: ["marked_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      auditions: {
        Row: {
          admin_notes: string | null
          audio_public_id: string | null
          audio_url: string | null
          category: Database["public"]["Enums"]["audition_category"]
          chapter_id: string
          created_at: string | null
          id: string
          notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["audition_status"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          audio_public_id?: string | null
          audio_url?: string | null
          category: Database["public"]["Enums"]["audition_category"]
          chapter_id: string
          created_at?: string | null
          id?: string
          notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["audition_status"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          audio_public_id?: string | null
          audio_url?: string | null
          category?: Database["public"]["Enums"]["audition_category"]
          chapter_id?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["audition_status"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "auditions_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auditions_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auditions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chapter_events: {
        Row: {
          chapter_id: string
          created_at: string | null
          created_by: string | null
          description: string | null
          ends_at: string | null
          event_type: Database["public"]["Enums"]["event_type"]
          id: string
          is_public: boolean | null
          is_virtual: boolean | null
          location: string | null
          starts_at: string | null
          title: string
          updated_at: string | null
          venue_url: string | null
          virtual_link: string | null
        }
        Insert: {
          chapter_id: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          ends_at?: string | null
          event_type?: Database["public"]["Enums"]["event_type"]
          id?: string
          is_public?: boolean | null
          is_virtual?: boolean | null
          location?: string | null
          starts_at?: string | null
          title: string
          updated_at?: string | null
          venue_url?: string | null
          virtual_link?: string | null
        }
        Update: {
          chapter_id?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          ends_at?: string | null
          event_type?: Database["public"]["Enums"]["event_type"]
          id?: string
          is_public?: boolean | null
          is_virtual?: boolean | null
          location?: string | null
          starts_at?: string | null
          title?: string
          updated_at?: string | null
          venue_url?: string | null
          virtual_link?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chapter_events_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chapter_events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chapters: {
        Row: {
          color: string | null
          contact_email: string | null
          contact_phone: string | null
          country: string
          created_at: string | null
          description: string | null
          established: string | null
          event_date: string | null
          flag: string | null
          has_prayer_circle: boolean | null
          has_qr: boolean | null
          highlight: string | null
          id: string
          is_active: boolean | null
          link: string | null
          name: string
          registration_open: boolean | null
          size: string | null
          slug: string
          status: string | null
          upcoming_event: string | null
          updated_at: string | null
          venue: string | null
          venue_image: string | null
          whatsapp_link: string | null
        }
        Insert: {
          color?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          country?: string
          created_at?: string | null
          description?: string | null
          established?: string | null
          event_date?: string | null
          flag?: string | null
          has_prayer_circle?: boolean | null
          has_qr?: boolean | null
          highlight?: string | null
          id?: string
          is_active?: boolean | null
          link?: string | null
          name: string
          registration_open?: boolean | null
          size?: string | null
          slug: string
          status?: string | null
          upcoming_event?: string | null
          updated_at?: string | null
          venue?: string | null
          venue_image?: string | null
          whatsapp_link?: string | null
        }
        Update: {
          color?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          country?: string
          created_at?: string | null
          description?: string | null
          established?: string | null
          event_date?: string | null
          flag?: string | null
          has_prayer_circle?: boolean | null
          has_qr?: boolean | null
          highlight?: string | null
          id?: string
          is_active?: boolean | null
          link?: string | null
          name?: string
          registration_open?: boolean | null
          size?: string | null
          slug?: string
          status?: string | null
          upcoming_event?: string | null
          updated_at?: string | null
          venue?: string | null
          venue_image?: string | null
          whatsapp_link?: string | null
        }
        Relationships: []
      }
      donation_ledger: {
        Row: {
          account_ref: string | null
          amount_kes: number | null
          chapter_id: string | null
          created_at: string | null
          id: string
          matched_at: string | null
          mpesa_receipt: string | null
          mpesa_request_id: string | null
          phone_number: string | null
          raw_callback: Json | null
          status: Database["public"]["Enums"]["donation_status"] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          account_ref?: string | null
          amount_kes?: number | null
          chapter_id?: string | null
          created_at?: string | null
          id?: string
          matched_at?: string | null
          mpesa_receipt?: string | null
          mpesa_request_id?: string | null
          phone_number?: string | null
          raw_callback?: Json | null
          status?: Database["public"]["Enums"]["donation_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          account_ref?: string | null
          amount_kes?: number | null
          chapter_id?: string | null
          created_at?: string | null
          id?: string
          matched_at?: string | null
          mpesa_receipt?: string | null
          mpesa_request_id?: string | null
          phone_number?: string | null
          raw_callback?: Json | null
          status?: Database["public"]["Enums"]["donation_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donation_ledger_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donation_ledger_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_images: {
        Row: {
          category: string
          chapter: string
          created_at: string
          description: string | null
          height: number | null
          id: string
          image_url: string
          is_active: boolean | null
          is_wide: boolean | null
          public_id: string | null
          title: string
          uploaded_by: string | null
          width: number | null
          year: number
        }
        Insert: {
          category: string
          chapter: string
          created_at?: string
          description?: string | null
          height?: number | null
          id?: string
          image_url: string
          is_active?: boolean | null
          is_wide?: boolean | null
          public_id?: string | null
          title: string
          uploaded_by?: string | null
          width?: number | null
          year: number
        }
        Update: {
          category?: string
          chapter?: string
          created_at?: string
          description?: string | null
          height?: number | null
          id?: string
          image_url?: string
          is_active?: boolean | null
          is_wide?: boolean | null
          public_id?: string | null
          title?: string
          uploaded_by?: string | null
          width?: number | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "gallery_images_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      media_items: {
        Row: {
          category: string | null
          chapter: string | null
          created_at: string | null
          id: string
          image: string
          size: string | null
          source: string | null
          title: string
          type: string | null
          updated_at: string | null
          video_url: string | null
          views: string | null
          year: string | null
        }
        Insert: {
          category?: string | null
          chapter?: string | null
          created_at?: string | null
          id?: string
          image: string
          size?: string | null
          source?: string | null
          title: string
          type?: string | null
          updated_at?: string | null
          video_url?: string | null
          views?: string | null
          year?: string | null
        }
        Update: {
          category?: string | null
          chapter?: string | null
          created_at?: string | null
          id?: string
          image?: string
          size?: string | null
          source?: string | null
          title?: string
          type?: string | null
          updated_at?: string | null
          video_url?: string | null
          views?: string | null
          year?: string | null
        }
        Relationships: []
      }
      partners: {
        Row: {
          created_at: string | null
          id: string
          logo: string | null
          name: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          logo?: string | null
          name: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          logo?: string | null
          name?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          chapter_id: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          phone_number: string | null
          privacy_consent: boolean | null
          privacy_consent_at: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          chapter_id?: string | null
          created_at?: string | null
          email: string
          full_name?: string
          id: string
          phone_number?: string | null
          privacy_consent?: boolean | null
          privacy_consent_at?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          chapter_id?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          phone_number?: string | null
          privacy_consent?: boolean | null
          privacy_consent_at?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      registrations: {
        Row: {
          checked_in: boolean | null
          checked_in_at: string | null
          checked_in_by: string | null
          created_at: string | null
          email: string | null
          event_id: string
          full_name: string
          id: string
          phone_number: string | null
          ticket_ref: string | null
          user_id: string | null
        }
        Insert: {
          checked_in?: boolean | null
          checked_in_at?: string | null
          checked_in_by?: string | null
          created_at?: string | null
          email?: string | null
          event_id: string
          full_name: string
          id?: string
          phone_number?: string | null
          ticket_ref?: string | null
          user_id?: string | null
        }
        Update: {
          checked_in?: boolean | null
          checked_in_at?: string | null
          checked_in_by?: string | null
          created_at?: string | null
          email?: string | null
          event_id?: string
          full_name?: string
          id?: string
          phone_number?: string | null
          ticket_ref?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "registrations_checked_in_by_fkey"
            columns: ["checked_in_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "chapter_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registrations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      resources: {
        Row: {
          allowed_role: Database["public"]["Enums"]["user_role"]
          chapter_id: string | null
          created_at: string | null
          description: string | null
          event_id: string | null
          file_public_id: string | null
          file_size_bytes: number | null
          file_url: string
          id: string
          is_active: boolean | null
          mime_type: string | null
          resource_type: Database["public"]["Enums"]["resource_type"]
          song_title: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          allowed_role?: Database["public"]["Enums"]["user_role"]
          chapter_id?: string | null
          created_at?: string | null
          description?: string | null
          event_id?: string | null
          file_public_id?: string | null
          file_size_bytes?: number | null
          file_url: string
          id?: string
          is_active?: boolean | null
          mime_type?: string | null
          resource_type: Database["public"]["Enums"]["resource_type"]
          song_title?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          allowed_role?: Database["public"]["Enums"]["user_role"]
          chapter_id?: string | null
          created_at?: string | null
          description?: string | null
          event_id?: string | null
          file_public_id?: string | null
          file_size_bytes?: number | null
          file_url?: string
          id?: string
          is_active?: boolean | null
          mime_type?: string | null
          resource_type?: Database["public"]["Enums"]["resource_type"]
          song_title?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resources_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resources_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "chapter_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resources_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      stewards: {
        Row: {
          created_at: string | null
          id: string
          image: string | null
          name: string
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          image?: string | null
          name: string
          role: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          image?: string | null
          name?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      stories: {
        Row: {
          author: string
          chapter: string | null
          created_at: string | null
          desc_text: string
          id: string
          image: string | null
          quote: string | null
          subtitle: string | null
          title: string
          updated_at: string | null
          year: string | null
        }
        Insert: {
          author: string
          chapter?: string | null
          created_at?: string | null
          desc_text: string
          id?: string
          image?: string | null
          quote?: string | null
          subtitle?: string | null
          title: string
          updated_at?: string | null
          year?: string | null
        }
        Update: {
          author?: string
          chapter?: string | null
          created_at?: string | null
          desc_text?: string
          id?: string
          image?: string | null
          quote?: string | null
          subtitle?: string | null
          title?: string
          updated_at?: string | null
          year?: string | null
        }
        Relationships: []
      }
      system_audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown
          new_values: Json | null
          old_values: Json | null
          performed_by: string | null
          target_id: string
          target_table: string
          user_agent: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          performed_by?: string | null
          target_id: string
          target_table: string
          user_agent?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          performed_by?: string | null
          target_id?: string
          target_table?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "system_audit_logs_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_my_chapter_id: { Args: never; Returns: string }
      get_my_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      attendance_status: "present" | "absent" | "excused" | "late"
      audition_category:
        | "choir_soprano"
        | "choir_alto"
        | "choir_tenor"
        | "choir_bass"
        | "band_keys"
        | "band_guitar"
        | "band_drums"
        | "band_bass"
        | "band_strings"
        | "band_wind"
        | "production_camera"
        | "production_sound"
        | "production_livestream"
        | "volunteer_ushering"
        | "volunteer_security"
        | "volunteer_hospitality"
        | "dance"
      audition_status: "pending" | "shortlisted" | "accepted" | "rejected"
      donation_status: "pending" | "completed" | "failed" | "cancelled"
      event_type:
        | "main_event"
        | "rehearsal"
        | "audition"
        | "prayer_circle"
        | "outreach"
        | "other"
      resource_type:
        | "lyrics_pdf"
        | "chord_chart_pdf"
        | "vocal_stem_audio"
        | "backing_track_audio"
        | "rehearsal_video"
        | "announcement"
        | "other"
      user_role:
        | "super_admin"
        | "chapter_admin"
        | "choir_member"
        | "band_member"
        | "volunteer"
        | "applicant"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      attendance_status: ["present", "absent", "excused", "late"],
      audition_category: [
        "choir_soprano",
        "choir_alto",
        "choir_tenor",
        "choir_bass",
        "band_keys",
        "band_guitar",
        "band_drums",
        "band_bass",
        "band_strings",
        "band_wind",
        "production_camera",
        "production_sound",
        "production_livestream",
        "volunteer_ushering",
        "volunteer_security",
        "volunteer_hospitality",
        "dance",
      ],
      audition_status: ["pending", "shortlisted", "accepted", "rejected"],
      donation_status: ["pending", "completed", "failed", "cancelled"],
      event_type: [
        "main_event",
        "rehearsal",
        "audition",
        "prayer_circle",
        "outreach",
        "other",
      ],
      resource_type: [
        "lyrics_pdf",
        "chord_chart_pdf",
        "vocal_stem_audio",
        "backing_track_audio",
        "rehearsal_video",
        "announcement",
        "other",
      ],
      user_role: [
        "super_admin",
        "chapter_admin",
        "choir_member",
        "band_member",
        "volunteer",
        "applicant",
      ],
    },
  },
} as const
