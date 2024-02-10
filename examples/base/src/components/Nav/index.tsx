import getTranslation from 'next-translation/getTranslation'
import Link from 'next/link'

export default async function Nav() {
  const { t, lang } = getTranslation()

  return (
    <div style={{ marginTop: 20, marginBottom: 20 }}>
      <ul>
        <li>
          <Link href={`/${lang}`}>{t('nav.home')}</Link>
        </li>
        <li>
          <Link href={`/${lang}/contacts`}>{t('nav.contacts')}</Link>
        </li>
      </ul>
    </div>
  )
}
