/**
 * Hand-authored to mirror supabase/migrations/0001_schema.sql (6 tables).
 * Shape matches `supabase gen types typescript` output - regenerate with that
 * command once the project is linked, instead of hand-editing long-term.
 */

export type AgeGroup = "10s" | "20s" | "30s" | "40s" | "50s" | "60s+";
export type Gender = "male" | "female" | "other";
export type UserRole = "member" | "admin";
export type MatePostStatus = "RECRUITING" | "CLOSED" | "COMPLETED";
export type MateApplicationStatus = "PENDING" | "ACCEPTED" | "REJECTED";
export type ReportTargetType = "mate_post" | "user_profile";
export type ReportStatus = "PENDING" | "REVIEWED" | "RESOLVED";

export interface Database {
  public: {
    Tables: {
      user_profile: {
        Row: {
          id: string;
          nickname: string;
          age_group: AgeGroup;
          gender: Gender | null;
          travel_style: string[];
          bio: string | null;
          is_adult: boolean;
          adult_verified_at: string | null;
          role: UserRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          nickname: string;
          age_group: AgeGroup;
          gender?: Gender | null;
          travel_style?: string[];
          bio?: string | null;
          is_adult?: boolean;
          adult_verified_at?: string | null;
          role?: UserRole;
        };
        Update: Partial<Database["public"]["Tables"]["user_profile"]["Insert"]>;
        Relationships: [];
      };
      mate_post: {
        Row: {
          id: string;
          author_id: string;
          title: string;
          country: string;
          region: string | null;
          start_date: string;
          end_date: string;
          capacity: number;
          preferred_conditions: string | null;
          travel_style: string[];
          description: string;
          safety_agreed: boolean;
          safety_agreed_at: string | null;
          status: MatePostStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          author_id: string;
          title: string;
          country: string;
          region?: string | null;
          start_date: string;
          end_date: string;
          capacity: number;
          preferred_conditions?: string | null;
          travel_style?: string[];
          description: string;
          safety_agreed: boolean;
          safety_agreed_at?: string | null;
          status?: MatePostStatus;
        };
        Update: Partial<Database["public"]["Tables"]["mate_post"]["Insert"]>;
        Relationships: [];
      };
      mate_application: {
        Row: {
          id: string;
          post_id: string;
          applicant_id: string;
          message: string;
          status: MateApplicationStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          applicant_id: string;
          message: string;
          status?: MateApplicationStatus;
        };
        Update: Partial<Database["public"]["Tables"]["mate_application"]["Insert"]>;
        Relationships: [];
      };
      user_block: {
        Row: {
          id: string;
          blocker_id: string;
          blocked_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          blocker_id: string;
          blocked_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["user_block"]["Insert"]>;
        Relationships: [];
      };
      report: {
        Row: {
          id: string;
          reporter_id: string;
          target_type: ReportTargetType;
          target_id: string;
          reason: string;
          status: ReportStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          reporter_id: string;
          target_type: ReportTargetType;
          target_id: string;
          reason: string;
          status?: ReportStatus;
        };
        Update: Partial<Database["public"]["Tables"]["report"]["Insert"]>;
        Relationships: [];
      };
      app_setting: {
        Row: {
          key: string;
          value: string;
          updated_by: string | null;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: string;
          updated_by?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["app_setting"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
