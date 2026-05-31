import { LoginForm } from "./login-form";

export const metadata = {
  title: "Entrar — Bolso",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            <span className="font-heading text-xl font-bold">B</span>
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold tracking-tight">
              Bolso
            </h1>
            <p className="text-sm text-muted-foreground">
              Controle de despesas no seu bolso.
            </p>
          </div>
        </div>

        <LoginForm />
      </div>
    </main>
  );
}
