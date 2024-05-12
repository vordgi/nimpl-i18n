import getTranslation from "@nimpl/i18n/getTranslation";
import Link from "next/link";

export default async function Nav() {
    const { t, language } = await getTranslation();

    return (
        <div style={{ marginTop: 20, marginBottom: 20 }}>
            <ul>
                <li>
                    <Link href={`/${language}`}>{t("nav.home")}</Link>
                </li>
                <li>
                    <Link href={`/${language}/contacts`}>{t("nav.contacts")}</Link>
                </li>
            </ul>
        </div>
    );
}
