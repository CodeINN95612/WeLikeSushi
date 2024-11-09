export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
	graphql_public: {
		Tables: {
			[_ in never]: never;
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			graphql: {
				Args: {
					operationName?: string;
					query?: string;
					variables?: Json;
					extensions?: Json;
				};
				Returns: Json;
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
	public: {
		Tables: {
			restaurants: {
				Row: {
					address: string;
					city: string;
					country: string;
					created_at: string | null;
					id: string;
					name: string;
					tags: string[];
				};
				Insert: {
					address: string;
					city: string;
					country: string;
					created_at?: string | null;
					id?: string;
					name: string;
					tags: string[];
				};
				Update: {
					address?: string;
					city?: string;
					country?: string;
					created_at?: string | null;
					id?: string;
					name?: string;
					tags?: string[];
				};
				Relationships: [];
			};
			review_rubric_scores: {
				Row: {
					id: string;
					review_id: string | null;
					rubric_element_id: string | null;
					score: number;
				};
				Insert: {
					id?: string;
					review_id?: string | null;
					rubric_element_id?: string | null;
					score: number;
				};
				Update: {
					id?: string;
					review_id?: string | null;
					rubric_element_id?: string | null;
					score?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'review_rubric_scores_review_id_fkey';
						columns: ['review_id'];
						isOneToOne: false;
						referencedRelation: 'reviews';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'review_rubric_scores_rubric_element_id_fkey';
						columns: ['rubric_element_id'];
						isOneToOne: false;
						referencedRelation: 'rubric_elements';
						referencedColumns: ['id'];
					}
				];
			};
			reviews: {
				Row: {
					created_at: string | null;
					id: string;
					rating: number | null;
					restaurant_id: string | null;
					review_text: string | null;
					user_id: string | null;
					visit_date: string;
				};
				Insert: {
					created_at?: string | null;
					id?: string;
					rating?: number | null;
					restaurant_id?: string | null;
					review_text?: string | null;
					user_id?: string | null;
					visit_date: string;
				};
				Update: {
					created_at?: string | null;
					id?: string;
					rating?: number | null;
					restaurant_id?: string | null;
					review_text?: string | null;
					user_id?: string | null;
					visit_date?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'reviews_restaurant_id_fkey';
						columns: ['restaurant_id'];
						isOneToOne: false;
						referencedRelation: 'restaurants';
						referencedColumns: ['id'];
					}
				];
			};
			rubric_elements: {
				Row: {
					id: string;
					name: string;
					weight: number;
				};
				Insert: {
					id?: string;
					name: string;
					weight: number;
				};
				Update: {
					id?: string;
					name?: string;
					weight?: number;
				};
				Relationships: [];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
	PublicTableNameOrOptions extends
		| keyof (PublicSchema['Tables'] & PublicSchema['Views'])
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
				Database[PublicTableNameOrOptions['schema']]['Views'])
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
			Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
		? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema['Tables']
		? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema['Tables']
		? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
	EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
		: never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
	? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
	: PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
		? PublicSchema['Enums'][PublicEnumNameOrOptions]
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof PublicSchema['CompositeTypes']
		| { schema: keyof Database },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
		: never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
	? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
		? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
		: never;