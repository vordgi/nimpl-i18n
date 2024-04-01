import LocaleSelect from '../../components/LocaleSelect'
import Nav from '../../components/Nav'
import Intro from '../../components/Intro'
import HomeContent from '../../components/HomeContent'
import Additional from '../../components/Additional'
import I18nProvider from '@nimpl/i18n/I18nProvider'
import createTranslation from '@nimpl/i18n/createTranslation'

export default async function Home({ params }: { params: { lang: string } }) {
  return (
    <I18nProvider lang={params.lang} clientTerms={[]}>
      <main>
        <LocaleSelect />
        <Nav />
        <Intro page="home" />
        <HomeContent />
        <Additional page="home" />
      </main>
    </I18nProvider>
  )
}

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const { t } = await createTranslation(params.lang);

  return {
    title: t('homePage.meta.title'),
  }
}
