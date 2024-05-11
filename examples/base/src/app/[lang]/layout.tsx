import { notFound } from "next/navigation";

export const metadata = {
    title: "Next.js @nimpl/i18n Example",
    description: "",
};

type RootLayoutProps = { children: React.ReactNode; params: { lang: string } };

export default function RootLayout({ children, params }: RootLayoutProps) {
    if (!["en", "fr", "de"].includes(params.lang)) return notFound();

    return (
        <html lang={params.lang}>
            <body>{children}</body>
        </html>
    );
}

export async function generateStaticParams() {
    return [{ lang: "en" }, { lang: "fr" }, { lang: "de" }];
}
