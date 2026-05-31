// Tipos espelhando o schema definido em supabase/schema.sql.
// Para um projeto maior, prefira gerar com `supabase gen types typescript`.

export type Profile = {
  id: string;
  email: string;
  created_at: string;
};

export type Category = {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
};

export type Expense = {
  id: string;
  user_id: string;
  amount: number; // centavos
  description: string;
  date: string; // ISO yyyy-mm-dd
  category_id: string | null;
  created_at: string;
};

export type ExpenseWithCategory = Expense & {
  category: Pick<Category, "id" | "name" | "color"> | null;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Pick<Profile, "id" | "email"> & Partial<Profile>;
        Update: Partial<Profile>;
      };
      categories: {
        Row: Category;
        Insert: Pick<Category, "user_id" | "name"> & Partial<Category>;
        Update: Partial<Category>;
      };
      expenses: {
        Row: Expense;
        Insert: Pick<Expense, "user_id" | "amount" | "date"> & Partial<Expense>;
        Update: Partial<Expense>;
      };
    };
  };
};
