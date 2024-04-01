import getTranslation from '@nimpl/i18n/getTranslation'
import Link from 'next/link'

const languages = ['en', 'fr', 'de']

export default function LocaleSelect() {
  const { t } = getTranslation()

  return (
    <div style={{ marginTop: 20, marginBottom: 20 }}>
      <p>{t('selectLocale.title')}</p>
      <ul>
        {languages.map((language) => (
          <li key={language}>
            <Link href={`/${language}`}>{language}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
