import I18nProvider from '@nimpl/i18n/I18nProvider'
import LocaleSelect from '../../components/LocaleSelect'

export default async function Home() {
  return (
    <I18nProvider lang='en' clientTerms={[]}>
      <main>
        <h1>Root page</h1>
        <LocaleSelect />
      </main>
    </I18nProvider>
  )
}
