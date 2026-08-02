// Локально вшитые шрифты (self-host через @fontsource) — сборка НЕ ходит в Google Fonts.
// UI — Inter (латиница + кириллица). Японские (переключаются в настройках):
// Noto Sans JP (базовый), Zen Kaku, M PLUS Rounded, Kosugi Maru, Shippori Mincho.
import "@fontsource-variable/inter/index.css";
import "@fontsource/noto-sans-jp/japanese-400.css";
import "@fontsource/noto-sans-jp/japanese-700.css";
import "@fontsource/noto-sans-jp/latin-400.css";
import "@fontsource/zen-kaku-gothic-new/japanese-400.css";
import "@fontsource/zen-kaku-gothic-new/japanese-700.css";
import "@fontsource/zen-kaku-gothic-new/latin-400.css";
import "@fontsource/m-plus-rounded-1c/japanese-400.css";
import "@fontsource/m-plus-rounded-1c/japanese-700.css";
import "@fontsource/m-plus-rounded-1c/latin-400.css";
import "@fontsource/kosugi-maru/japanese-400.css";
import "@fontsource/kosugi-maru/latin-400.css";
import "@fontsource/shippori-mincho/japanese-400.css";
import "@fontsource/shippori-mincho/japanese-700.css";
import "@fontsource/shippori-mincho/latin-400.css";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "日本語トレーナー — тренажёр японского",
  description: "Личный тренажёр японского: карточки, чтение, предложения, тексты.",
};

// Мобильный вьюпорт: тянемся под чёлку/индикатор (safe-area работает),
// запрещаем зум и авто-масштаб — приложение ведёт себя как нативное.
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" suppressHydrationWarning className="h-full antialiased">
      <body className="h-full flex flex-col overflow-hidden bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster
            position="top-center"
            richColors
            offset="calc(env(safe-area-inset-top) + 12px)"
            mobileOffset="calc(env(safe-area-inset-top) + 12px)"
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
